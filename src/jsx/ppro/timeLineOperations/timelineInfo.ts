interface TimelineClip {
    name: string;
    type: 'video' | 'audio';
    start: number;
    end: number;
    duration: number;
    inPoint: number;
    outPoint: number;
    trackIndex: number;
    isEnabled: boolean;
    isSelected: boolean;
    speed: number;
    mediaPath?: string;
    effects: {
        name: string;
        properties: {
            name: string;
            value: any;
        }[];
    }[];
}

interface TimelineTrack {
    name: string;
    type: 'video' | 'audio';
    index: number;
    isMuted: boolean;
    isLocked: boolean;
    clips: TimelineClip[];
}

interface TimelineInfo {
    name: string;
    duration: number;
    frameRate: {
        seconds: number;
        ticks: number;
    };
    resolution: {
        width: number;
        height: number;
    };
    videoTracks: TimelineTrack[];
    audioTracks: TimelineTrack[];
    markers: {
        name: string;
        time: number;
        duration: number;
        comments: string;
    }[];
}

export const getTimelineInfo = (): TimelineInfo | null => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }

        const sequence = app.project.activeSequence;
        const settings = sequence.getSettings();

        // Process video tracks
        const videoTracks: TimelineTrack[] = [];
        for (var i = 0; i < sequence.videoTracks.numTracks; i++) {
            const track = sequence.videoTracks[i];
            const clips: TimelineClip[] = [];

            // Get clips in this track
            for (var j = 0; j < track.clips.numItems; j++) {
                const clip = track.clips[j];
                const effects = [];

                // Get effects if any
                if (clip.components && clip.components.numItems) {
                    for (var k = 0; k < clip.components.numItems; k++) {
                        const effect = clip.components[k];
                        const properties = [];

                        for (var l = 0; l < effect.properties.numItems; l++) {
                            const prop = effect.properties[l];
                            properties.push({
                                name: prop.displayName,
                                value: prop.getValue()
                            });
                        }

                        effects.push({
                            name: effect.displayName,
                            properties
                        });
                    }
                }

                clips.push({
                    name: clip.name,
                    type: 'video',
                    start: clip.start.seconds,
                    end: clip.end.seconds,
                    duration: clip.duration.seconds,
                    inPoint: clip.inPoint.seconds,
                    outPoint: clip.outPoint.seconds,
                    trackIndex: i,
                    isEnabled: !clip.disabled,
                    isSelected: clip.isSelected(),
                    speed: clip.getSpeed(),
                    mediaPath: clip.projectItem?.getMediaPath(),
                    effects
                });
            }

            videoTracks.push({
                name: track.name?.toString() || `Video ${i + 1}`,
                type: 'video',
                index: i,
                isMuted: track.isMuted(),
                isLocked: track.isLocked(),
                clips
            });
        }

        // Process audio tracks
        const audioTracks: TimelineTrack[] = [];
        for (var i = 0; i < sequence.audioTracks.numTracks; i++) {
            const track = sequence.audioTracks[i];
            const clips: TimelineClip[] = [];

            for (var j = 0; j < track.clips.numItems; j++) {
                const clip = track.clips[j];
                const effects = [];

                if (clip.components && clip.components.numItems) {
                    for (var k = 0; k < clip.components.numItems; k++) {
                        const effect = clip.components[k];
                        const properties = [];

                        for (var l = 0; l < effect.properties.numItems; l++) {
                            const prop = effect.properties[l];
                            properties.push({
                                name: prop.displayName,
                                value: prop.getValue()
                            });
                        }

                        effects.push({
                            name: effect.displayName,
                            properties
                        });
                    }
                }

                clips.push({
                    name: clip.name,
                    type: 'audio',
                    start: clip.start.seconds,
                    end: clip.end.seconds,
                    duration: clip.duration.seconds,
                    inPoint: clip.inPoint.seconds,
                    outPoint: clip.outPoint.seconds,
                    trackIndex: i,
                    isEnabled: !clip.disabled,
                    isSelected: clip.isSelected(),
                    speed: clip.getSpeed(),
                    mediaPath: clip.projectItem?.getMediaPath(),
                    effects
                });
            }

            audioTracks.push({
                name: (track.name?.toString())   || `Audio ${i + 1}`,
                type: 'audio',
                index: i,
                isMuted: track.isMuted(),
                isLocked: track.isLocked(),
                clips
            });
        }

        // Get markers
        const markers = [];
        if (sequence.markers) {
            for (var i = 0; i < sequence.markers.numMarkers; i++) {
                const marker = sequence.markers[i];
                markers.push({
                    name: marker.name,
                    time: marker.start.seconds,
                    duration: (marker.end.seconds - marker.start.seconds),
                    comments: marker.comments
                });
            }
        }

        return {
            name: sequence.name,
            duration: sequence.getOutPointAsTime().seconds,
            frameRate: {
                seconds: settings.videoFrameRate.seconds,
                ticks: Number(settings.videoFrameRate.ticks)
            },
            resolution: {
                width: sequence.frameSizeHorizontal,
                height: sequence.frameSizeVertical
            },
            videoTracks,
            audioTracks,
            markers
        };

    } catch (err: any) {
        alert("Error getting timeline info: " + String(err.message || err));
        return null;
    }
};

