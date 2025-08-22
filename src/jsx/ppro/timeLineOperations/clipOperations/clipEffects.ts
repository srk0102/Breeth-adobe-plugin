import { TrackType } from '../types';

/**
 * Gets all components (effects) on a clip
 */
export const getClipComponents = (trackType: TrackType, trackId: number, clipId: number) => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }

        const tracks = trackType === 'audio' ?
            app.project.activeSequence.audioTracks :
            app.project.activeSequence.videoTracks;

        const clip = tracks[trackId].clips[clipId];
        return clip.components || null;
    } catch (err: any) {
        alert("Error getting clip components: " + String(err.message || err));
        return null;
    }
};

/**
 * Gets all properties of a clip's component (effect)
 */
export const getComponentProperties = (trackType: TrackType, trackId: number, clipId: number, componentName: string) => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }

        const tracks = trackType === 'audio' ?
            app.project.activeSequence.audioTracks :
            app.project.activeSequence.videoTracks;

        const clip = tracks[trackId].clips[clipId];
        const component = clip.components.filter((c: Component) => c.displayName === componentName)[0];

        if (!component) {
            throw new Error(`Component '${componentName}' not found`);
        }

        const properties = [];
        for (let i = 0; i < component.properties.numItems; i++) {
            const prop = component.properties[i];
            properties.push({
                name: prop.displayName,
                value: prop.getValue(),
                isTimeVarying: prop.isTimeVarying(),
                supportsKeyframes: prop.areKeyframesSupported()
            });
        }
        return properties;
    } catch (err: any) {
        alert("Error getting component properties: " + String(err.message || err));
        return null;
    }
};

/**
 * Sets a property value on a clip's component (effect)
 */
export const setComponentProperty = (
    trackType: TrackType,
    trackId: number,
    clipId: number,
    componentName: string,
    propertyName: string,
    value: any
) => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }

        const tracks = trackType === 'audio' ?
            app.project.activeSequence.audioTracks :
            app.project.activeSequence.videoTracks;

        const clip = tracks[trackId].clips[clipId];
        const component = clip.components.filter((c: Component) => c.displayName === componentName)[0];

        if (!component) {
            throw new Error(`Component '${componentName}' not found`);
        }

        const property = component.properties.getParamForDisplayName(propertyName);
        if (!property) {
            throw new Error(`Property '${propertyName}' not found`);
        }

        property.setValue(value, true); // true to update UI
        return true;
    } catch (err: any) {
        alert("Error setting component property: " + String(err.message || err));
        return false;
    }
};

// ================================
// CROP OPERATIONS
// ================================

type CropParams = { left?: number; right?: number; top?: number; bottom?: number };

const clamp01 = (v: number) => Math.max(0, Math.min(100, v));
const pct = (v?: number) => (typeof v === 'number' ? clamp01(v) / 100 : 0);

/**
 * Visual crop using Motion (uniform Scale + Position).
 * NOTE: This does not write "Crop %" in Effect Controls; it zooms/reframes to simulate a crop.
 */
