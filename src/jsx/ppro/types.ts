export type TrackType = 'video' | 'audio' | 'all';

export interface TimelineClip {
    name: string;
    type: 'video' | 'audio';
    start: number;
    end: number;
    inPoint: number;
    outPoint: number;
    duration: number;
    trackIndex: number;
    mediaPath?: string;
    isEnabled: boolean;
    isSelected: boolean;
    isAdjustmentLayer?: boolean;
    speed: number;
    isSpeedReversed: boolean;
    components: TimelineComponent[];
    linkedItems: any[];
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

export interface TimelineTrack {
    type: 'video' | 'audio';
    index: number;
    name: string;
    isMuted: boolean;
    isLocked: boolean;
    clips: TimelineClip[];
    transitions: any[];
}

export interface TimelineMap {
    duration: number;
    videoTracks: TimelineTrack[];
    audioTracks: TimelineTrack[];
    frameRate: number;
    resolution: {
        width: number;
        height: number;
    };
}
