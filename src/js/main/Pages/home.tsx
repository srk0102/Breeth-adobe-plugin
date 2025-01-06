import { useState, useEffect } from "react";
import { evalTS } from "../../lib/utils/bolt";

import { NavBar, Hero, Service } from '../components'
import { getTheFileData } from '../utils/commonFunctions'

export const Home = () => {

    const [clips, setClips] = useState<any>([]);
    const [data, setData] = useState<any>()
    const [clippath, setPath] = useState("")

    const fetchSelectedClips = async () => {
        try {
            let selectedClips = await evalTS("getSelectedClips");
            selectedClips?.map(async (selectedClip: any) => {
                const fileData = await getTheFileData(selectedClip.filePath);
                selectedClip.fileData = fileData
                setPath(selectedClip.filePath)
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
        <div className="relative h-screen bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 clip-diagonal opacity-90 bg-[rgba(246,188,255,0.09)] shadow-md backdrop-blur-lg"></div>
            <div className="relative text-white h-full overflow-y-scroll">
                <NavBar />
                <Hero />
                <Service />
            </div>
        </div>
    )
}
