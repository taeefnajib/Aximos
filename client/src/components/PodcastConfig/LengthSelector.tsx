import React from 'react';
import { podcastLengths } from '../../config/podcastConfig';

type LengthSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function LengthSelector({ value, onChange }: LengthSelectorProps) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-[#ffffff] font-medium">Length</label>
      <div className="flex flex-wrap gap-4">
        {podcastLengths.map((length) => (
          <label
            key={length.id}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="relative">
              <input
                type="radio"
                name="podcast-length"
                value={length.id}
                checked={value === length.id}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none w-4 h-4 rounded-full border-2 border-[#22303c] checked:border-[#069494] checked:bg-[#069494] focus:outline-none focus:ring-2 focus:ring-[#069494] focus:ring-offset-2 focus:ring-offset-[#192734]"
              />
              <div className="absolute inset-0 rounded-full pointer-events-none transition-transform group-hover:scale-110" />
            </div>
            <span className="text-[#ffffff] group-hover:text-[#069494] transition-colors">
              {length.name}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}