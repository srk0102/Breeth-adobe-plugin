import { getActiveSeq, getClips } from "../../ppro-utils";

/**
 * COMPREHENSIVE CLIP OPERATIONS
 * Based on Adobe Premiere Pro ExtendScript API
 * All available clip manipulation functions
 */

// ================================
// BASIC CLIP OPERATIONS
// ================================

/**
 * Insert a clip into the timeline
 */
export const insertClip = (
    projectItem: ProjectItem,
    time: Time,
    videoTrackOffset: number = 0,
    audioTrackOffset: number = 0
) => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        const trackItem = seq.insertClip(projectItem, time, videoTrackOffset, audioTrackOffset);

        return {
            success: true,
            trackItem: trackItem,
            message: "Clip inserted successfully"
        };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

/**
 * Insert clip on specific track
 */
export const insertClipOnTrack = (
    trackIndex: number,
    projectItem: ProjectItem,
    time: number,
    trackType: 'video' | 'audio' = 'video'
) => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        let track;
        if (trackType === 'video') {
            if (trackIndex >= seq.videoTracks.numTracks) {
                return { success: false, error: `Video track ${trackIndex} does not exist` };
            }
            track = seq.videoTracks[trackIndex];
        } else {
            if (trackIndex >= seq.audioTracks.numTracks) {
                return { success: false, error: `Audio track ${trackIndex} does not exist` };
            }
            track = seq.audioTracks[trackIndex];
        }

        const success = track.insertClip(projectItem, time);

        return {
            success: success,
            trackType: trackType,
            trackIndex: trackIndex,
            message: success ? "Clip inserted on track successfully" : "Failed to insert clip"
        };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

/**
 * Overwrite clip on specific track
 */
export const overwriteClipOnTrack = (
    trackIndex: number,
    projectItem: ProjectItem,
    time: number | Time,
    trackType: 'video' | 'audio' = 'video'
) => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        let track;
        if (trackType === 'video') {
            track = seq.videoTracks[trackIndex];
        } else {
            track = seq.audioTracks[trackIndex];
        }

        const success = track.overwriteClip(projectItem, time);

        return {
            success: success,
            trackType: trackType,
            trackIndex: trackIndex,
            message: success ? "Clip overwritten successfully" : "Failed to overwrite clip"
        };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

/**
 * Move clip to new position
 */
export const moveClip = (
    trackIndex: number,
    clipIndex: number,
    seconds: number,
    trackType: 'video' | 'audio' = 'video'
) => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        let track;
        if (trackType === 'video') {
            track = seq.videoTracks[trackIndex];
        } else {
            track = seq.audioTracks[trackIndex];
        }

        const clip = track.clips[clipIndex];
        const success = clip.move(seconds);

        return {
            success: success,
            trackType: trackType,
            trackIndex: trackIndex,
            clipIndex: clipIndex,
            newPosition: seconds,
            message: success ? "Clip moved successfully" : "Failed to move clip"
        };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

// ================================
// CLIP SELECTION OPERATIONS
// ================================

/**
 * Get currently selected clips
 */
export const getSelectedClips = () => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        const selection = seq.getSelection();
        const selectedClips = [];

        for (let i = 0; i < selection.length; i++) {
            const clip = selection[i];
            selectedClips.push({
                name: clip.name,
                start: clip.start.seconds,
                end: clip.end.seconds,
                duration: clip.duration.seconds,
                mediaType: clip.mediaType,
                nodeId: clip.nodeId
            });
        }

        return {
            success: true,
            count: selection.length,
            clips: selectedClips
        };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

/**
 * Select/deselect clip
 */
export const setClipSelection = (
    trackIndex: number,
    clipIndex: number,
    selected: boolean,
    updateUI: boolean = true,
    trackType: 'video' | 'audio' = 'video'
) => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        let track;
        if (trackType === 'video') {
            track = seq.videoTracks[trackIndex];
        } else {
            track = seq.audioTracks[trackIndex];
        }

        const clip = track.clips[clipIndex];
        clip.setSelected(selected, updateUI);

        return {
            success: true,
            trackType: trackType,
            trackIndex: trackIndex,
            clipIndex: clipIndex,
            selected: selected,
            message: `Clip ${selected ? 'selected' : 'deselected'} successfully`
        };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

