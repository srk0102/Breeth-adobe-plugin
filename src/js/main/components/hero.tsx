import { useState, useEffect } from "react";
import { evalTS } from "../../lib/utils/bolt";

import { MediaRenderer } from "./MideaRenderer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTheFileData } from "../utils/commonFunctions";

export const Hero = () => {
  const [clips, setClips] = useState<any>([]);
  const [data, setData] = useState<any>();
  const [currentIndex, setCurrentIndex] = useState<any>(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? clips.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === clips.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

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
      {/* {clips?.map((clip: any, index: any) => (
                <>
                <div  className="flex">
                    <div key={index} className='group grid grid-cols-12 gap-2 text-sm'>
                        <div className='hero-product col-span-7'>
                            {clip.fileData && <MediaRenderer filePath={clip.filePath} fileData={clip.fileData} />}
                        </div>
                        <div className='hero-description flex flex-col justify-center col-span-7'>
                            <p>TimeLine Start point: {clip.timelineInpoint}s, TimeLine End point: {clip.timelineoutPoint}s</p>
                            <p className='text-lg font-bold pb-4'>{clip.name}</p>
                            <p>Asset Starting point: {clip.assetInpoint}s, Asset End point: {clip.assetOutpoint}s Duration: {clip.assentDuration}</p>
                        </div>
                        </div>
                    </div>
                </>
            ))} */}
      <div className="w-full max-w-3xl mx-auto px-2 ">
        <div className="relative ">
          <div className="overflow-hidden rounded-lg align-center">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {clips.map((clip: any, index: any) => (
                <div key={index} className="w-full flex-shrink-0 px-28">
                  <div className=" top-0 w-full text-white p-4">
                    {/* <div className="container mx-auto"> */}
                      <p className="text-lg font-semibold">{clip.name}</p>
                      <p className="font-light">
                        Asset Starting Point: {clip.assetInpoint}s, Asset End
                        Point: {clip.assetOutpoint}s, Duration:{" "}
                        {clip.assentDuration}
                      </p>
                    {/* </div> */}
                  </div>
                  {clip.fileData && (
                    <MediaRenderer
                      filePath={clip.filePath}
                      fileData={clip.fileData}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          {
            clips && clips.length > 1 && (
                <>
                <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow hover:bg-white"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow hover:bg-white"
              >
                <ChevronRight size={24} />

              </button>
              </>)
          }
        

        </div>
        <div className="flex justify-center mt-4 space-x-2">
          {clips.map((index: any) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-gray-800" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
