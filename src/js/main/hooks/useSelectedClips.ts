import { useCallback, useEffect, useState } from 'react';
import { evalTS } from '../../lib/utils/bolt';
import type { SelectedClip } from '../components/types/components';

export function useSelectedClips() {
  const [clips, setClips] = useState<SelectedClip[]>([]);

  const fetchSelectedClips = useCallback(async () => {
    try {
      const selected: SelectedClip[] = await evalTS('getAllSelectedClips');
      setClips(Array.isArray(selected) ? selected : []);
    } catch (error) {
      console.error('Error fetching selected clips:', error);
    }
  }, []);

  useEffect(() => {
    const handleMouseEnter = () => {
      fetchSelectedClips();
    };
    document.addEventListener('mouseenter', handleMouseEnter);
    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [fetchSelectedClips]);

  return { clips, fetchSelectedClips } as const;
}


