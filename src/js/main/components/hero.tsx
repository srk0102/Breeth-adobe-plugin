import { useState, useEffect } from "react";
import { evalTS } from "../../lib/utils/bolt";

import { MediaRenderer } from "./MideaRenderer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTheFileData } from "../utils/commonFunctions";

import { CarouselWithContent } from './carousel'

export const Hero = () => {
  const [clips, setClips] = useState<any>([]);
  const [data, setData] = useState<any>();
  const fetchSelectedClips = async () => {
    try {
      let selectedClips = await evalTS("getSelectedClips");
      selectedClips?.map(async (selectedClip: any) => {
        const fileData = await getTheFileData(selectedClip.filePath);
        selectedClip.fileData = fileData;
      });
      setClips(selectedClips);
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    const handleMouseEnter = () => {
      fetchSelectedClips();
    };
    document.addEventListener("mouseenter", handleMouseEnter);
  }, []);


  return (
    <div className="h-[300px] p-1 border">
      <CarouselWithContent clips={clips} />
    </div>
  );
};
