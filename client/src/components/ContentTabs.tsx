import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { TabType, tabs } from '../config/tabConfig';

interface ContentTabsProps {
  onFileSelect?: (file: File | null) => void;
  onYoutubeUrl?: (url: string) => void;
  onWebUrl?: (url: string) => void;
  onTextContent?: (text: string) => void;
}

export default function ContentTabs({ 
  onFileSelect, 
  onYoutubeUrl,
  onWebUrl,
  onTextContent 
}: ContentTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    onFileSelect?.(file);
  };

  const handleYoutubeUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onYoutubeUrl?.(event.target.value);
  };

  const handleWebUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onWebUrl?.(event.target.value);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextContent?.(event.target.value);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex space-x-1 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-2 md:px-4 rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#069494] text-[#ffffff]'
                  : 'bg-[#192734] text-gray-300 hover:bg-[#22303c]'
              }`}
            >
              <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                <Icon className="w-5 h-5" />
                <span className="text-xs md:text-base">{tab.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-[#192734] p-4 md:p-6 rounded-lg">
        {activeTab === 'paste' && (
          <textarea
            placeholder={tabs[0].placeholder}
            onChange={handleTextChange}
            className="w-full h-48 p-4 bg-[#161925] text-[#ffffff] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#069494]"
          />
        )}

        {activeTab === 'web' && (
          <input
            type="url"
            placeholder={tabs[1].placeholder}
            onChange={handleWebUrlChange}
            className="w-full p-4 bg-[#161925] text-[#ffffff] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#069494]"
          />
        )}

        {activeTab === 'youtube' && (
          <input
            type="url"
            placeholder={tabs[2].placeholder}
            onChange={handleYoutubeUrlChange}
            className="w-full p-4 bg-[#161925] text-[#ffffff] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#069494]"
          />
        )}

        {activeTab === 'upload' && (
          <div className="w-full p-6 md:p-8 bg-[#161925] rounded-lg border-2 border-dashed border-gray-600 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              id="file-upload"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-[#ffffff] hover:text-[#069494] transition-colors flex flex-col items-center gap-2"
            >
              <Upload className="w-6 h-6" />
              <span>
                {selectedFile 
                  ? `Selected: ${selectedFile.name}`
                  : tabs[3].placeholder}
              </span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}