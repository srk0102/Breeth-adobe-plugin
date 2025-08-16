import { TrackType } from './types';

/**
 * Gets a clip's media path
 */
export const getClipMediaPath = (trackType: TrackType, trackId: number, clipId: number) => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }

        const tracks = trackType === 'audio' ? 
            app.project.activeSequence.audioTracks : 
            app.project.activeSequence.videoTracks;

        const clip = tracks[trackId].clips[clipId];
        return clip.projectItem.getMediaPath();
    } catch (err: any) {
        alert("Error getting clip media path: " + String(err.message || err));
        return null;
    }
};

/**
 * Enables/disables a clip
 */
export const setClipEnabled = (trackType: TrackType, trackId: number, clipId: number, enabled: boolean) => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }

        const tracks = trackType === 'audio' ? 
            app.project.activeSequence.audioTracks : 
            app.project.activeSequence.videoTracks;

        const clip = tracks[trackId].clips[clipId];
        clip.disabled = !enabled;
        return true;
    } catch (err: any) {
        alert("Error setting clip enabled state: " + String(err.message || err));
        return false;
    }
};
