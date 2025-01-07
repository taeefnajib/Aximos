import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface AudioControlsProps {
  isPlaying: boolean;
  onPlayPauseClick: () => void;
  onPrevClick: () => void;
  onNextClick: () => void;
  minimal?: boolean;
}

export default function AudioControls({ 
  isPlaying, 
  onPlayPauseClick, 
  onPrevClick, 
  onNextClick,
  minimal = false 
}: AudioControlsProps) {
  const buttonClass = `text-gray-400 hover:text-white transition-colors ${minimal ? 'p-1' : 'p-2'}`;
  const iconSize = minimal ? 16 : 24;

  return (
    <div className={`flex items-center gap-2 ${minimal ? 'justify-start' : 'justify-center'}`}>
      {!minimal && (
        <button
          type="button"
          className={buttonClass}
          aria-label="Previous 10 seconds"
          onClick={onPrevClick}
        >
          <SkipBack size={iconSize} />
        </button>
      )}
      
      <button
        type="button"
        className={buttonClass}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        onClick={onPlayPauseClick}
      >
        {isPlaying ? <Pause size={iconSize} /> : <Play size={iconSize} />}
      </button>

      {!minimal && (
        <button
          type="button"
          className={buttonClass}
          aria-label="Next 10 seconds"
          onClick={onNextClick}
        >
          <SkipForward size={iconSize} />
        </button>
      )}
    </div>
  );
}