from fastapi import FastAPI, UploadFile, HTTPException, Form, File, Body, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Literal, Union, Dict, List, Any
import google.generativeai as genai
import json
import requests
from bs4 import BeautifulSoup
from youtube_transcript_api import YouTubeTranscriptApi
import PyPDF2
import io
import os
import shutil
from datetime import datetime, timedelta
import asyncio
from fastapi.staticfiles import StaticFiles
from script import create_podcast
from urllib.parse import urlparse, parse_qs
import uuid
from pathlib import Path
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from utils.cleanup import cleanup_podcast_files, cleanup_old_files

app = FastAPI(
    title="Podcast Generator API",
    description="API for generating podcasts from various content sources including PDF files, YouTube videos, web articles, and text content.",
    version="1.0.0"
)

# Enable CORS with specific origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React app's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create necessary directories
UPLOAD_DIR = "files"
PODCAST_DIR = "podcast_output"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(PODCAST_DIR, exist_ok=True)

# Mount static directories
app.mount("/podcasts", StaticFiles(directory=PODCAST_DIR), name="podcasts")

class PodcastInput(BaseModel):
    host_name: str
    guest_name: str
    youtube_url: Optional[str] = None
    text_content: Optional[str] = None
    web_url: Optional[str] = None
    length: Literal["Adaptive", "Short", "Medium", "Long"] = "Adaptive"

async def cleanup_old_files():
    """Clean up files older than 1 hour"""
    while True:
        try:
            current_time = datetime.now()
            
            # Clean up files directory
            for file in os.listdir(UPLOAD_DIR):
                file_path = os.path.join(UPLOAD_DIR, file)
                try:
                    # Remove all files in upload directory
                    os.remove(file_path)
                except Exception as e:
                    print(f"Error removing file {file_path}: {e}")
            
            # Clean up podcast directory
            for file in os.listdir(PODCAST_DIR):
                file_path = os.path.join(PODCAST_DIR, file)
                try:
                    # Get file creation time
                    file_time = datetime.fromtimestamp(os.path.getctime(file_path))
                    # Remove if older than 1 hour
                    if current_time - file_time > timedelta(hours=1):
                        os.remove(file_path)
                        print(f"Removed old podcast file: {file}")
                except Exception as e:
                    print(f"Error processing file {file_path}: {e}")
            
        except Exception as e:
            print(f"Error during cleanup: {e}")
        
        # Check every minute
        await asyncio.sleep(60)

@app.on_event("startup")
async def startup_event():
    """Start the cleanup task when the application starts"""
    asyncio.create_task(cleanup_old_files())

# Set up the cleanup scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(
    func=lambda: cleanup_old_files(PODCAST_DIR, max_age_minutes=30),
    trigger=IntervalTrigger(minutes=30),  # Run every 30 minutes
    id='cleanup_job',
    name='Clean up old podcast files',
    replace_existing=True
)
scheduler.start()

async def save_uploaded_file(file: UploadFile) -> str:
    """Save an uploaded file and return its path"""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    # Generate a unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    try:
        # Save the file
        contents = await file.read()
        with open(file_path, 'wb') as f:
            f.write(contents)
        return file_path
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")

async def validate_content_sources(
    youtube_url: Optional[str],
    text_content: Optional[str],
    web_url: Optional[str],
    file: Optional[UploadFile]
) -> None:
    """Validate that exactly one content source is provided"""
    sources = [
        bool(youtube_url and youtube_url != "string" and youtube_url.strip()),
        bool(text_content and text_content != "string" and text_content.strip()),
        bool(web_url and web_url != "string" and web_url.strip()),
        bool(file is not None)
    ]
    if sum(1 for source in sources if source) != 1:
        raise HTTPException(
            status_code=400,
            detail="Exactly one content source must be provided (youtube_url, text_content, web_url, or file)"
        )

async def get_content(
    youtube_url: Optional[str],
    text_content: Optional[str],
    web_url: Optional[str],
    file: Optional[UploadFile]
):
    content_type = None
    content = None
    
    if text_content and text_content != "string" and text_content.strip():
        content_type = "article"
        content = text_content
    elif web_url and web_url != "string" and web_url.strip():
        content_type = "web article"
        content = extract_text_from_web(web_url)
    elif youtube_url and youtube_url != "string" and youtube_url.strip():
        content_type = "YouTube video"
        content = get_youtube_transcript(youtube_url)
    elif file:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF document")
        content_type = "PDF document"
        file_path = await save_uploaded_file(file)
        content = extract_text_from_pdf(file_path)
    else:
        raise HTTPException(status_code=400, detail="No valid content source provided")
    
    return content, content_type

def extract_text_from_web(url: str) -> str:
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        return soup.get_text()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error extracting text from web URL: {str(e)}")

def extract_youtube_id(url: str) -> str:
    parsed_url = urlparse(url)
    if parsed_url.hostname == 'youtu.be':
        return parsed_url.path[1:]
    if parsed_url.hostname in ('www.youtube.com', 'youtube.com'):
        if parsed_url.path == '/watch':
            return parse_qs(parsed_url.query)['v'][0]
    raise ValueError("Invalid YouTube URL")

