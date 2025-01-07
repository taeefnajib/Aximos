import React from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onTimeUpdate: (value: number) => void;
  minimal?: boolean;
}

function formatTime(time: number) {
  if (isNaN(time)) return '0:00';
  
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function ProgressBar({ 
  currentTime, 
  duration, 
  onTimeUpdate,
  minimal = false 
}: ProgressBarProps) {
  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={minimal ? 'flex-1' : 'space-y-2'}>
      <input
        type="range"
        value={progress}
        min="0"
        max="100"
        className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[#069494]"
        onChange={(e) => onTimeUpdate(parseFloat(e.target.value))}
      />
      
      {!minimal && (
        <div className="flex justify-between text-sm text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
}