/**
 * Check if clip is selected
 */
export const isClipSelected = (trackIndex: number, clipIndex: number, trackType: 'video' | 'audio' = 'video') => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        let track;
        if (trackType === 'video') {
            track = seq.videoTracks[trackIndex];
        } else {
            track = seq.audioTracks[trackIndex];
        }

        const clip = track.clips[clipIndex];
        const isSelected = clip.isSelected();

        return {
            success: true,
            trackType: trackType,
            trackIndex: trackIndex,
            clipIndex: clipIndex,
            isSelected: isSelected
        };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

/**
 * Link selected clips
 */
export const linkSelectedClips = () => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        const success = seq.linkSelection();

        return {
            success: success,
            message: success ? "Selected clips linked successfully" : "Failed to link clips"
        };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

/**
 * Unlink selected clips
 */
export const unlinkSelectedClips = () => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        const success = seq.unlinkSelection();

        return {
            success: success,
            message: success ? "Selected clips unlinked successfully" : "Failed to unlink clips"
        };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

/**
 * Get linked clips
 */
export const getLinkedClips = (trackIndex: number, clipIndex: number, trackType: 'video' | 'audio' = 'video') => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        let track;
        if (trackType === 'video') {
            track = seq.videoTracks[trackIndex];
        } else {
            track = seq.audioTracks[trackIndex];
        }

        const clip = track.clips[clipIndex];
        const linkedItems = clip.getLinkedItems();
        const linkedClips = [];

        for (let i = 0; i < linkedItems.numItems; i++) {
            const linkedClip = linkedItems[i];
            linkedClips.push({
                name: linkedClip.name,
                start: linkedClip.start.seconds,
                end: linkedClip.end.seconds,
                mediaType: linkedClip.mediaType,
                nodeId: linkedClip.nodeId
            });
        }

        return {
            success: true,
            trackType: trackType,
            trackIndex: trackIndex,
            clipIndex: clipIndex,
            linkedCount: linkedItems.numItems,
            linkedClips: linkedClips
        };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

// ================================
// CLIP PROPERTIES OPERATIONS
// ================================

/**
 * Get comprehensive clip properties
 */
export const getClipProperties = (trackIndex: number, clipIndex: number, trackType: 'video' | 'audio' = 'video') => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        let track;
        if (trackType === 'video') {
            track = seq.videoTracks[trackIndex];
        } else {
            track = seq.audioTracks[trackIndex];
        }

        const clip = track.clips[clipIndex];

        const properties = {
            // Basic properties
            name: clip.name,
            duration: clip.duration.seconds,
            start: clip.start.seconds,
            end: clip.end.seconds,
            inPoint: clip.inPoint.seconds,
            outPoint: clip.outPoint.seconds,

            // State properties
            disabled: clip.disabled,
            enabled: !clip.disabled,

            // Media properties
            mediaType: clip.mediaType,
            nodeId: clip.nodeId,
            type: clip.type,

            // Speed properties
            speed: clip.getSpeed(),
            isSpeedReversed: clip.isSpeedReversed(),

            // Project item info
            projectItemName: clip.projectItem.name,
            mediaPath: clip.projectItem.getMediaPath(),

            // Additional checks
            isAdjustmentLayer: clip.isAdjustmentLayer(),
            colorSpace: clip.getColorSpace()
        };

        return {
            success: true,
            trackType: trackType,
            trackIndex: trackIndex,
            clipIndex: clipIndex,
            properties: properties
        };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

/**
 * Update clip basic properties
 */
