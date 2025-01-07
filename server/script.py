import os
import asyncio
import edge_tts
import shutil
from pydub import AudioSegment
from pydub.playback import play
from generate import generate_podcast_script, setup_model
import uuid

async def text_to_speech(text, voice, output_file):
    try:
        print(f"Generating speech with voice {voice}")
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(output_file)
        print(f"Successfully saved audio to {output_file}")
        return True
    except Exception as e:
        print(f"Error in text_to_speech: {str(e)}")
        return False

def get_voice_for_person(person: str, name: str) -> str:
    """Get the appropriate voice based on the person's role and name"""
    print(f"Getting voice for {person} with name {name}")
    if person == "Host":
        if name == "john-lewis":
            return "en-US-RogerNeural"
        elif name == "stephanie-hall":
            return "en-GB-SoniaNeural"
        else:
            return "en-US-RogerNeural"  # default host voice
    else:  # Guest
        if name == "sarah-cooper":
            return "en-US-MichelleNeural"
        elif name == "kevin-booker":
            return "en-GB-ThomasNeural"
        else:
            return "en-US-MichelleNeural"  # default guest voice

def clean_output_folder(folder_path):
    """Clean the output folder by removing and recreating it"""
    try:
        if os.path.exists(folder_path):
            print(f"Cleaning output folder: {folder_path}")
            shutil.rmtree(folder_path)
        os.makedirs(folder_path)
        print(f"Created clean output folder: {folder_path}")
    except Exception as e:
        print(f"Error in clean_output_folder: {str(e)}")
        raise

def cleanup_dialogue_files(output_folder):
    """Remove all files except the final podcast file (which starts with 'podcast_')"""
    try:
        for file in os.listdir(output_folder):
            if not file.startswith("podcast_"):
                file_path = os.path.join(output_folder, file)
                os.remove(file_path)
        print("Cleaned up individual dialogue files")
    except Exception as e:
        print(f"Error in cleanup_dialogue_files: {str(e)}")

async def generate_dialogue_audio(text: str, voice: str, output_file: str) -> AudioSegment:
    """Generate audio for a single dialogue"""
    success = await text_to_speech(text, voice, output_file)
    if not success:
        print(f"Failed to generate audio for: {text}")
        return None
    
    if not os.path.exists(output_file):
        print(f"Generated file doesn't exist: {output_file}")
        return None
    
    file_size = os.path.getsize(output_file)
    if file_size == 0:
        print(f"Generated file is empty: {output_file}")
        return None
    
    print(f"Generated file size: {file_size} bytes")
    
    audio_clip = AudioSegment.from_file(output_file)
    
    if len(audio_clip) == 0:
        print(f"Generated audio clip is empty")
        return None
    
    print(f"Successfully generated audio clip of length {len(audio_clip)}ms")
    return audio_clip + AudioSegment.silent(duration=500)  # Add 500ms pause

async def create_podcast(dialogues, host_name: str, guest_name: str, output_folder: str):
    """Create a podcast from dialogues"""
    print(f"\nStarting podcast creation with host: {host_name}, guest: {guest_name}")
    print(f"Using output folder: {output_folder}")
    
    try:
        # No need to clean the folder as it's newly created
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)
    except Exception as e:
        print(f"Failed to create output folder: {str(e)}")
        return None
    
    audio_clips = []
    
    # Process all dialogues
    for i, dialogue in enumerate(dialogues):
        for person, content in dialogue.items():
            text = content["dialogue"]
            print(f"\nProcessing {person} dialogue {i}: {text[:50]}...")
            
            name = host_name if person == "Host" else guest_name
            voice = get_voice_for_person(person, name)
            audio_file = os.path.join(output_folder, f"{person}_{i}.mp3")
            
            try:
                audio_clip = await generate_dialogue_audio(text, voice, audio_file)
                if audio_clip:
                    audio_clips.append(audio_clip)
            except Exception as e:
                print(f"Error generating audio for dialogue: {str(e)}")
                continue
    
    if not audio_clips:
        print("No audio clips were generated successfully")
        return None
    
    try:
        # Combine all audio clips
        print(f"\nCombining {len(audio_clips)} audio clips...")
        final_audio = sum(audio_clips)
        
        # Generate random filename
        random_filename = f"podcast_{uuid.uuid4().hex[:8]}.mp3"
        final_file = os.path.join(output_folder, random_filename)
        
        print(f"Exporting to {final_file}")
        final_audio.export(final_file, format="mp3")
        
        # Verify the final file
        if not os.path.exists(final_file):
            print("Final file was not created")
            return None
        
        file_size = os.path.getsize(final_file)
        print(f"Final file size: {file_size} bytes")
        
        if file_size == 0:
            print("Final file is empty")
            return None
        
        # Keep dialogue files for reference
        print(f"Successfully created podcast at {final_file}")
        
        # Immediately clean up dialogue files
        cleanup_dialogue_files(output_folder)
        
        return final_file
        
    except Exception as e:
        print(f"Error creating final podcast: {str(e)}")
        return None
