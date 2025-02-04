import { Carousel, Typography, Button } from "@material-tailwind/react";

import { MediaRenderer } from "./MideaRenderer";

export function CarouselWithContent(props: any) {

    const { clips } = props;

    return (
        <Carousel className="rounded-xl">
            {clips?.map((clip: any) => (
                <div className="relative h-full w-full">
                    {clip.fileData && (
                        <MediaRenderer
                            filePath={clip.filePath}
                            fileData={clip.fileData}
                        />
                    )}
                    <div className="absolute top-2 right-2 w-2/6 bg-black/30 text-white p-2 rounded-md shadow-md backdrop-blur-md">
                        <p className="text-sm font-semibold">{clip.name}</p>
                        <hr className="my-2"/>
                        <p className="text-xs font-light">
                            Start: {clip.assetInpoint}s <br />
                            End: {clip.assetOutpoint}s <br />
                            Duration: {clip.assentDuration}s
                        </p>
                    </div>
                </div>
            ))}
        </Carousel>
    );
}