export const updateClipProperties = (
    trackIndex: number,
    clipIndex: number,
    properties: {
        name?: string;
        disabled?: boolean;
        inPoint?: number;
        outPoint?: number;
    },
    trackType: 'video' | 'audio' = 'video'
) => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        let track;
        if (trackType === 'video') {
            track = seq.videoTracks[trackIndex];
        } else {
            track = seq.audioTracks[trackIndex];
        }

        const clip = track.clips[clipIndex];
        const updatedProps = [];

        // Update name
        if (properties.name !== undefined) {
            clip.name = properties.name;
            updatedProps.push({ property: 'name', value: properties.name });
        }

        // Update disabled state
        if (properties.disabled !== undefined) {
            clip.disabled = properties.disabled;
            updatedProps.push({ property: 'disabled', value: properties.disabled });
        }

        // Update in/out points
        if (properties.inPoint !== undefined) {
            const newInPoint = new Time();
            newInPoint.seconds = properties.inPoint;
            clip.inPoint = newInPoint;
            updatedProps.push({ property: 'inPoint', value: properties.inPoint });
        }

        if (properties.outPoint !== undefined) {
            const newOutPoint = new Time();
            newOutPoint.seconds = properties.outPoint;
            clip.outPoint = newOutPoint;
            updatedProps.push({ property: 'outPoint', value: properties.outPoint });
        }

        return {
            success: true,
            trackType: trackType,
            trackIndex: trackIndex,
            clipIndex: clipIndex,
            updatedProperties: updatedProps,
            message: "Clip properties updated successfully"
        };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

/**
 * Get clip speed
 */
export const getClipSpeed = (trackIndex: number, clipIndex: number, trackType: 'video' | 'audio' = 'video') => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        let track;
        if (trackType === 'video') {
            track = seq.videoTracks[trackIndex];
        } else {
            track = seq.audioTracks[trackIndex];
        }

        const clip = track.clips[clipIndex];
        const speed = clip.getSpeed();
        const isReversed = clip.isSpeedReversed();

        return {
            success: true,
            trackType: trackType,
            trackIndex: trackIndex,
            clipIndex: clipIndex,
            speed: speed,
            isReversed: isReversed
        };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

// ================================
// CLIP EFFECTS & COMPONENTS
// ================================

/**
 * Get all effects/components on a clip
 */
export const getClipEffects = (trackIndex: number, clipIndex: number, trackType: 'video' | 'audio' = 'video') => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        let track;
        if (trackType === 'video') {
            track = seq.videoTracks[trackIndex];
        } else {
            track = seq.audioTracks[trackIndex];
        }

        const clip = track.clips[clipIndex];
        const effects = [];

        // Get all components/effects
        if (clip.components) {
            for (let i = 0; i < clip.components.numItems; i++) {
                const component = clip.components[i];
                effects.push({
                    index: i,
                    displayName: component.displayName,
                    matchName: component.matchName
                });
            }
        }

        return {
            success: true,
            trackType: trackType,
            trackIndex: trackIndex,
            clipIndex: clipIndex,
            effectsCount: effects.length,
            effects: effects
        };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

/**
 * Get Motion Graphics Template component
 */
export const getMGTComponent = (trackIndex: number, clipIndex: number, trackType: 'video' | 'audio' = 'video') => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        let track;
        if (trackType === 'video') {
            track = seq.videoTracks[trackIndex];
        } else {
            track = seq.audioTracks[trackIndex];
        }

        const clip = track.clips[clipIndex];
        const mgtComponent = clip.getMGTComponent();

        if (!mgtComponent) {
            return { success: false, error: "No Motion Graphics Template component found" };
        }

        return {
            success: true,
            trackType: trackType,
            trackIndex: trackIndex,
            clipIndex: clipIndex,
            mgtComponent: {
                displayName: mgtComponent.displayName,
                matchName: mgtComponent.matchName
            }
        };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

/**
 * Get all component properties of a clip
 */
export const getAllComponentProperties = (trackIndex: number, clipIndex: number, trackType: 'video' | 'audio' = 'video') => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        let track;
        if (trackType === 'video') {
            track = seq.videoTracks[trackIndex];
        } else {
            track = seq.audioTracks[trackIndex];
        }

        const clip = track.clips[clipIndex];
        const allProperties = [];

        // Loop through all components
        if (clip.components) {
            for (let i = 0; i < clip.components.numItems; i++) {
                const component = clip.components[i];
                const componentProps: any = {
                    componentIndex: i,
                    componentName: component.displayName,
                    matchName: component.matchName,
                    properties: []
                };

                // Get all properties of this component
                if (component.properties) {
                    for (let j = 0; j < component.properties.numItems; j++) {
                        const prop = component.properties[j];
                        componentProps.properties.push({
                            index: j,
                            displayName: prop.displayName,
                            value: prop.getValue(),
                            isTimeVarying: prop.isTimeVarying(),
                            supportsKeyframes: prop.areKeyframesSupported(),
                            dataType: typeof prop.getValue()
                        });
                    }
                }

                allProperties.push(componentProps);
            }
        }

        return {
            success: true,
            trackType: trackType,
            trackIndex: trackIndex,
            clipIndex: clipIndex,
            totalComponents: allProperties.length,
            components: allProperties
        };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

