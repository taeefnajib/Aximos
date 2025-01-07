import React, { useState, useRef, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import AudioControls from './AudioControls';
import ProgressBar from './ProgressBar';

type AudioPlayerPopupProps = {
  audioUrl: string;
  onClose: () => void;
};

export default function AudioPlayerPopup({ audioUrl, onClose }: AudioPlayerPopupProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);
    
    // Add event listeners
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    // Cleanup
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, []);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Get the filename from the URL
      const fileName = audioUrl.split('/').pop() || 'podcast.mp3';
      
      // Fetch the file
      const response = await fetch(audioUrl);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      
      // Create a download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download error:', error);
      // You might want to show this error to the user
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#192734] p-6 rounded-lg shadow-xl w-[90%] max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
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

          {/* Download button */}
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

          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
          />
        </div>
      </div>
    </div>
  );
}