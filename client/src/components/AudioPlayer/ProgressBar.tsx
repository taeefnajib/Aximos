import React from 'react';

type ProgressBarProps = {
  currentTime: number;
  duration: number;
  onTimeUpdate: (time: number) => void;
};

export default function ProgressBar({ currentTime, duration, onTimeUpdate }: ProgressBarProps) {
  const progressBarWidth = duration ? (currentTime / duration) * 100 : 0;
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const percent = (event.clientX - bounds.left) / bounds.width;
    onTimeUpdate(percent * duration);
  };

  return (
    <div className="w-full space-y-2">
      <div 
        className="h-1 bg-[#161925] rounded-full cursor-pointer"
        onClick={handleClick}
      >
        <div 
          className="h-full bg-[#069494] rounded-full transition-all"
          style={{ width: `${progressBarWidth}%` }}
        />
      </div>
      <div className="flex justify-between text-sm text-gray-300">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}