/**
 * Set component properties
 */
export const setComponentProperties = (
    trackIndex: number,
    clipIndex: number,
    componentName: string,
    properties: { [propertyName: string]: any },
    trackType: 'video' | 'audio' = 'video'
) => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        let track;
        if (trackType === 'video') {
            track = seq.videoTracks[trackIndex];
        } else {
            track = seq.audioTracks[trackIndex];
        }

        const clip = track.clips[clipIndex];

        // Find the component
        let targetComponent = null;
        for (let i = 0; i < clip.components.numItems; i++) {
            const component = clip.components[i];
            if (component.displayName === componentName || component.matchName === componentName) {
                targetComponent = component;
                break;
            }
        }

        if (!targetComponent) {
            return { success: false, error: `Component '${componentName}' not found` };
        }

        const updatedProperties = [];

        // Set each property
        for (const propName in properties) {
            const propValue = properties[propName];
            const property = targetComponent.properties.getParamForDisplayName(propName);

            if (property) {
                property.setValue(propValue, true);
                updatedProperties.push({
                    name: propName,
                    value: propValue,
                    success: true
                });
            } else {
                updatedProperties.push({
                    name: propName,
                    value: propValue,
                    success: false,
                    error: "Property not found"
                });
            }
        }

        return {
            success: true,
            componentName: componentName,
            updatedProperties: updatedProperties,
            message: `Updated properties for component '${componentName}'`
        };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

/**
 * Set component property with keyframes
 */
export const setComponentPropertyWithKeyframes = (
    trackIndex: number,
    clipIndex: number,
    componentName: string,
    propertyName: string,
    keyframes: { time: Time; value: any }[],
    trackType: 'video' | 'audio' = 'video'
) => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        let track;
        if (trackType === 'video') {
            track = seq.videoTracks[trackIndex];
        } else {
            track = seq.audioTracks[trackIndex];
        }

        const clip = track.clips[clipIndex];

        // Find the component
        let targetComponent = null;
        for (let i = 0; i < clip.components.numItems; i++) {
            const component = clip.components[i];
            if (component.displayName === componentName || component.matchName === componentName) {
                targetComponent = component;
                break;
            }
        }

        if (!targetComponent) {
            return { success: false, error: `Component '${componentName}' not found` };
        }

        const property = targetComponent.properties.getParamForDisplayName(propertyName);
        if (!property) {
            return { success: false, error: `Property '${propertyName}' not found` };
        }

        if (!property.areKeyframesSupported()) {
            return { success: false, error: `Property '${propertyName}' does not support keyframes` };
        }

        // Enable time varying
        property.setTimeVarying(true);

        // Set keyframes
        const setKeyframes = [];
        for (const keyframe of keyframes) {
            property.setValueAtKey(keyframe.time, keyframe.value, true);
            setKeyframes.push({
                time: keyframe.time.seconds,
                value: keyframe.value
            });
        }

        return {
            success: true,
            componentName: componentName,
            propertyName: propertyName,
            keyframesSet: setKeyframes.length,
            keyframes: setKeyframes,
            message: `Set ${setKeyframes.length} keyframes for ${propertyName}`
        };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

// ================================
// CLIP METADATA OPERATIONS
// ================================

/**
 * Get clip metadata
 */
