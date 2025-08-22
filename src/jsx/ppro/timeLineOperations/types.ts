// =============================================================================
// TIMELINE TYPES - Production Grade Type Definitions
// =============================================================================

export type TrackType = 'video' | 'audio' | 'all';

export type MediaType = 'video' | 'audio';

export type ClipType = 'clip' | 'adjustment' | 'title' | 'color' | 'black';

// =============================================================================
// CORE TIMELINE INTERFACES
// =============================================================================

export interface TimelinePosition {
    seconds: number;
    ticks: number;
}

export interface TimelineClipData {
    name: string;
    type: MediaType;
    trackIndex: number;
    clipIndex: number;
    nodeId: string;
    mediaType: string;
    clipType: ClipType;
    disabled: boolean;
    
    // Timing
    start: number;
    end: number;
    duration: number;
    inPoint: number;
    outPoint: number;
    
    // Timeline specific
    timelineInpoint: number;
    timelineOutPoint: number;
    assetInpoint: number;
    assetOutpoint: number;
    assetDuration: number;
    
    // Media
    filePath?: string;
    mediaPath?: string;
    
    // Properties
    speed?: number;
    isSelected?: boolean;
    isSpeedReversed?: boolean;
    isAdjustmentLayer?: boolean;
    
    // Effects and Components
    components?: any[];
    effects?: EffectData[];
    linkedItems?: any[];
}

export interface EffectData {
    name: string;
    matchName: string;
    properties: EffectProperty[];
}

export interface EffectProperty {
    name: string;
    value: any;
    isKeyframed: boolean;
    isTimeVarying?: boolean;
    supportsKeyframes?: boolean;
}

export interface TrackData {
    name: string;
    type: MediaType;
    index: number;
    isMuted: boolean;
    isLocked: boolean;
    isEmpty: boolean;
    clipCount: number;
    clips: TimelineClipData[];
}

export interface SequenceData {
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
    videoTracks: TrackData[];
    audioTracks: TrackData[];
    markers: MarkerData[];
}

export interface MarkerData {
    name: string;
    time: number;
    duration: number;
    comments: string;
}

// =============================================================================
// UTILITY INTERFACES
// =============================================================================

export interface TrackCounts {
    video: number;
    audio: number;
    total: number;
}

export interface ClipSearchOptions {
    trackType?: TrackType;
    trackIndex?: number;
    clipIndex?: number;
    clipName?: string;
    effectName?: string;
}

export interface ClipOperationOptions {
    rippleEdit?: boolean;
    alignToVideo?: boolean;
    updateUI?: boolean;
}

export interface SelectedClipData {
    name: string;
    type: MediaType;
    trackIndex: number;
    clipIndex: number;
    start: number;
    end: number;
    filePath?: string;
}

// =============================================================================
// COMPONENT AND EFFECT INTERFACES
// =============================================================================

export interface ComponentData {
    name: string;
    matchName: string;
    displayName: string;
    properties: ComponentProperty[];
}

export interface ComponentProperty {
    name: string;
    displayName: string;
    value: any;
    isTimeVarying: boolean;
    areKeyframesSupported: boolean;
}

export interface TimelineComponent {
    name: string;
    matchName: string;
    properties: TimelineComponentProperty[];
}

export interface TimelineComponentProperty {
    name: string;
    value: any;
    isKeyframed: boolean;
}

// =============================================================================
// OPERATION RESULT INTERFACES
// =============================================================================

export interface OperationResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

// =============================================================================
// TIMELINE INFO INTERFACES (Legacy compatibility)
// =============================================================================

export interface TimelineTrack {
    name: string;
    type: 'video' | 'audio';
    index: number;
    isMuted: boolean;
    isLocked: boolean;
    clips: TimelineClip[];
}

export interface TimelineClip {
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
    audioPath?: string;
    videoPath?: string;
    effects: {
        name: string;
        properties: {
            name: string;
            value: any;
        }[];
    }[];
}

export interface TimelineInfo {
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

export interface TimelineMap {
    sequence: SequenceData;
    videoTracks: TrackData[];
    audioTracks: TrackData[];
    totalClips: number;
    totalDuration: number;
}
