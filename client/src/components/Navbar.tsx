import React from 'react';
import GitHubButton from 'react-github-btn';

export default function Navbar() {
  return (
    <nav className="bg-[#121212] px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a 
          href="/" 
          onClick={(e) => {
            e.preventDefault();
            window.location.reload();
          }}
          className="cursor-pointer"
        >
          <h1 className="text-[#ffffff] text-2xl font-bold">Aximos</h1>
        </a>
        <GitHubButton 
          href="https://github.com/taeefnajib/Aximos" 
          data-color-scheme="no-preference: light; light: light_high_contrast; dark: light_high_contrast;" 
          data-size="large" 
          data-show-count="true" 
          aria-label="Star taeefnajib/Aximos on GitHub"
        >
          Star
        </GitHubButton>
      </div>
    </nav>
  );
}