export const getClipsAtTime = (timeInSeconds: number): TimelineClip[] => {
    try {
        const timelineInfo = getTimelineInfo();
        if (!timelineInfo) return [];

        const clipsAtTime: TimelineClip[] = [];

        // Check video tracks
        for (var i = 0; i < timelineInfo.videoTracks.length; i++) {
            var track = timelineInfo.videoTracks[i];
            for (var j = 0; j < track.clips.length; j++) {
                var clip = track.clips[j];
                if (clip.start <= timeInSeconds && clip.end >= timeInSeconds) {
                    clipsAtTime.push(clip);
                }
            }
        }

        // Check audio tracks
        for (var i = 0; i < timelineInfo.audioTracks.length; i++) {
            var track = timelineInfo.audioTracks[i];
            for (var j = 0; j < track.clips.length; j++) {
                var clip = track.clips[j];
                if (clip.start <= timeInSeconds && clip.end >= timeInSeconds) {
                    clipsAtTime.push(clip);
                }
            }
        }

        return clipsAtTime;

    } catch (err: any) {
        alert("Error getting clips at time: " + String(err.message || err));
        return [];
    }
};

export const getTimelineEffects = (options?: {
    trackType?: 'video' | 'audio';
    trackIndex?: number;
    clipIndex?: number;
}): { clipName: string; trackType: string; trackIndex: number; clipIndex: number; effects: any[] }[] => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }

        const sequence = app.project.activeSequence;
        const effectsInfo: { clipName: string; trackType: string; trackIndex: number; clipIndex: number; effects: any[] }[] = [];

        // If specific clip requested by index
        if (options && options.trackType && typeof options.trackIndex === 'number' && typeof options.clipIndex === 'number') {
            const tracks = options.trackType === 'video' ? sequence.videoTracks : sequence.audioTracks;
            
            if (options.trackIndex >= tracks.numTracks) {
                alert("Track index " + options.trackIndex + " out of bounds");
                return [];
            }

            const track = tracks[options.trackIndex];
            if (options.clipIndex >= track.clips.numItems) {
                alert("Clip index " + options.clipIndex + " out of bounds");
                return [];
            }

            const clip = track.clips[options.clipIndex];
            const effects = [];

            if (clip.components && clip.components.numItems > 0) {
                for (var k = 0; k < clip.components.numItems; k++) {
                    const effect = clip.components[k];
                    const properties = [];

                    for (var l = 0; l < effect.properties.numItems; l++) {
                        const prop = effect.properties[l];
                        properties.push({
                            name: prop.displayName,
                            value: prop.getValue(),
                            isKeyframed: prop.isTimeVarying()
                        });
                    }

                    effects.push({
                        name: effect.displayName,
                        matchName: effect.matchName,
                        properties
                    });
                }
            }

            return [{
                clipName: clip.name,
                trackType: options.trackType,
                trackIndex: options.trackIndex,
                clipIndex: options.clipIndex,
                effects
            }];
        }

        // Check video tracks
        for (var i = 0; i < sequence.videoTracks.numTracks; i++) {
            var track = sequence.videoTracks[i];
            for (var j = 0; j < track.clips.numItems; j++) {
                var clip = track.clips[j];

                const effects = [];
                if (clip.components && clip.components.numItems > 0) {
                    for (var k = 0; k < clip.components.numItems; k++) {
                        const effect = clip.components[k];
                        const properties = [];

                        for (var l = 0; l < effect.properties.numItems; l++) {
                            const prop = effect.properties[l];
                            properties.push({
                                name: prop.displayName,
                                value: prop.getValue(),
                                isKeyframed: prop.isTimeVarying()
                            });
                        }

                        effects.push({
                            name: effect.displayName,
                            matchName: effect.matchName,
                            properties
                        });
                    }
                }

                if (effects.length > 0) {
                    effectsInfo.push({
                        clipName: clip.name,
                        trackType: 'video',
                        trackIndex: i,
                        clipIndex: j,
                        effects
                    });
                }
            }
        }

        // Check audio tracks
        for (var i = 0; i < sequence.audioTracks.numTracks; i++) {
            var track = sequence.audioTracks[i];
            for (var j = 0; j < track.clips.numItems; j++) {
                var clip = track.clips[j];
                const effects = [];
                if (clip.components && clip.components.numItems > 0) {
                    for (var k = 0; k < clip.components.numItems; k++) {
                        const effect = clip.components[k];
                        const properties = [];

                        for (var l = 0; l < effect.properties.numItems; l++) {
                            const prop = effect.properties[l];
                            properties.push({
                                name: prop.displayName,
                                value: prop.getValue(),
                                isKeyframed: prop.isTimeVarying()
                            });
                        }

                        effects.push({
                            name: effect.displayName,
                            matchName: effect.matchName,
                            properties
                        });
                    }
                }

                if (effects.length > 0) {
                    effectsInfo.push({
                        clipName: clip.name,
                        trackType: 'audio',
                        trackIndex: i,
                        clipIndex: j,
                        effects
                    });
                }
            }
        }

        return effectsInfo;

    } catch (err: any) {
        alert("Error getting timeline effects: " + String(err.message || err));
        return [];
    }
};
