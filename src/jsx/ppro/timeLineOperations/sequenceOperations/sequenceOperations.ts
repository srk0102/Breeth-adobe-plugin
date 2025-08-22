import { 
    forEachVideoTrack, 
    forEachClip, 
    subtractTime, 
    divideTime,
    getActiveSeq,
    isAnyTrackLocked,
    collectAllIntervals,
    mergeIntervals,
    computeGaps,
    rippleShiftClipsFrom
} from "../../ppro-utils";

// Types for the ripple algorithm
type SequenceHandle = any;
type TrackHandle = any;
type ClipHandle = any;

/**
 * Creates a new sequence
 */
export const createSequence = (sequenceName: string) => {
    try {
        return app.project.createNewSequence(sequenceName, "");
    } catch (err: any) {
        alert("Error creating sequence: " + String(err.message || err));
        return null;
    }
};

/**
 * Gets sequence settings
 */
export const getSequenceSettings = () => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }
        return app.project.activeSequence.getSettings();
    } catch (err: any) {
        alert("Error getting sequence settings: " + String(err.message || err));
        return null;
    }
};

/**
 * Sets sequence settings
 */
export const setSequenceSettings = (settings: any) => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }
        app.project.activeSequence.setSettings(settings);
        return true;
    } catch (err: any) {
        alert("Error setting sequence settings: " + String(err.message || err));
        return false;
    }
};

/**
 * Gets sequence duration in seconds
 */
export const getSequenceDuration = () => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }
        const endTime = app.project.activeSequence.getOutPointAsTime();
        return endTime.seconds;
    } catch (err: any) {
        alert("Error getting sequence duration: " + String(err.message || err));
        return null;
    }
};

/**
 * Gets sequence frame size
 */
export const getSequenceFrameSize = () => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }
        return {
            width: app.project.activeSequence.frameSizeHorizontal,
            height: app.project.activeSequence.frameSizeVertical
        };
    } catch (err: any) {
        alert("Error getting sequence frame size: " + String(err.message || err));
        return null;
    }
};

/**
 * Exports sequence using encoder preset
 */
export const exportSequence = (outputPath: string, presetPath: string) => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }
        return app.project.activeSequence.exportAsMediaDirect(
            outputPath,
            presetPath,
            app.encoder.ENCODE_ENTIRE
        );
    } catch (err: any) {
        alert("Error exporting sequence: " + String(err.message || err));
        return null;
    }
};

/**
 * Performs auto reframe on sequence
 */
export const autoReframeSequence = (
    aspectRatio: { numerator: number; denominator: number },
    motionPreset: "default" | "faster" | "slower" = "default",
    newSequenceName: string,
    nested: boolean = false
) => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }
        return app.project.activeSequence.autoReframeSequence(
            aspectRatio.numerator,
            aspectRatio.denominator,
            motionPreset,
            newSequenceName,
            nested
        );
    } catch (err: any) {
        alert("Error auto-reframing sequence: " + String(err.message || err));
        return null;
    }
};

/**
 * Find gaps in VIDEO TRACKS ONLY - simple loop approach
 */
export const findGapsInVideoTracks = (minGapDuration: number = 0.1) => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }

        var sequence = app.project.activeSequence;
        var videoGaps = [];

        // Process video tracks ONLY
        for (var i = 0; i < sequence.videoTracks.numTracks; i++) {
            var track = sequence.videoTracks[i];

            // Skip empty tracks
            if (track.clips.numItems === 0) continue;

            // Loop through clips in this track
            for (var j = 0; j < track.clips.numItems - 1; j++) {
                var currentClip = track.clips[j];
                var nextClip = track.clips[j + 1];

                var currentEndTime:any = currentClip.end.ticks;
                var nextStartTime:any = nextClip.start.ticks;
                var gapDuration = nextStartTime - currentEndTime;

                // If first clip end time is NOT next to second clip start time
                if (gapDuration >= minGapDuration) {
                    videoGaps.push({
                        trackIndex: i,
                        trackName: track.name || ('Video ' + (i + 1)),
                        clipBefore: {
                            name: currentClip.name,
                            endTime: currentEndTime,
                            clipIndex: j
                        },
                        clipAfter: {
                            name: nextClip.name,
                            startTime: nextStartTime,
                            clipIndex: j + 1
                        },
                        gapStart: currentEndTime,
                        gapEnd: nextStartTime,
                        gapDuration: gapDuration
                    });
                }
            }
        }

        return {
            success: true,
            gapsFound: videoGaps.length,
            gaps: videoGaps,
            message: 'Found ' + videoGaps.length + ' gaps in video tracks'
        };

    } catch (err: any) {
        alert("Error finding gaps in video tracks: " + String(err.message || err));
        return {
            success: false,
            error: String(err.message || err)
        };
    }
};


