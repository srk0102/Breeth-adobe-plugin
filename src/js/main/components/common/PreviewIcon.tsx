import React from 'react';
import { Play, Eye } from 'lucide-react';
import { FILE_COLORS } from '../../constants';
import type { Clip } from '../types/components';

interface PreviewIconProps { filePath: Clip['filePath']; }

export const PreviewIcon: React.FC<PreviewIconProps> = ({ filePath }) => {
	const videoFormats = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'];
	const audioFormats = ['mp3', 'wav', 'aac', 'flac', 'ogg', 'wma', 'm4a'];

	const extension = filePath.split('.').pop()?.toLowerCase() || '';

	if (videoFormats.includes(extension)) {
		return (
			<>
				<Play className="w-4 h-4" color={FILE_COLORS.VIDEO} />
				<span>View</span>
			</>
		);
	}
	if (audioFormats.includes(extension)) {
		return (
			<>
				<Play className="w-4 h-4" color={FILE_COLORS.AUDIO} />
				<span>View</span>
			</>
		);
	}

	return (
		<>
			<Eye className="w-4 h-4" color={FILE_COLORS.IMAGE} />
			<span>View</span>
		</>
	);
};


