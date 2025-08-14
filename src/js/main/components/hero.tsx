import { useState, useEffect } from "react";
import { evalTS } from "../../lib/utils/bolt";

// Removed eager file data fetching; preview fetches on demand for performance

import { CarouselWithContent } from './carousel';
import { GradientIcon } from './common';

export const Hero = () => {
  const [clips, setClips] = useState<any>([]);
  
  const fetchSelectedClips = async () => {
    try {
      let selectedClips = await evalTS("getSelectedClips");
      setClips(selectedClips);
    } catch (err: any) {
      console.error('Error fetching selected clips:', err);
    }
  };

  useEffect(() => {
    const handleMouseEnter = () => {
      fetchSelectedClips();
    };
    document.addEventListener("mouseenter", handleMouseEnter);
    
    return () => {
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);


  return (
    <div className="h-full w-full p-6">
      {/* Selected Clips Section */}
      <div className="gradient-border h-full">
        <div className="gradient-border-inner p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <GradientIcon>
              <span className="text-white text-lg">🎬</span>
            </GradientIcon>
            <div>
              <h2 className="text-lg font-semibold text-white">Selected Clips</h2>
              <p className="text-gray-400 text-sm">Clips from your Premiere Pro timeline</p>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <CarouselWithContent clips={clips} />
          </div>
        </div>
      </div>
    </div>
  );
};
