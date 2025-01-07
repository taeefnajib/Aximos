import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

type AudioControlsProps = {
  isPlaying: boolean;
  onPlayPauseClick: () => void;
  onPrevClick: () => void;
  onNextClick: () => void;
};

export default function AudioControls({
  isPlaying,
  onPlayPauseClick,
  onPrevClick,
  onNextClick
}: AudioControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        className="text-[#ffffff] hover:text-[#069494] transition-colors"
        aria-label="Previous"
        onClick={onPrevClick}
      >
        <SkipBack size={24} />
      </button>
      <button
        type="button"
        className="text-[#ffffff] hover:text-[#069494] transition-colors p-2"
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={onPlayPauseClick}
      >
        {isPlaying ? <Pause size={32} /> : <Play size={32} />}
      </button>
      <button
        type="button"
        className="text-[#ffffff] hover:text-[#069494] transition-colors"
        aria-label="Next"
        onClick={onNextClick}
      >
        <SkipForward size={24} />
      </button>
    </div>
  );
}