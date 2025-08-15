import React from 'react';
import { Play, Eye, Film, Music, Image } from 'lucide-react';
import { FILE_COLORS } from '../../constants'
import type { Clip } from '../types/components';

import { PreviewIcon } from './PreviewIcon';

interface ClipItemProps {
  clip: Clip;
  onPreview: () => void;
}

export const ClipItem: React.FC<ClipItemProps> = ({ clip, onPreview }) => {
  const videoFormats = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'];
  const audioFormats = ['mp3', 'wav', 'aac', 'flac', 'ogg', 'wma', 'm4a'];
  const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'webp'];

  const getFileIcon = () => {
    const extension = clip.filePath.split('.').pop()?.toLowerCase() || '';
    
    if (videoFormats.includes(extension)) return <Film className="w-5 h-5" color={FILE_COLORS.VIDEO} />;
    if (audioFormats.includes(extension)) return <Music className="w-5 h-5" color={FILE_COLORS.AUDIO} />;
    if (imageFormats.includes(extension)) return <Image className="w-5 h-5" color={FILE_COLORS.IMAGE} />;
    return <Film className="w-5 h-5" color={FILE_COLORS.UNKNOWN} />;
  };

  const getFileType = () => {
    const extension = clip.filePath.split('.').pop()?.toLowerCase() || '';
    
    if (videoFormats.includes(extension)) return 'Video';
    if (audioFormats.includes(extension)) return 'Audio';
    if (imageFormats.includes(extension)) return 'Image';
    return 'Unknown';
  };

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds === 0) return '-';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4 p-4 transition-colors-opacity group rounded-lg beam-divider">
      <div className="flex-shrink-0">
        <span className="text-xl">{getFileIcon()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate text-sm" title={clip.name}>
          {clip.name}
        </p>
      </div>
      <div className="flex-shrink-0">
        <span className="text-brand-accent text-sm font-mono bg-brand-primary/10 px-2 py-1 rounded-md">
          {formatDuration(clip.assetDuration)}
        </span>
      </div>
      <div className="flex-shrink-0">
        <span className="text-gray-400 text-xs bg-gray-500/20 px-2 py-1 rounded-md">
          [{getFileType()}]
        </span>
      </div>
      <div className="flex-shrink-0">
        <button
          onClick={onPreview}
          className="flex items-center gap-2 text-white hover:bg-brand-primary/30 border border-brand-primary/50 hover:border-brand-primary px-3 py-2 rounded-lg text-xs font-medium transition-colors-opacity"
        >
          <PreviewIcon filePath={clip.filePath} />
        </button>
      </div>
    </div>
  );
};
