
import { VideoRenderer, ImageRenderer, AudioRenderer } from "./MediaRenders";
import { audioFormats, videoFormats, imageGifFormats } from '../../lib/utils/ppro';

interface MediaRendererProps {
    filePath: string;
    fileData: string;
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ filePath, fileData }) => {
    const fileExtension = filePath.split(".").pop()?.toLowerCase() || "";

    if (videoFormats.includes(fileExtension)) {
        return <VideoRenderer fileData={fileData} />;
    } else if (imageGifFormats.includes(fileExtension)) {
        return <ImageRenderer fileData={fileData} />;
    } else if (audioFormats.includes(fileExtension)) {
        return <AudioRenderer fileData={fileData} />;
    } else {
        return <p className="text-gray-400 text-center p-4">Unsupported file type</p>;
    }
};

export default MediaRenderer;
