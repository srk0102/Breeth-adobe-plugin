export const getVideoTracksData = () => {
    try{
        const tracksData = [];
        const Videotracks = app.project.activeSequence.videoTracks;
        for (let i = 0; i < Videotracks.numTracks; i++) {
            const track = Videotracks[i];
            for (let j = 0; j < track.clips.numItems; j++) {
                const clip = track.clips[j];
                tracksData.push({
                    name: clip.name,
                    duration: clip.duration,
                    inPoint: clip.inPoint.seconds,
                    outPoint: clip.outPoint.seconds,
                    start: clip.start.seconds,
                    end: clip.end.seconds,
                    trackIndex: i,
                    clipIndex: j,
                    mediaType: clip.mediaType,
                    nodeId: clip.nodeId,
                    type: clip.type,
                    compoennts: clip.components,
                    disabled: clip.disabled,
                });
            }
        }
        return tracksData;
    }catch(err:any){
        alert("Error getting tracks: " + String(err.message || err));
    }
}

export const getAudioTracksData = () => {
    try{
        const tracksData = [];
        const audioTracks = app.project.activeSequence.audioTracks;
        for (let i = 0; i < audioTracks.numTracks; i++) {
            const track = audioTracks[i];
            for (let j = 0; j < track.clips.numItems; j++) {
                const clip = track.clips[j];
                tracksData.push({
                    name: clip.name,
                    duration: clip.duration,
                    inPoint: clip.inPoint.seconds,
                    outPoint: clip.outPoint.seconds,
                    start: clip.start.seconds,
                    end: clip.end.seconds,
                    trackIndex: i,
                    clipIndex: j,
                    mediaType: clip.mediaType,
                    nodeId: clip.nodeId,
                    type: clip.type,
                    compoennts: clip.components,
                    disabled: clip.disabled,
                });
            }
        }
        return tracksData;
    }catch(err:any){
        alert("Error getting tracks: " + String(err.message || err));
    }
}

export const getAllSelectedClips = () => {
    try {
        if (app.project.activeSequence) {
            var sequence = app.project.activeSequence;
            var selectedClips = [];
            var videoTracks = sequence.videoTracks;
            var audioTracks = sequence.audioTracks;
            var maxTracks = Math.max(videoTracks.numTracks, audioTracks.numTracks);
            
            // Single loop to process both video and audio tracks
            for (var i = 0; i < maxTracks; i++) {
                // Process video track if it exists
                if (i < videoTracks.numTracks) {
                    var videoTrack = videoTracks[i];
                    for (var j = 0; j < videoTrack.clips.numItems; j++) {
                        var videoClip = videoTrack.clips[j];
                        if (videoClip.isSelected()) {
                            selectedClips[selectedClips.length] = {
                                name: videoClip.name,
                                type: "video",
                                timelineInpoint: videoClip.start.seconds,
                                timelineoutPoint: videoClip.end.seconds,
                                assetInpoint: videoClip.inPoint.seconds,
                                assetOutpoint: videoClip.outPoint.seconds,
                                assetDuration: videoClip.duration.seconds,
                                filePath: videoClip.projectItem.getMediaPath(),
                                trackIndex: i
                            };
                        }
                    }
                }
                
                // Process audio track if it exists
                if (i < audioTracks.numTracks) {
                    var audioTrack = audioTracks[i];
                    for (var k = 0; k < audioTrack.clips.numItems; k++) {
                        var audioClip = audioTrack.clips[k];
                        if (audioClip.isSelected()) {
                            selectedClips[selectedClips.length] = {
                                name: audioClip.name,
                                type: "audio",
                                timelineInpoint: audioClip.start.seconds,
                                timelineoutPoint: audioClip.end.seconds,
                                assetInpoint: audioClip.inPoint.seconds,
                                assetOutpoint: audioClip.outPoint.seconds,
                                assetDuration: audioClip.duration.seconds,
                                filePath: audioClip.projectItem.getMediaPath(),
                                trackIndex: i
                            };
                        }
                    }
                }
            }

            return selectedClips;
        } else {
            return [];
        }
    } catch (e:any) {
        alert("Error getting selected clips: " + String(e.message || e));
        return [];
    }
}

type TrackType = 'video' | 'audio' | 'all';

const getClip = (trackType: TrackType, trackId: number, clipId: number) => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }

        if (trackType === 'video' || trackType === 'all') {
            try {
                return app.project.activeSequence.videoTracks[trackId].clips[clipId];
            } catch {
                if (trackType === 'video') {
                    throw new Error("Video clip not found");
                }
            }
        }
        
        if (trackType === 'audio' || trackType === 'all') {
            try {
                return app.project.activeSequence.audioTracks[trackId].clips[clipId];
            } catch {
                if (trackType === 'audio') {
                    throw new Error("Audio clip not found");
                }
            }
        }

        return null;
    } catch (err: any) {
        throw err;
    }
}

export const isSelected = (trackType: TrackType, trackId: number, clipId: number) => {
    try {
        const clip = getClip(trackType, trackId, clipId);
        return clip ? clip.isSelected() : false;
    } catch (err: any) {
        alert("Error checking selection: " + String(err.message || err));
        return false;
    }
}

export const getSpeed = (trackType: TrackType, trackId: number, clipId: number) => {
    try {
        const clip = getClip(trackType, trackId, clipId);
        return clip ? clip.getSpeed() : null;
    } catch (err: any) {
        alert("Error getting speed: " + String(err.message || err));
        return null;
    }
}

export const linkedItems = (trackType: TrackType, trackId: number, clipId: number) => {
    try {
        const clip = getClip(trackType, trackId, clipId);
        const items = clip ? clip.getLinkedItems() : null;
        return items !== null ? items : [];
    } catch (err: any) {
        alert("Error getting linked items: " + String(err.message || err));
        return [];
    }
}

export const isAdjustmentLayer = (trackType: TrackType, trackId: number, clipId: number) => {
    try {
        const clip = getClip(trackType, trackId, clipId);
        // Note: Adjustment layers are only available for video tracks
        return clip && trackType !== 'audio' ? clip.isAdjustmentLayer() : false;
    } catch (err: any) {
        alert("Error checking adjustment layer: " + String(err.message || err));
        return false;
    }
}

export const isSpeedReversed = (trackType: TrackType, trackId: number, clipId: number) => {
    try {
        const clip = getClip(trackType, trackId, clipId);
        return clip ? clip.isSpeedReversed() : false;
    } catch (err: any) {
        alert("Error checking speed reversed: " + String(err.message || err));
        return false;
    }
}

export const removeClip = (trackType: TrackType, trackId: number, clipId: number, rippleEdit: boolean = false, alignToVideo: boolean = true) => {
    try {
        const clip = getClip(trackType, trackId, clipId);
        if (clip) {
            clip.remove(rippleEdit, alignToVideo);
            return true;
        }
        return false;
    } catch (err: any) {
        alert("Error removing clip: " + String(err.message || err));
        return false;
    }
}