import React from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioControlsProps {
  isPlaying: boolean;
  onPlayPauseClick: () => void;
  minimal?: boolean;
}

export default function AudioControls({ 
  isPlaying, 
  onPlayPauseClick,
  minimal = false 
}: AudioControlsProps) {
  const buttonClass = `text-gray-400 hover:text-white transition-colors ${minimal ? 'p-1' : 'p-2'}`;
  const iconSize = minimal ? 16 : 24;

  return (
    <div className={`flex items-center gap-2 ${minimal ? 'justify-start' : 'justify-center'}`}>
      <button
        type="button"
        className={buttonClass}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        onClick={onPlayPauseClick}
      >
        {isPlaying ? <Pause size={iconSize} /> : <Play size={iconSize} />}
      </button>
    </div>
  );
}