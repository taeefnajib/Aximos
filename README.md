# Aximos - Generate Mini-podcasts from Your Contents

Aximos is an innovative AI-powered tool that transforms your content into engaging mini-podcasts featuring natural conversations between AI hosts. Whether you're a content creator, educator, or business professional, Aximos helps you repurpose your content into an audio format that's perfect for on-the-go consumption.

### Features
- **Multiple Content Sources**: Convert content from:
  - Text articles or documents 📝
  - Web pages (just paste the URL) 🌐
  - YouTube videos 🎥
  - PDF files 📄

- **Natural Conversations**: Your content is transformed into dynamic dialogues between AI hosts, making complex information more engaging and easier to understand.

- **High-Quality Voices**: Choose from a diverse range of natural-sounding voices with different accents and personalities.

- **Easy to Use**: Simply input your content, select your preferred voices, and let Aximos generate your podcast in seconds.

## Technologies Used

### Backend
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

### Frontend
* Language: HTML, CSS, JavaScript, TypeScript
* Framework: React
* Tools:
    - Vite
    - Tailwind CSS

## Available Voices

The application features a diverse set of high-quality voices for both host and guest roles:

### Host Voices
* Christopher Moore (US) - Default host voice
* Roger Bennett (US)
* Ryan Parker (GB)
* Jenny Miller (US)
* Michelle Davis (US)
* Libby Wilson (GB)
* Sonia Clarke (GB)

### Guest Voices
* Aria Reynolds (US) - Default guest voice
* Eric Thompson (US)
* Guy Harrison (US)
* Steffan Brooks (US)
* Thomas Wright (GB)

Each voice is carefully selected to provide natural-sounding conversations with a mix of US and GB accents.

## Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm 8 or higher
- Git

### Setup Steps

1. Clone the repository:
```bash
git clone https://github.com/taeefnajib/Aximos.git
cd Aximos
```

2. Set up the frontend:
```bash
cd client
npm install
npm run dev
```

3. Set up the backend:
```bash
cd ../server
python -m venv venv  # Create virtual environment
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

4. Configure environment variables:
```bash
cp .env.example .env
```
Add the following to your `.env` file:
```
GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>
```

5. Start the backend server:
```bash
uvicorn main:app --reload
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`

### Troubleshooting
- If you encounter any port conflicts, you can specify different ports:
  - For frontend: `npm run dev -- --port 3000`
  - For backend: `uvicorn main:app --reload --port 8080`
- Make sure both frontend and backend servers are running simultaneously

## Usage

1. Select the virtual Host and the virtual Guest.
2. Insert your content (text, web link, YouTube video link, or PDF file).
3. Click on the "Generate Podcast" button.
4. Wait a few seconds for the podcast to be generated.

## Contributing

1. Fork the repository on GitHub: https://github.com/aximos/aximos
2. Clone the repository to your local machine: `git clone https://github.com/aximos/aximos.git`
3. Create a new branch: `git checkout -b my-branch`
4. Make your changes and commit them: `git commit -m "My changes"`
5. Push your changes to your fork: `git push origin my-branch`
6. Create a pull request: https://github.com/aximos/aximos/pulls

## License

This project is licensed under the MIT License. See the LICENSE file for details.
