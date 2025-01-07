import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#121212] py-4 text-center">
      <p className="text-[#ffffff] text-sm">
        © {new Date().getFullYear()} Aximos. All rights reserved.
      </p>
    </footer>
  );
}