export const getClipMetadata = (trackIndex: number, clipIndex: number, trackType: 'video' | 'audio' = 'video') => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        let track;
        if (trackType === 'video') {
            track = seq.videoTracks[trackIndex];
        } else {
            track = seq.audioTracks[trackIndex];
        }

        const clip = track.clips[clipIndex];
        const projectItem = clip.projectItem;

        const metadata: any = {
            // Basic clip info
            name: clip.name,
            duration: clip.duration.seconds,
            start: clip.start.seconds,
            end: clip.end.seconds,
            inPoint: clip.inPoint.seconds,
            outPoint: clip.outPoint.seconds,

            // Project item info
            mediaPath: projectItem.getMediaPath(),
            projectItemType: projectItem.type,

            // Clip state
            disabled: clip.disabled,
            speed: clip.getSpeed(),
            isSpeedReversed: clip.isSpeedReversed(),
            colorSpace: clip.getColorSpace(),

            // Additional properties
            isAdjustmentLayer: clip.isAdjustmentLayer(),
            mediaType: clip.mediaType,
            nodeId: clip.nodeId
        };

        // Try to get XMP metadata
        try {
            const xmpMetadata = projectItem.getXMPMetadata();
            if (xmpMetadata) {
                metadata.xmpMetadata = xmpMetadata;
            }
        } catch (xmpErr) {
            // XMP metadata not available
        }

        // Try to get project metadata
        try {
            const projectMetadata = projectItem.getProjectMetadata();
            if (projectMetadata) {
                metadata.projectMetadata = projectMetadata;
            }
        } catch (projErr) {
            // Project metadata not available
        }

        return {
            success: true,
            trackType: trackType,
            trackIndex: trackIndex,
            clipIndex: clipIndex,
            metadata: metadata
        };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

// ================================
// ADVANCED CLIP OPERATIONS
// ================================

/**
 * Create subclip from existing clip
 */
export const createSubclipFromClip = (
    trackIndex: number,
    clipIndex: number,
    subclipName: string,
    startTime: number,
    endTime: number,
    hasHardBoundaries: boolean = true,
    takeVideo: boolean = true,
    takeAudio: boolean = true,
    trackType: 'video' | 'audio' = 'video'
) => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        let track;
        if (trackType === 'video') {
            track = seq.videoTracks[trackIndex];
        } else {
            track = seq.audioTracks[trackIndex];
        }

        const clip = track.clips[clipIndex];
        const projectItem = clip.projectItem;

        // Create time objects
        const startTimeObj = new Time();
        startTimeObj.seconds = startTime;
        const endTimeObj = new Time();
        endTimeObj.seconds = endTime;

        const subclip = projectItem.createSubClip(
            subclipName,
            startTimeObj,
            endTimeObj,
            hasHardBoundaries ? 1 : 0,
            takeVideo ? 1 : 0,
            takeAudio ? 1 : 0
        );

        return {
            success: true,
            subclipName: subclipName,
            startTime: startTime,
            endTime: endTime,
            duration: endTime - startTime,
            subclip: {
                name: subclip.name,
                mediaPath: subclip.getMediaPath()
            },
            message: "Subclip created successfully"
        };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

/**
 * Check if clip is multicam
 */
export const isMulticamClip = (trackIndex: number, clipIndex: number, trackType: 'video' | 'audio' = 'video') => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        let track;
        if (trackType === 'video') {
            track = seq.videoTracks[trackIndex];
        } else {
            track = seq.audioTracks[trackIndex];
        }

        const clip = track.clips[clipIndex];
        const isMulticam = clip.projectItem.isMultiCamClip();

        return {
            success: true,
            trackType: trackType,
            trackIndex: trackIndex,
            clipIndex: clipIndex,
            isMulticam: isMulticam
        };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

/**
 * Check if clip is merged
 */
export const isMergedClip = (trackIndex: number, clipIndex: number, trackType: 'video' | 'audio' = 'video') => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        let track;
        if (trackType === 'video') {
            track = seq.videoTracks[trackIndex];
        } else {
            track = seq.audioTracks[trackIndex];
        }

        const clip = track.clips[clipIndex];
        const isMerged = clip.projectItem.isMergedClip();

        return {
            success: true,
            trackType: trackType,
            trackIndex: trackIndex,
            clipIndex: clipIndex,
            isMerged: isMerged
        };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