export const rippleRemoveAllGaps = () => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return {
                success: false,
                error: "No active sequence"
            };
        }

        if (isAnyTrackLocked(seq)) {
            alert("[breeth] Unlock all tracks before ripple-removing gaps.");
            return {
                success: false,
                error: "Some tracks are locked"
            };
        }

        const intervals = collectAllIntervals(seq);
        if (intervals.length === 0) {
            return {
                success: true,
                message: "No clips found"
            };
        }

        const merged = mergeIntervals(intervals);
        const gaps = computeGaps(merged);
        if (gaps.length === 0) {
            return {
                success: true,
                message: "No gaps found"
            };
        }

        let cumulative = 0;

        for (const g of gaps) {
            const start = g.start;
            const end = g.end;
            const dur = end - start;
            const pivot = end - cumulative;
            rippleShiftClipsFrom(seq, pivot, -dur);
            cumulative += dur;
        }

        return {
            success: true,
            gapsRemoved: gaps.length,
            totalTimeRemoved: cumulative,
            method: 'ripple_global',
            message: 'Successfully removed ' + gaps.length + ' global gaps using ripple algorithm'
        };

    } catch (err: any) {
        alert("Error with ripple remove gaps: " + String(err.message || err));
        return {
            success: false,
            error: String(err.message || err)
        };
    }
};

/**
 * Remove gap after a specific clip by track and clip index
 */
export const removeGapAfterClip = (trackIndex: number, clipIndex: number, trackType: 'video' | 'audio' = 'video') => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return {
                success: false,
                error: "No active sequence"
            };
        }

        // Get the specified track
        let track;
        if (trackType === 'video') {
            if (trackIndex >= seq.videoTracks.numTracks) {
                return {
                    success: false,
                    error: `Video track ${trackIndex} does not exist`
                };
            }
            track = seq.videoTracks[trackIndex];
        } else {
            if (trackIndex >= seq.audioTracks.numTracks) {
                return {
                    success: false,
                    error: `Audio track ${trackIndex} does not exist`
                };
            }
            track = seq.audioTracks[trackIndex];
        }

        // Check if clip exists
        if (clipIndex >= track.clips.numItems) {
            return {
                success: false,
                error: `Clip ${clipIndex} does not exist on ${trackType} track ${trackIndex}`
            };
        }

        const currentClip = track.clips[clipIndex];
        
        // Check if there's a next clip
        if (clipIndex >= track.clips.numItems - 1) {
            return {
                success: true,
                message: "No gap to remove - this is the last clip on the track"
            };
        }

        const nextClip = track.clips[clipIndex + 1];
        
        // Calculate gap in ticks for frame accuracy
        const sequenceSettings = seq.getSettings();
        const frameRate = sequenceSettings.videoFrameRate;
        const oneFrameInTicks = parseInt(frameRate.ticks) / frameRate.seconds;
        
        const gapInTicks = parseInt(nextClip.start.ticks) - parseInt(currentClip.end.ticks);
        
        if (gapInTicks <= 0) {
            return {
                success: true,
                message: "No gap found between the specified clips"
            };
        }

        // Leave 1 frame buffer to prevent overlap
        const moveAmountInTicks = gapInTicks - oneFrameInTicks;
        
        if (moveAmountInTicks > 0) {
            // Convert ticks to seconds for move() call
            const moveAmountInSeconds = moveAmountInTicks / parseInt(frameRate.ticks);
            
            // Move the next clip forward (negative value)
            nextClip.move(-moveAmountInSeconds);
            
            // Move linked clips (for A/V sync)
            const linkedItems = nextClip.getLinkedItems();
            if (linkedItems) {
                for (let k = 0; k < linkedItems.numItems; k++) {
                    const linkedClip = linkedItems[k];
                    linkedClip.move(-moveAmountInSeconds);
                }
            }
            
            return {
                success: true,
                trackType: trackType,
                trackIndex: trackIndex,
                clipIndex: clipIndex,
                gapRemovedTicks: moveAmountInTicks,
                gapRemovedSeconds: moveAmountInSeconds,
                method: 'specific_clip',
                message: `Successfully removed gap after ${trackType} track ${trackIndex}, clip ${clipIndex}`
            };
        } else {
            return {
                success: true,
                message: "Gap too small to remove (less than 1 frame)"
            };
        }

    } catch (err: any) {
        alert("Error removing gap after specific clip: " + String(err.message || err));
        return {
            success: false,
            error: String(err.message || err)
        };
    }
};



