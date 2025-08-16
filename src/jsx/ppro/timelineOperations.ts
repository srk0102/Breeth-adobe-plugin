import { TrackType, TimelineMap, TimelineTrack, TimelineClip, TimelineComponent, TimelineComponentProperty } from './types';

function collectionToArray(collection: any) {
    var result = [];
    if (collection) {
        for (var i = 0; i < collection.numItems; i++) {
            result.push(collection[i]);
        }
    }
    return result;
}

/**
 * Inserts a clip at a specific time in the sequence
 */
export const insertClipAtTime = (projectItem: any, timeInSeconds: number, videoTrackOffset: number = 0, audioTrackOffset: number = 0) => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }
        
        const time = new Time();
        time.seconds = timeInSeconds;
        
        return app.project.activeSequence.insertClip(projectItem, time, videoTrackOffset, audioTrackOffset);
    } catch (err: any) {
        alert("Error inserting clip: " + String(err.message || err));
        return null;
    }
};

/**
 * Gets complete timeline map with all clips, tracks, and their properties
 */
export const getTimelineMap = (): TimelineMap | null => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }

        const sequence = app.project.activeSequence;
        const videoTracks: TimelineTrack[] = [];
        const audioTracks: TimelineTrack[] = [];

        // Process video tracks
        for (var i = 0; i < sequence.videoTracks.numTracks; i++) {
            const track = sequence.videoTracks[i];
            const clips: TimelineClip[] = [];

            // Get clips in this track
            for (var j = 0; j < track.clips.numItems; j++) {
                const clip = track.clips[j];
                const components: TimelineComponent[] = [];

                // Get all effects/components on the clip
                if (clip.components) {
                    for (var k = 0; k < clip.components.numItems; k++) {
                        const component = clip.components[k];
                        const properties: TimelineComponentProperty[] = [];

                        // Get all properties of this effect
                        for (var l = 0; l < component.properties.numItems; l++) {
                            const prop = component.properties[l];
                            properties.push({
                                name: prop.displayName,
                                value: prop.getValue(),
                                isKeyframed: prop.isTimeVarying()
                            });
                        }

                        components.push({
                            name: component.displayName,
                            matchName: component.matchName,
                            properties
                        });
                    }
                }

                clips.push({
                    name: clip.name,
                    type: 'video',
                    start: clip.start.seconds,
                    end: clip.end.seconds,
                    inPoint: clip.inPoint.seconds,
                    outPoint: clip.outPoint.seconds,
                    duration: clip.duration.seconds,
                    trackIndex: i,
                    mediaPath: clip.projectItem?.getMediaPath(),
                    isEnabled: !clip.disabled,
                    isSelected: clip.isSelected(),
                    isAdjustmentLayer: clip.isAdjustmentLayer(),
                    speed: clip.getSpeed(),
                    isSpeedReversed: Boolean(clip.isSpeedReversed()),
                    components,
                    linkedItems: collectionToArray(clip.getLinkedItems())
                });
            }

            videoTracks.push({
                type: 'video',
                index: i,
                name: (track.name?.toString()) || `Video ${i + 1}`,
                isMuted: track.isMuted(),
                isLocked: track.isLocked(),
                clips,
                transitions: collectionToArray(track.transitions)
            });
        }

        // Process audio tracks
        for (var i = 0; i < sequence.audioTracks.numTracks; i++) {
            const track = sequence.audioTracks[i];
            const clips: TimelineClip[] = [];

            // Get clips in this track
            for (var j = 0; j < track.clips.numItems; j++) {
                const clip = track.clips[j];
                const components: TimelineComponent[] = [];

                // Get all effects/components on the clip
                if (clip.components) {
                    for (var k = 0; k < clip.components.numItems; k++) {
                        const component = clip.components[k];
                        const properties: TimelineComponentProperty[] = [];

                        // Get all properties of this effect
                        for (var l = 0; l < component.properties.numItems; l++) {
                            const prop = component.properties[l];
                            properties.push({
                                name: prop.displayName,
                                value: prop.getValue(),
                                isKeyframed: prop.isTimeVarying()
                            });
                        }

                        components.push({
                            name: component.displayName,
                            matchName: component.matchName,
                            properties
                        });
                    }
                }

                clips.push({
                    name: clip.name,
                    type: 'audio',
                    start: clip.start.seconds,
                    end: clip.end.seconds,
                    inPoint: clip.inPoint.seconds,
                    outPoint: clip.outPoint.seconds,
                    duration: clip.duration.seconds,
                    trackIndex: i,
                    mediaPath: clip.projectItem?.getMediaPath(),
                    isEnabled: !clip.disabled,
                    isSelected: clip.isSelected(),
                    speed: clip.getSpeed(),
                    isSpeedReversed: Boolean(clip.isSpeedReversed()),
                    components,
                    linkedItems: collectionToArray(clip.getLinkedItems())
                });
            }

            audioTracks.push({
                type: 'audio',
                index: i,
                name: (track.name?.toString()) || `Audio ${i + 1}`,
                isMuted: track.isMuted(),
                isLocked: track.isLocked(),
                clips,
                transitions: collectionToArray(track.transitions)
            });
        }

        const settings = sequence.getSettings();

        return {
            duration: sequence.getOutPointAsTime().seconds,
            videoTracks,
            audioTracks,
            frameRate: settings.videoFrameRate.seconds,
            resolution: {
                width: sequence.frameSizeHorizontal,
                height: sequence.frameSizeVertical
            }
        };

    } catch (err: any) {
        alert("Error getting timeline map: " + String(err.message || err));
        return null;
    }
};