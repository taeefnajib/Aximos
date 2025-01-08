import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#121212] py-4 text-center">
      <p className="text-[#ffffff] text-sm">
        Made by <a href="https://taeefnajib.github.io/" className="text-[#069494] font-medium" target="_blank" rel="noopener noreferrer">Taeef Najib</a> with ❤️&nbsp;&nbsp;|&nbsp;&nbsp;© {new Date().getFullYear()} Aximos. All rights reserved
      </p>
    </footer>
  );
}