import React, { useState, ChangeEvent, FormEvent } from 'react';

interface PodcastGeneratorProps {
  onSubmit: (formData: FormData) => Promise<void>;
}

function PodcastGenerator({ onSubmit }: PodcastGeneratorProps) {
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Check if at least one content source is provided
    if (!file && !youtubeUrl) {
      setError('Please provide either a PDF file or a YouTube URL');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    if (file) formData.append('file', file);
    if (youtubeUrl) formData.append('youtube_url', youtubeUrl);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError('Failed to generate podcast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Upload PDF File (Optional)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={loading}
            className="w-full p-2 border rounded bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            YouTube URL (Optional)
          </label>
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            disabled={loading}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full p-2 border rounded bg-white"
          />
        </div>
        
        <button
          type="submit"
          disabled={(!file && !youtubeUrl) || loading}
          className={`w-full py-2 px-4 rounded font-medium ${
            (!file && !youtubeUrl) || loading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {loading ? 'Generating...' : 'Generate Podcast'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}

export default PodcastGenerator;