export const cropClip = (trackIndex: number, clipIndex: number, p: CropParams) => {
    try {
        const seq = app?.project?.activeSequence as Sequence | undefined;
        if (!seq) return { success: false, error: 'No active sequence' };

        const track = (seq.videoTracks as any)[trackIndex] as Track | undefined;
        if (!track) return { success: false, error: `No video track at ${trackIndex}` };

        const clip = (track.clips as any)[clipIndex] as TrackItem | undefined;
        if (!clip) return { success: false, error: `No clip at ${clipIndex}` };

        const comps = clip.components as ComponentCollection | undefined;
        if (!comps || !comps.length) return { success: false, error: 'No components on clip' };

        // Find Motion
        let motion: Component | null = null;
        for (let i = 0; i < comps.length; i++) {
            const c = comps[i];
            const dn = String(c?.displayName ?? '');
            const mn = String(c?.matchName ?? '');
            if (dn === 'Motion' || mn === 'AE.ADBE Motion') { motion = c; break; }
        }
        if (!motion) return { success: false, error: 'Motion component not found' };

        const props = motion.properties as ComponentParamCollection | undefined;
        if (!props) return { success: false, error: 'Motion properties not available' };

        // Get handles (names are localized-safe enough via displayName in PPro’s DOM)
        const scale = props.getParamForDisplayName('Scale');           // uniform
        const position = props.getParamForDisplayName('Position');     // [x, y]
        if (!scale || !position) {
            return { success: false, error: 'Scale/Position not accessible on Motion' };
        }

        // Current values
        const curScale = Number(scale.getValue() ?? 100) || 100;
        let [posX, posY] = (position.getValue() as any[]) ?? [0, 0];

        // Frame center stays constant; we zoom to hide the cropped edges, then nudge position.
        // Effective visible width/height fractions after crop
        const cropX = 1 - (pct(p.left) + pct(p.right));
        const cropY = 1 - (pct(p.top) + pct(p.bottom));
        if (cropX <= 0 || cropY <= 0) {
            return { success: false, error: 'Crop removes entire frame; aborting' };
        }

        // New scale must fill the most restrictive axis
        // If we remove 20% left+right, cropX=0.8 → need scale = 100/0.8 = 125% to fill.
        const scaleXFill = 100 / cropX;
        const scaleYFill = 100 / cropY;
        const newScale = Math.max(scaleXFill, scaleYFill);

        // Recenter to favor the uncropped side:
        // Compute normalized offset of the remaining window’s center relative to original center.
        // left/right shift: right-lean if we cut more on left, etc.
        const nx = (pct(p.right) - pct(p.left)) / (2 * cropX); // right positive
        const ny = (pct(p.bottom) - pct(p.top)) / (2 * cropY); // down positive

        // Convert normalized offsets to pixel space: Position expects pixel coords
        // We need sequence frame size to translate normalized -> pixels
        const width = seq.frameSizeHorizontal;
        const height = seq.frameSizeVertical;
        if (!width || !height) {
            return { success: false, error: 'Sequence frame size unavailable' };
        }

        // Default PPro origin: center of frame. Position [0,0] means center? (PPro stores pixels; center is [width/2, height/2])
        // For scripting, Position returns [x, y] in pixels relative to top-left or center depending on version.
        // Safe approach: derive current center as-is and add deltas.
        const dx = nx * width;
        const dy = ny * height;

        // Apply
        scale.setValue(newScale, true);
        position.setValue([posX + dx, posY + dy], true);

        return {
            success: true,
            message: 'Visual crop applied via Motion (Scale/Position)',
            applied: { left: p.left, right: p.right, top: p.top, bottom: p.bottom },
            scale: newScale,
            position: [posX + dx, posY + dy],
        };
    } catch (e: any) {
        return { success: false, error: String(e?.message || e) };
    }
};


/**
 * Get available effects on a clip
 */
