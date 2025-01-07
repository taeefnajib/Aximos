import React from 'react';
import { colors } from '../config/colors';

type ProgressOverlayProps = {
  progress: number;
  message: string;
};

export default function ProgressOverlay({ progress, message }: ProgressOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#192734] p-8 rounded-lg shadow-xl w-[90%] max-w-md">
        <div className="text-center mb-4">
          <h3 className="text-[#ffffff] text-xl font-semibold mb-2">{message}</h3>
          <p className="text-gray-300">{progress}%</p>
        </div>
        
        <div className="h-2 bg-[#161925] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#069494] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}