/**
 * Get all clips on a track
 */
export const getAllClipsOnTrack = (trackIndex: number, trackType: 'video' | 'audio' = 'video') => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        let track;
        if (trackType === 'video') {
            if (trackIndex >= seq.videoTracks.numTracks) {
                return { success: false, error: `Video track ${trackIndex} does not exist` };
            }
            track = seq.videoTracks[trackIndex];
        } else {
            if (trackIndex >= seq.audioTracks.numTracks) {
                return { success: false, error: `Audio track ${trackIndex} does not exist` };
            }
            track = seq.audioTracks[trackIndex];
        }

        const clips = [];
        for (let i = 0; i < track.clips.numItems; i++) {
            const clip = track.clips[i];
            clips.push({
                index: i,
                name: clip.name,
                start: clip.start.seconds,
                end: clip.end.seconds,
                duration: clip.duration.seconds,
                inPoint: clip.inPoint.seconds,
                outPoint: clip.outPoint.seconds,
                disabled: clip.disabled,
                speed: clip.getSpeed(),
                mediaType: clip.mediaType,
                nodeId: clip.nodeId
            });
        }

        return {
            success: true,
            trackType: trackType,
            trackIndex: trackIndex,
            clipCount: clips.length,
            clips: clips
        };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

// ================================
// UTILITY FUNCTIONS
// ================================

/**
 * Find clip by name on track
 */
export const findClipByName = (trackIndex: number, clipName: string, trackType: 'video' | 'audio' = 'video') => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        let track;
        if (trackType === 'video') {
            track = seq.videoTracks[trackIndex];
        } else {
            track = seq.audioTracks[trackIndex];
        }

        for (let i = 0; i < track.clips.numItems; i++) {
            const clip = track.clips[i];
            if (clip.name === clipName) {
                return {
                    success: true,
                    trackType: trackType,
                    trackIndex: trackIndex,
                    clipIndex: i,
                    clip: {
                        name: clip.name,
                        start: clip.start.seconds,
                        end: clip.end.seconds,
                        duration: clip.duration.seconds
                    }
                };
            }
        }

        return { success: false, error: `Clip '${clipName}' not found on track ${trackIndex}` };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

/**
 * Get clip at specific time
 */
export const getClipAtTime = (trackIndex: number, timeInSeconds: number, trackType: 'video' | 'audio' = 'video') => {
    try {
        const seq = getActiveSeq();
        if (!seq) {
            return { success: false, error: "No active sequence" };
        }

        let track;
        if (trackType === 'video') {
            track = seq.videoTracks[trackIndex];
        } else {
            track = seq.audioTracks[trackIndex];
        }

        for (let i = 0; i < track.clips.numItems; i++) {
            const clip = track.clips[i];
            if (clip.start.seconds <= timeInSeconds && clip.end.seconds > timeInSeconds) {
                return {
                    success: true,
                    trackType: trackType,
                    trackIndex: trackIndex,
                    clipIndex: i,
                    timeInSeconds: timeInSeconds,
                    clip: {
                        name: clip.name,
                        start: clip.start.seconds,
                        end: clip.end.seconds,
                        duration: clip.duration.seconds
                    }
                };
            }
        }

        return { success: false, error: `No clip found at time ${timeInSeconds} on track ${trackIndex}` };

    } catch (err: any) {
        return { success: false, error: String(err.message || err) };
    }
};

/**
 * Helper function to calculate cut positions based on clip start time
 * @param clipStartTime - The start time of the selected clip in seconds
 * @param clipDuration - The duration of the clip in seconds
 * @param cutInterval - Interval between cuts in seconds (default: 1 second)
 * @param numberOfCuts - Number of cuts to create (default: 3)
 * @returns Array of Time objects representing cut positions
 */
function calculateCutPositionsFromClipStart(
    clipStartTime: number, 
    clipDuration: number, 
    cutInterval: number[], 
): any[] {
    var cutPositions: any[] = [];

    let newTime = clipStartTime
    // Calculate subsequent cuts
    for (var i = 0; i < cutInterval.length; i++) {
        var cutTime = new Time();
        cutTime.seconds = newTime + cutInterval[i];

        if (cutTime.seconds < clipStartTime + clipDuration) {
            cutPositions.push(cutTime);
            newTime = cutTime.seconds;
        }
    }
    
    return cutPositions;
}

