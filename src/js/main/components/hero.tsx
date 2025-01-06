import { useState, useEffect } from "react";
import { evalTS } from "../../lib/utils/bolt";

import { MediaRenderer } from './MideaRenderer'

import { getTheFileData } from '../utils/commonFunctions'

export const Hero = () => {
    const [clips, setClips] = useState<any>([]);
    const [data, setData] = useState<any>()

    const fetchSelectedClips = async () => {
        try {
            let selectedClips = await evalTS("getSelectedClips");
            selectedClips?.map(async (selectedClip: any) => {
                const fileData = await getTheFileData(selectedClip.filePath);
                selectedClip.fileData = fileData
            })
            setClips(selectedClips);
        }
        catch (err: any) {
            alert(err.message)
        }
    };

    useEffect(() => {
        const handleMouseEnter = () => {
            fetchSelectedClips();
        };
        document.addEventListener("mouseenter", handleMouseEnter);
    }, []);
    return (
        <div className='h-1/3 p-3 border'>
            {clips?.map((clip: any, index: any) => (
                <>
                    <div key={index} className='group grid grid-cols-12 gap-2 text-sm'>
                        <div className='hero-product col-span-5'>
                            {clip.fileData && <MediaRenderer filePath={clip.filePath} fileData={clip.fileData} />}
                        </div>
                        <div className='hero-description flex flex-col justify-center col-span-7'>
                            {/* <p>TimeLine Start point: {clip.timelineInpoint}s, TimeLine End point: {clip.timelineoutPoint}s</p> */}
                            <p className='text-lg font-bold pb-4'>{clip.name}</p>
                            <p>Asset Starting point: {clip.assetInpoint}s, Asset End point: {clip.assetOutpoint}s Duration: {clip.assentDuration}</p>
                        </div>
                    </div>
                </>
            ))}
        </div>
    )
}
