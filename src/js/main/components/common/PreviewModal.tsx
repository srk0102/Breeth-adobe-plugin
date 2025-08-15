import React, { Suspense } from 'react';
import { Eye } from 'lucide-react';
import { Modal } from './Modal';
import { GradientIcon } from './GradientIcon';
import { LoadingSpinner } from './LoadingSpinner';

const MediaRenderer = React.lazy(() => import('../MideaRenderer'));

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  clip: {
    name: string;
    filePath: string;
    fileData?: string;
    type: string;
    timelineInpoint?: number;
    timelineoutPoint?: number;
    assetInpoint?: number;
    assetOutpoint?: number;
  } | null;
}

const formatTime = (seconds?: number) => {
  if (seconds == null || Number.isNaN(seconds)) return '-';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, clip }) => {
  if (!isOpen || !clip) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      className="h-[500px]"
    >
      <div className="flex w-full justify-between items-center p-6 border-b border-alpha-10 gap-4">
        <div className="flex items-center gap-4">
          <GradientIcon>
            <Eye className="w-5 h-5" color="white" />
          </GradientIcon>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-white truncate max-w-64" title={clip.name}>
              {clip.name}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white">
              <span className="px-2 py-1 rounded-md bg-white/10">{clip.type}</span>
              <span className="px-2 py-1 rounded-md bg-white/5">
                TL: {formatTime(clip.timelineInpoint)} → {formatTime(clip.timelineoutPoint)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 p-6 flex items-center justify-center overflow-hidden">
        {clip.fileData ? (
          <div className="w-full h-full rounded-xl overflow-hidden">
            <Suspense fallback={<LoadingSpinner text="Loading player..." />}>
              <MediaRenderer filePath={clip.filePath} fileData={clip.fileData} />
            </Suspense>
          </div>
        ) : (
          <LoadingSpinner text="Loading preview..." />
        )}
      </div>
    </Modal>
  );
};