export function main(cutInterval: number[]): void {
    var activeSequence = app.project.activeSequence;
    if (activeSequence) {

        var trackItems = activeSequence.getSelection();

        if (trackItems.length > 0) {
            var mediaType = 'Video';
            var tracks = (mediaType == 'Video') ? activeSequence.videoTracks : activeSequence.audioTracks;               
            for (var i = 0; i < trackItems.length; i++) {
                var trackItem = trackItems[i];
                if (trackItem.mediaType != mediaType) {
                    var indexToRemove = -1;
                    for (var findIndex = 0; findIndex < trackItems.length; findIndex++) {
                        if (trackItems[findIndex] === trackItem) {
                            indexToRemove = findIndex;
                            break;
                        }
                    }
                    if (indexToRemove !== -1) {
                        var newTrackItems = [];
                        for (var copyIndex = 0; copyIndex < trackItems.length; copyIndex++) {
                            if (copyIndex !== indexToRemove) {
                                newTrackItems[newTrackItems.length] = trackItems[copyIndex];
                            }
                        }
                        trackItems = newTrackItems;
                        i--;
                    }
                }
            }

            for (var i = 0; i < trackItems.length; i++) {  
                var trackItem = trackItems[i];
                
                for (var j = 0; j < tracks.numTracks; j++) {
                    var track = tracks[j];
                    var clips = track.clips;
                    for (var k = 0; k < clips.numItems; k++) {
                        if (clips[k].name == trackItem.name) {
                            (trackItem as any).track = track;
                        }
                    }
                }
                if ((trackItem as any).track == null) return;
                
                // Calculate clip duration
                var clipDuration = trackItem.end.seconds - trackItem.start.seconds;
                
                // Calculate cut positions based on the provided clip start time
                var cutPositions = calculateCutPositionsFromClipStart(
                    trackItem.start.seconds, 
                    clipDuration, 
                    cutInterval,
                );
                
                (trackItem as any).sequencePlayheadPosition = activeSequence.getPlayerPosition();
                (trackItem as any).playheadPosition = new Time();
                (trackItem as any).playheadPosition.seconds = (trackItem as any).sequencePlayheadPosition.seconds - trackItem.start.seconds + trackItem.inPoint.seconds;

                if (cutPositions && cutPositions.length > 0) {
                    cutFromTimeArray(trackItem, cutPositions);
                } else {
                    cutFromPlayhead(trackItem);
                }
                var itemsToDeselect = activeSequence.getSelection();
                for (var deselectIndex = 0; deselectIndex < itemsToDeselect.length; deselectIndex++) {
                    itemsToDeselect[deselectIndex].setSelected(false, true);
                }
            }
        }
    } 
}

function cutFromPlayhead(trackItem: any): void {
    var projectItem = trackItem.projectItem;
    projectItem.setInPoint(trackItem.inPoint.ticks, 4);
    projectItem.setOutPoint(trackItem.playheadPosition.ticks, 4);
    trackItem.track.overwriteClip(projectItem, trackItem.start.ticks);
}

function cutFromTimeArray(trackItem: any, cutPositions: any): void {
    var projectItem = trackItem.projectItem;
    
    for (var cut = 0; cut < cutPositions.length; cut++) {
        var cutPosition = cutPositions[cut];
        app.project.activeSequence.setPlayerPosition(cutPosition.ticks);
        
        if (cutPosition.seconds <= trackItem.start.seconds || cutPosition.seconds >= trackItem.end.seconds) {
            continue;
        } else {
            // get track item time of the cut position in the sequence
            var playheadPosition = new Time();
            playheadPosition.seconds = cutPosition.seconds - trackItem.start.seconds + trackItem.inPoint.seconds;

            projectItem.setInPoint(trackItem.inPoint.ticks, 4);
            projectItem.setOutPoint(playheadPosition.ticks, 4);
            trackItem.track.overwriteClip(projectItem, trackItem.start.ticks)
        }
    }
}