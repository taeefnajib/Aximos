import React from 'react';

type AvatarProps = {
  name: string;
  imageUrl?: string;
};

export default function Avatar({ name, imageUrl }: AvatarProps) {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-[#22303c] flex items-center justify-center">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[#ffffff] text-lg font-semibold">
            {name.charAt(0)}
          </span>
        )}
      </div>
      <span className="text-[#ffffff]">{name}</span>
    </div>
  );
}