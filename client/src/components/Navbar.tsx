import React from 'react';
import { Github } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-[#121212] px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-[#ffffff] text-2xl font-bold">Aximos</h1>
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#ffffff] hover:text-[#069494] transition-colors"
        >
          <Github size={24} />
        </a>
      </div>
    </nav>
  );
}