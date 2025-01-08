# Aximos - Generate Mini-podcasts from Your Contents

Aximos is a Python package that allows you to generate mini-podcasts from your contents. 

* Insert your text, 
* Insert a web link, 
* Insert a YouTube video link, 
* Upload a PDF file 

Click on the "Generate Podcast" button and wait a few seconds for the podcast to be generated. You can then play and download the podcast.

# Technologies Used

## Backend
* Language: Python
* Libraries:
    - FastAPI
    - Pydantic
    - PyPDF2
    - Pytube
    - Pydub
* LLMs:
    - Google's Generative AI (GEMINI)
* Text-to-speech:
    - Edge TTS

## Frontend
* Language: HTML, CSS, JavaScript, TypeScript
* Framework: React
* Tools:
    - Vite
    - Tailwind CSS

# Available Voices

The application features a diverse set of high-quality voices for both host and guest roles:

## Host Voices
* Christopher Moore (US) - Default host voice
* Roger Bennett (US)
* Ryan Parker (GB)
* Jenny Miller (US)
* Michelle Davis (US)
* Libby Wilson (GB)
* Sonia Clarke (GB)

## Guest Voices
* Aria Reynolds (US) - Default guest voice
* Eric Thompson (US)
* Guy Harrison (US)
* Steffan Brooks (US)
* Thomas Wright (GB)

Each voice is carefully selected to provide natural-sounding conversations with a mix of US and GB accents.

# Installation

1. Clone the repository: `git clone https://github.com/aximos/aximos.git`
2. Navigate to the project directory: `cd aximos`
3. Change directory to the frontend: `cd client`
4. Install dependencies: `npm install`
5. Run the development server: `npm run dev`
6. Change directory to the backend: `cd server`
7. Create a .env file by running `touch .env` and add the following lines:
```
GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>
```
8. Install dependencies: `pip install -r requirements.txt`
9. Run the server: `uvicorn main:app --reload`

You should now be able to access the application at `http://localhost:5173`

# Usage

1. Select the virtual Host and the virtual Guest.
2. Insert your content (text, web link, YouTube video link, or PDF file).
3. Click on the "Generate Podcast" button.
4. Wait a few seconds for the podcast to be generated.

# Contributing

1. Fork the repository on GitHub: https://github.com/aximos/aximos
2. Clone the repository to your local machine: `git clone https://github.com/aximos/aximos.git`
3. Create a new branch: `git checkout -b my-branch`
4. Make your changes and commit them: `git commit -m "My changes"`
5. Push your changes to your fork: `git push origin my-branch`
6. Create a pull request: https://github.com/aximos/aximos/pulls

# License

This project is licensed under the MIT License. See the LICENSE file for details.
