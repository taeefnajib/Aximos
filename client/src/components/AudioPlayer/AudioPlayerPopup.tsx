import React, { useState, useRef, useEffect } from 'react';
import { X, Download, Maximize2 } from 'lucide-react';
import AudioControls from './AudioControls';
import ProgressBar from './ProgressBar';

interface AudioPlayerPopupProps {
  audioUrl: string;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}

export default function AudioPlayerPopup({ 
  audioUrl, 
  isMinimized,
  onClose,
  onMinimize,
  onMaximize 
}: AudioPlayerPopupProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const setAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
      };

      const setAudioTime = () => setCurrentTime(audio.currentTime);
      const handleEnded = () => setIsPlaying(false);

      // Add event listeners
      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('play', () => setIsPlaying(true));
      audio.addEventListener('pause', () => setIsPlaying(false));

      // Cleanup
      return () => {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('play', () => setIsPlaying(true));
        audio.removeEventListener('pause', () => setIsPlaying(false));
      };
    }
  }, []);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleTimeUpdate = (value: number) => {
    if (audioRef.current) {
      const time = (value / 100) * duration;
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated-podcast.mp3';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading podcast:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Single audio element for both states
  const audioElement = (
    <audio
      ref={audioRef}
      src={audioUrl}
      className="hidden"
    />
  );

  return (
    <div 
      className={`fixed transition-all duration-300 ease-in-out ${
        isMinimized 
          ? 'bottom-4 left-1/2 -translate-x-1/2 w-80 h-16 rounded-lg' 
          : 'inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'
      }`}
    >
      {audioElement}
      {isMinimized ? (
        <div className="bg-[#192734] p-3 rounded-lg shadow-xl w-full h-full flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <AudioControls
              isPlaying={isPlaying}
              onPlayPauseClick={handlePlayPause}
              onPrevClick={() => {
                if (audioRef.current) audioRef.current.currentTime -= 10;
              }}
              onNextClick={() => {
                if (audioRef.current) audioRef.current.currentTime += 10;
              }}
              minimal={true}
            />
            <div className="flex-1">
              <ProgressBar
                currentTime={currentTime}
                duration={duration}
                onTimeUpdate={handleTimeUpdate}
                minimal={true}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onMaximize}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Maximize2 size={20} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#192734] p-6 rounded-lg shadow-xl w-[90%] max-w-md relative">
          <button
            onClick={onMinimize}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-[#ffffff] text-xl font-semibold mb-2">Your Generated Podcast</h3>
              <p className="text-gray-300 text-sm">Listen to your content in podcast format</p>
            </div>

            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onTimeUpdate={handleTimeUpdate}
            />

            <AudioControls
              isPlaying={isPlaying}
              onPlayPauseClick={handlePlayPause}
              onPrevClick={() => {
                if (audioRef.current) audioRef.current.currentTime -= 10;
              }}
              onNextClick={() => {
                if (audioRef.current) audioRef.current.currentTime += 10;
              }}
            />

            <div className="flex justify-center mt-4">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isDownloading 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-[#069494] hover:bg-[#057373]'
                } text-white`}
              >
                <Download size={20} />
                <span>{isDownloading ? 'Downloading...' : 'Download Podcast'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}