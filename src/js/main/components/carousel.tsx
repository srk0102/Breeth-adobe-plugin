import React, { useState } from 'react';
import { getFileBufferBase64 } from '../utils/commonFunctions';
import { PreviewModal, ClipItem } from './common';

interface Clip {
    name: string;
    filePath: string;
    assetDuration: number;
    fileData?: string;
    timelineInpoint?: number;
    timelineoutPoint?: number;
    assetInpoint?: number;
    assetOutpoint?: number;
}

interface PreviewClip {
    name: string;
    filePath: string;
    fileData?: string;
    type: string;
    timelineInpoint?: number;
    timelineoutPoint?: number;
    assetInpoint?: number;
    assetOutpoint?: number;
}

interface CarouselWithContentProps {
    clips: Clip[];
}

export function CarouselWithContent({ clips }: CarouselWithContentProps) {
    const [previewModal, setPreviewModal] = useState<{
        isOpen: boolean;
        clip: PreviewClip | null;
    }>({ isOpen: false, clip: null });



    const handlePreview = async (clip: Clip) => {
        // Open modal immediately with metadata
        setPreviewModal({
            isOpen: true,
            clip: {
                name: clip.name,
                filePath: clip.filePath,
                fileData: undefined,
                type: clip.filePath.split('.').pop()?.toLowerCase() || 'unknown',
                timelineInpoint: clip.timelineInpoint,
                timelineoutPoint: clip.timelineoutPoint,
                assetInpoint: clip.assetInpoint,
                assetOutpoint: clip.assetOutpoint
            }
        });

        // Lazy load buffer after opening for faster perceived performance
        try {
            const fileData = await getFileBufferBase64(clip.filePath);
            setPreviewModal(prev => prev.clip ? {
                isOpen: true,
                clip: { ...prev.clip, fileData }
            } : prev);
        } catch (error) {
            console.error('Error loading preview buffer:', error);
        }
    };

    const closePreview = () => {
        setPreviewModal({ isOpen: false, clip: null });
    };
    return (
        <div className="w-full h-full flex flex-col">
            {clips?.length > 0 ? (
                <div className="space-y-2 overflow-y-auto no-scrollbar flex-1">
                    {clips.map((clip: Clip, index: number) => (
                        <ClipItem
                            key={index}
                            clip={clip}
                            onPreview={() => handlePreview(clip)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                        <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🎬</span>
                        </div>
                        <p className="text-lg font-medium mb-2 text-gray-300">No files selected</p>
                        <p className="text-sm text-gray-500">Select files in your workspace to see them here</p>
                    </div>
                </div>
            )}
            <PreviewModal
                isOpen={previewModal.isOpen}
                onClose={closePreview}
                clip={previewModal.clip}
            />
        </div>
    );
}