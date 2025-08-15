import { CarouselWithContent } from './carousel';
import { GradientIcon } from './common';
import { useSelectedClips } from '../hooks/useSelectedClips';

export const Hero = () => {
  const { clips } = useSelectedClips();


  return (
    <div className="h-full w-full p-6">
      {/* Selected Clips Section */}
      <div className="h-full rounded-xl border border-alpha-10 bg-black/80 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <GradientIcon fromColor="bg-brand-gradient">
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
  );
};
