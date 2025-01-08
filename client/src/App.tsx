import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ContentTabs from './components/ContentTabs';
import PodcastConfig from './components/PodcastConfig';
import ProgressOverlay from './components/ProgressOverlay';
import AudioPlayerPopup from './components/AudioPlayer/AudioPlayerPopup';
import { useProgress } from './hooks/useProgress';
import { Host, Guest } from './config/podcastConfig';
import axios from 'axios';

interface PodcastResponse {
  script: string;
  audio_url: string;
}

function App() {
  const [showPlayer, setShowPlayer] = useState(false);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
  const [host, setHost] = useState<Host | ''>('christopher-moore');
  const [guest, setGuest] = useState<Guest | ''>('aria-reynolds');
  const [error, setError] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [webUrl, setWebUrl] = useState('');
  const [textContent, setTextContent] = useState('');

  // Use fixed progress duration
  const progressDuration = 45000; // 45 seconds

  const { 
    progress, 
    isGenerating, 
    isComplete, 
    startProgress, 
    completeProgress, 
    resetProgress 
  } = useProgress(progressDuration);

  const handleGenerate = async () => {
    if (!host || !guest) {
      setError('Please select host and guest before generating.');
      return;
    }

    // Check if at least one content source is provided
    if (!selectedFile && !youtubeUrl && !webUrl && !textContent) {
      setError('Please provide at least one content source (file, YouTube URL, web URL, or text).');
      return;
    }

    startProgress();
    setError('');
    setShowPlayer(false);
    setIsPlayerMinimized(false);
    setAudioUrl('');

    const formData = new FormData();
    if (selectedFile) formData.append('file', selectedFile);
    if (youtubeUrl) formData.append('youtube_url', youtubeUrl);
    if (webUrl) formData.append('web_url', webUrl);
    if (textContent) formData.append('text_content', textContent);
    formData.append('host_name', host);
    formData.append('guest_name', guest);

    try {
      const response = await axios.post<PodcastResponse>(
        'http://localhost:8000/generate-podcast',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.audio_url) {
        setAudioUrl(`http://localhost:8000${response.data.audio_url}`);
        setShowPlayer(true);
        completeProgress();
      } else {
        setError('No audio URL in response');
        resetProgress();
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorData = err.response?.data;
        console.error('API Error:', errorData);
        
        // Extract the most relevant part of the YouTube transcript error
        let errorMessage = '';
        if (typeof errorData === 'string' && errorData.includes('Could not find any English transcript')) {
          errorMessage = 'This YouTube video does not have English subtitles. Please try another video or content source.';
        } else if (errorData?.detail && typeof errorData.detail === 'string' && 
                  errorData.detail.includes('Could not find any English transcript')) {
          errorMessage = 'This YouTube video does not have English subtitles. Please try another video or content source.';
        } else {
          errorMessage = typeof errorData === 'string' ? errorData :
            errorData?.detail || errorData?.msg || 'Error generating podcast';
        }
        
        setError(errorMessage);
      } else {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      }
      resetProgress();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#161925]">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#ffffff] mb-3 md:mb-4">
            Generate Mini-podcast From Your Content
          </h1>
          <p className="text-gray-300 text-base md:text-lg">
            Transform your content into engaging short podcasts with just a few clicks
          </p>
        </div>

        <PodcastConfig
          host={host}
          setHost={setHost}
          guest={guest}
          setGuest={setGuest}
        />

        <ContentTabs
          onFileSelect={setSelectedFile}
          onYoutubeUrl={setYoutubeUrl}
          onWebUrl={setWebUrl}
          onTextContent={setTextContent}
        />

        <div className="mt-6 text-center">
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-[#069494] text-[#ffffff] px-6 md:px-8 py-3 rounded-lg hover:bg-[#176161] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate Podcast'}
          </button>
        </div>

        {error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {(showPlayer || isPlayerMinimized) && audioUrl && (
          <AudioPlayerPopup 
            audioUrl={audioUrl} 
            isMinimized={isPlayerMinimized}
            onClose={() => {
              setShowPlayer(false);
              setIsPlayerMinimized(false);
              setAudioUrl('');
            }}
            onMinimize={() => {
              setShowPlayer(false);
              setIsPlayerMinimized(true);
            }}
            onMaximize={() => {
              setShowPlayer(true);
              setIsPlayerMinimized(false);
            }}
          />
        )}

        {isGenerating && (
          <div className="mt-8">
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-full bg-blue-500 rounded transition-all duration-500"
                style={{ width: `${Math.round(progress)}%` }}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;