export const getAvailableEffects = (
    trackIndex: number,
    clipIndex: number,
    trackType: 'video' | 'audio' = 'video'
) => {
    try {
        if (!app.project.activeSequence) {
            return { success: false, error: "No active sequence" };
        }

        const tracks = trackType === 'video' ?
            app.project.activeSequence.videoTracks :
            app.project.activeSequence.audioTracks;

        const clip = tracks[trackIndex].clips[clipIndex];
        if (!clip) {
            return { success: false, error: `Clip ${clipIndex} does not exist on track ${trackIndex}` };
        }

        const effects = [];
        for (let i = 0; i < clip.components.numItems; i++) {
            const component = clip.components[i];
            effects.push({
                index: i,
                displayName: component.displayName,
                matchName: component.matchName,
                type: component.displayName
            });
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

// ==============================
// TypeScript (target: ES3)
// Reframe to 3×3 anchor (pixels OR normalized Position)
// ==============================

type Anchor9 =
    | 'top-left' | 'top-center' | 'top-right'
    | 'center-left' | 'center' | 'center-right'
    | 'bottom-left' | 'bottom-center' | 'bottom-right';

interface ReframeOpts {
    anchor?: Anchor9;      // default: 'center'
    xBiasPct?: number;     // % of safe X range (−100..+100)
    yBiasPct?: number;     // % of safe Y range (−100..+100)
    ensureCover?: boolean; // auto-zoom to fill seq if smaller (default: true)
    clampToFill?: boolean; // prevent edges (default: true)
}

interface ReframeResult {
    success: boolean;
    error?: string;
    message?: string;
    sequence?: { width: number; height: number };
    source?: { width: number; height: number; detected: boolean };
    scalePct?: number;
    positionMode?: 'pixels' | 'normalized';
    maxSafePanPx?: { x: number; y: number };
    maxSafePanNorm?: { x: number; y: number };
    positionBefore?: [number, number];
    positionAfter?: [number, number];
    anchor?: Anchor9;
    biasPct?: { x: number; y: number };
    ensuredCover?: boolean;
}

export function reframeToAnchor9(
    videoTrackIndex: number,
    clipIndex: number,
    opts?: ReframeOpts
): ReframeResult {
    var options: ReframeOpts = opts || {};
    var anchor: Anchor9 = (options.anchor || 'center');
    var xBiasPct: number = (typeof options.xBiasPct === 'number') ? options.xBiasPct as number : 0;
    var yBiasPct: number = (typeof options.yBiasPct === 'number') ? options.yBiasPct as number : 0;
    var ensureCover: boolean = (typeof options.ensureCover === 'boolean') ? options.ensureCover as boolean : true;
    var clampToFill: boolean = (typeof options.clampToFill === 'boolean') ? options.clampToFill as boolean : true;

    try {
        var seq: Sequence = app.project.activeSequence;
        if (!seq) return { success: false, error: 'No active sequence' };

        var settings: SequenceSettings = (seq.getSettings && seq.getSettings()) as any;
        var SEQ_W: number = Number(settings && settings.videoFrameWidth) || Number((seq as any).frameSizeHorizontal) || 0;
        var SEQ_H: number = Number(settings && settings.videoFrameHeight) || Number((seq as any).frameSizeVertical) || 0;
        if (!SEQ_W || !SEQ_H) return { success: false, error: 'Sequence frame size unavailable' };

        var track: Track = (seq.videoTracks as any)[videoTrackIndex];
        if (!track) return { success: false, error: 'No video track at ' + videoTrackIndex };

        var clips: TrackItemCollection = track.clips;
        if (!clips || !clips.numItems) return { success: false, error: 'No clips on track' };

        var clip: TrackItem = clips[clipIndex];
        if (!clip) return { success: false, error: 'No clip at ' + clipIndex };

        var comps: ComponentCollection = clip.components as any;
        if (!comps || !comps.numItems) return { success: false, error: 'No components on clip' };

        var motion: Component = null as any;
        var i: number;
        for (i = 0; i < comps.numItems; i++) {
            var c: Component = comps[i];
            var dn: string = String((c as any).displayName || '');
            var mn: string = String((c as any).matchName || '');
            if (dn === 'Motion' || mn === 'AE.ADBE Motion') { motion = c; break; }
        }
        if (!motion) return { success: false, error: 'Motion component not found' };

        var props: ComponentParamCollection = motion.properties;
        if (!props) return { success: false, error: 'Motion properties not available' };

        var scale: ComponentParam = props.getParamForDisplayName('Scale') as any;
        var position: ComponentParam = props.getParamForDisplayName('Position') as any;
        if (!scale || !position) return { success: false, error: 'Scale/Position not accessible' };

        var S: number = Number(scale.getValue()) || 100; // %
        var posVal: any = position.getValue();
        var posX0: number = SEQ_W / 2, posY0: number = SEQ_H / 2;
        if (posVal && posVal.length >= 2) { posX0 = Number(posVal[0]); posY0 = Number(posVal[1]); }

        var mode: 'pixels' | 'normalized' = 'pixels';
        if (posX0 >= -0.5 && posX0 <= 1.5 && posY0 >= -0.5 && posY0 <= 1.5) {
            mode = 'normalized';
        }

        var SRC_W: number = SEQ_W, SRC_H: number = SEQ_H, srcDetected: boolean = false;
        var pi: ProjectItem = clip.projectItem;
        var md: string = (pi && (pi as any).getProjectMetadata && (pi as any).getProjectMetadata()) || '';
        var dims = _tryParseDimsFromMetadata(md);
        if (!dims) {
            var nm: string = String(pi && pi.name || '');
            dims = _tryParseDimsFromName(nm);
        }
        if (dims) { SRC_W = dims.w; SRC_H = dims.h; srcDetected = true; }

        if (ensureCover && SRC_W && SRC_H) {
            var coverPct: number = Math.max(SEQ_W / SRC_W, SEQ_H / SRC_H) * 100;
            if (S < coverPct) { scale.setValue(coverPct, true); S = coverPct; }
        }

        var dispW: number = (S / 100) * SRC_W;
        var dispH: number = (S / 100) * SRC_H;

        var maxPanX: number = Math.max(0, (dispW - SEQ_W) / 2);
        var maxPanY: number = Math.max(0, (dispH - SEQ_H) / 2);

        var base = _anchorDelta(anchor, maxPanX, maxPanY);

        var bx: number = (xBiasPct / 100) * maxPanX;
        var by: number = (yBiasPct / 100) * maxPanY;

        var dx_px: number = base.dx + bx;
        var dy_px: number = base.dy + by;

        if (clampToFill) {
            if (dx_px < -maxPanX) dx_px = -maxPanX;
            if (dx_px > maxPanX) dx_px = maxPanX;
            if (dy_px < -maxPanY) dy_px = -maxPanY;
            if (dy_px > maxPanY) dy_px = maxPanY;
        }

        var newPos: [number, number];

        if (mode === 'pixels') {
            // center in pixels
            var cx: number = SEQ_W / 2;
            var cy: number = SEQ_H / 2;
            newPos = [cx + dx_px, cy + dy_px];
        } else {
            var dx_n: number = (SEQ_W > 0) ? (dx_px / SEQ_W) : 0;
            var dy_n: number = (SEQ_H > 0) ? (dy_px / SEQ_H) : 0;
            var nx: number = 0.5 + dx_n;
            var ny: number = 0.5 + dy_n;

            if (clampToFill) {
                if (nx < 0) nx = 0;
                if (nx > 1) nx = 1;
                if (ny < 0) ny = 0;
                if (ny > 1) ny = 1;
            }
            newPos = [nx, ny];
        }

        position.setValue(newPos as any, true);

        var maxPanNormX: number = (SEQ_W > 0) ? (maxPanX / SEQ_W) : 0;
        var maxPanNormY: number = (SEQ_H > 0) ? (maxPanY / SEQ_H) : 0;

        return {
            success: true,
            message: 'Reframed to 3×3 anchor with correct Position space',
            sequence: { width: SEQ_W, height: SEQ_H },
            source: { width: SRC_W, height: SRC_H, detected: srcDetected },
            scalePct: S,
            positionMode: mode,
            maxSafePanPx: { x: maxPanX, y: maxPanY },
            maxSafePanNorm: { x: maxPanNormX, y: maxPanNormY },
            positionBefore: [posX0, posY0],
            positionAfter: newPos,
            anchor: anchor,
            biasPct: { x: xBiasPct, y: yBiasPct },
            ensuredCover: ensureCover
        };

    } catch (e: any) {
        return { success: false, error: String(e && e.message || e) };
    }
}

/* -------------- helpers (ES3-friendly) -------------- */

function _anchorDelta(anchor: Anchor9, maxX: number, maxY: number): { dx: number; dy: number } {
    var dx = 0, dy = 0;
    switch (anchor) {
        case 'top-left': dx = -maxX; dy = -maxY; break;
        case 'top-center': dx = 0; dy = -maxY; break;
        case 'top-right': dx = maxX; dy = -maxY; break;

        case 'center-left': dx = -maxX; dy = 0; break;
        case 'center': dx = 0; dy = 0; break;
        case 'center-right': dx = maxX; dy = 0; break;

        case 'bottom-left': dx = -maxX; dy = maxY; break;
        case 'bottom-center': dx = 0; dy = maxY; break;
        case 'bottom-right': dx = maxX; dy = maxY; break;
    }
    return { dx: dx, dy: dy };
}

function _tryParseDimsFromMetadata(md: string): { w: number; h: number } | null {
    if (!md) return null;
    var m: RegExpExecArray | null = /(\d{3,5})\s*[x×]\s*(\d{3,5})/i.exec(md);
    if (m) return { w: Number(m[1]), h: Number(m[2]) };
    var wKey: RegExpExecArray | null = /FrameWidth["']?\s*[:=]\s*["']?(\d+)/i.exec(md);
    var hKey: RegExpExecArray | null = /FrameHeight["']?\s*[:=]\s*["']?(\d+)/i.exec(md);
    if (wKey && hKey) return { w: Number(wKey[1]), h: Number(hKey[1]) };
    var mw: RegExpExecArray | null = /MediaWidth["']?\s*[:=]\s*["']?(\d+)/i.exec(md);
    var mh: RegExpExecArray | null = /MediaHeight["']?\s*[:=]\s*["']?(\d+)/i.exec(md);
    if (mw && mh) return { w: Number(mw[1]), h: Number(mh[1]) };
    return null;
}

function _tryParseDimsFromName(name: string): { w: number; h: number } | null {
    if (!name) return null;
    var m: RegExpExecArray | null = /(\d{3,5})\s*[x×]\s*(\d{3,5})/i.exec(name);
    if (m) return { w: Number(m[1]), h: Number(m[2]) };
    return null;
}