def get_youtube_transcript(url: str) -> str:
    """Get transcript from YouTube video"""
    try:
        # Extract video ID from URL
        if "v=" in url:
            video_id = url.split("v=")[1].split("&")[0]
        else:
            video_id = url.split("/")[-1]

        # Try different English language codes
        english_codes = ['en', 'en-US', 'en-GB', 'en-IN', 'en-AU', 'en-CA']
        transcript = None
        error_message = ""

        for lang_code in english_codes:
            try:
                transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=[lang_code])
                break
            except Exception as e:
                error_message = str(e)
                continue

        if not transcript:
            # If no English transcript found, try auto-generated ones
            try:
                transcript = YouTubeTranscriptApi.get_transcript(video_id)
            except Exception as e:
                error_message = str(e)

        if not transcript:
            raise HTTPException(
                status_code=400, 
                detail=f"Could not find any English transcript for the video. Error: {error_message}"
            )

        # Combine all transcript text
        full_text = " ".join(item["text"] for item in transcript)
        return full_text

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error getting YouTube transcript: {str(e)}")

def extract_text_from_pdf(file_path: str) -> str:
    try:
        with open(file_path, 'rb') as file:
            # Create a PDF reader object
            pdf_reader = PyPDF2.PdfReader(file)
            
            # Extract text from all pages
            text = []
            for page in pdf_reader.pages:
                text.append(page.extract_text())
            
            # Join all text with newlines
            full_text = '\n'.join(text)
            
            if not full_text.strip():
                raise ValueError("No text content found in PDF")
                
            return full_text
            
    except FileNotFoundError:
        raise HTTPException(status_code=400, detail=f"PDF file not found: {file_path}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error extracting text from PDF: {str(e)}")

async def generate_podcast_script(article_text: str, host_name: str, guest_name: str, length: str, model, content_type):
    """Generate a podcast script using the Gemini model"""
    from generate import generate_podcast_script as gps
    return await gps(article_text, host_name, guest_name, length, model, content_type)

def setup_model(api_key: str):
    genai.configure(api_key=api_key)
    return genai.GenerativeModel('gemini-pro')

class PodcastResponse(BaseModel):
    script: List[Dict[str, Dict[str, str]]]
    audio_url: str

    class Config:
        json_schema_extra = {
            "example": {
                "script": [
                    {"Host": {"dialogue": "Welcome to the show!"}},
                    {"Guest": {"dialogue": "Thanks for having me!"}}
                ],
                "audio_url": "/podcasts/example.mp3"
            }
        }

def create_podcast_folder():
    """Create a unique folder for this podcast generation"""
    folder_name = str(uuid.uuid4())
    folder_path = os.path.join(PODCAST_DIR, folder_name)
    os.makedirs(folder_path, exist_ok=True)
    return folder_path

@app.post(
    "/generate-podcast",
    summary="Generate a podcast",
    response_model=PodcastResponse,
    response_description="Returns the generated script and audio URL"
)
async def generate_podcast(
    background_tasks: BackgroundTasks,
    file: Optional[UploadFile] = File(None),
    host_name: str = Form(...),  # Required field, no default
    guest_name: str = Form(...),  # Required field, no default
    youtube_url: Optional[str] = Form(None),
    text_content: Optional[str] = Form(None),
    web_url: Optional[str] = Form(None)
):
    try:
        # Create a unique folder for this generation
        generation_folder = create_podcast_folder()
        
        # Validate content sources
        await validate_content_sources(youtube_url, text_content, web_url, file)
        
        api_key = "AIzaSyCFmfS6nMgLo7vKjZI9QzqSvkiSFF6N8-0"  # Gemini API key
        model = setup_model(api_key)
        
        # Get the content and its type
        content, content_type = await get_content(youtube_url, text_content, web_url, file)
        
        # Generate the podcast script using Gemini with fixed length
        script = await generate_podcast_script(content, host_name, guest_name, "Adaptive", model, content_type)
        
        if not script:
            raise HTTPException(status_code=500, detail="Failed to generate podcast script")
        
        # Create the podcast with different voices
        podcast_file = await create_podcast(script, host_name, guest_name, generation_folder)
        
        if not podcast_file:
            raise HTTPException(status_code=500, detail="Failed to create podcast audio")
        
        # Return relative path from PODCAST_DIR
        relative_path = os.path.relpath(podcast_file, PODCAST_DIR)
        
        # Schedule cleanup of podcast files after 30 minutes
        background_tasks.add_task(
            cleanup_podcast_files,
            podcast_id=relative_path,
            output_dir=PODCAST_DIR
        )
        
        return PodcastResponse(
            script=script,
            audio_url=f"/podcasts/{relative_path}"
        )
        
    except Exception as e:
        print(f"Error: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("shutdown")
async def shutdown_event():
    scheduler.shutdown()
