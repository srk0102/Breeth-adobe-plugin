type TrackType = 'video' | 'audio' | 'all';

/**
 * Sets track mute state
 */
export const setTrackMute = (trackType: TrackType, trackId: number, muted: boolean) => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }

        const tracks = trackType === 'audio' ? 
            app.project.activeSequence.audioTracks : 
            app.project.activeSequence.videoTracks;

        tracks[trackId].setMute(muted ? 1 : 0);
        return true;
    } catch (err: any) {
        alert("Error setting track mute: " + String(err.message || err));
        return false;
    }
};

/**
 * Sets track lock state
 */
export const setTrackLock = (trackType: TrackType, trackId: number, locked: boolean) => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }

        const tracks = trackType === 'audio' ? 
            app.project.activeSequence.audioTracks : 
            app.project.activeSequence.videoTracks;

        tracks[trackId].setLocked(locked ? 1 : 0);
        return true;
    } catch (err: any) {
        alert("Error setting track lock: " + String(err.message || err));
        return false;
    }
};

/**
 * Gets track name
 */
export const getTrackName = (trackType: TrackType, trackId: number) => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }

        const tracks = trackType === 'audio' ? 
            app.project.activeSequence.audioTracks : 
            app.project.activeSequence.videoTracks;

        return tracks[trackId].name || null;
    } catch (err: any) {
        alert("Error getting track name: " + String(err.message || err));
        return null;
    }
};

/**
 * Sets track name
 */
export const setTrackName = (trackType: TrackType, trackId: number, name: string) => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }

        const tracks = trackType === 'audio' ? 
            app.project.activeSequence.audioTracks : 
            app.project.activeSequence.videoTracks;

        tracks[trackId].name = name;
        return true;
    } catch (err: any) {
        alert("Error setting track name: " + String(err.message || err));
        return false;
    }
};

/**
 * Gets number of tracks
 */
export const getTrackCount = (trackType: TrackType) => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }

        if (trackType === 'all') {
            return {
                video: app.project.activeSequence.videoTracks.numTracks,
                audio: app.project.activeSequence.audioTracks.numTracks
            };
        }

        const tracks = trackType === 'audio' ? 
            app.project.activeSequence.audioTracks : 
            app.project.activeSequence.videoTracks;

        return tracks.numTracks;
    } catch (err: any) {
        alert("Error getting track count: " + String(err.message || err));
        return null;
    }
};

/**
 * Checks if a track is empty
 */
export const isTrackEmpty = (trackType: TrackType, trackId: number) => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }

        const tracks = trackType === 'audio' ? 
            app.project.activeSequence.audioTracks : 
            app.project.activeSequence.videoTracks;

        return tracks[trackId].clips.numItems === 0;
    } catch (err: any) {
        alert("Error checking if track is empty: " + String(err.message || err));
        return null;
    }
};
