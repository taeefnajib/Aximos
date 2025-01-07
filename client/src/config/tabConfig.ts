import { FileText, Globe, Youtube, Upload } from 'lucide-react';

export type TabType = 'paste' | 'web' | 'youtube' | 'upload';

export const tabs = [
  { 
    id: 'paste' as TabType, 
    label: 'Paste Content',
    icon: FileText,
    placeholder: 'Paste your content here...'
  },
  { 
    id: 'web' as TabType, 
    label: 'Web URL',
    icon: Globe,
    placeholder: 'Enter website URL'
  },
  { 
    id: 'youtube' as TabType, 
    label: 'YouTube',
    icon: Youtube,
    placeholder: 'Enter YouTube video URL'
  },
  { 
    id: 'upload' as TabType, 
    label: 'Upload File',
    icon: Upload,
    placeholder: 'Click to upload PDF or drag and drop'
  }
];