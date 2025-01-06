import React from "react";
import { VideoRenderer, ImageRenderer, AudioRenderer } from "./MediaRenders";

import {audioFormats, videoFormats, imageGifFormats} from '../../lib/utils/ppro'

export const MediaRenderer = (props: any) => {
    const { filePath, fileData: base64Content } = props;
    // Determine file type based on the extension
    const fileExtension = filePath.split(".").pop().toLowerCase();

    if (videoFormats.includes(fileExtension)) {
        return <VideoRenderer fileData={base64Content} />;
    } else if (imageGifFormats.includes(fileExtension)) {
        return <ImageRenderer fileData={base64Content} />;
    } else if (audioFormats.includes(fileExtension)) {
        return <AudioRenderer fileData={base64Content} />;
    } else {
        return <p>Unsupported file type</p>;
    }
};
