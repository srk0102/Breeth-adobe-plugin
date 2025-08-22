/**
 * Gets all properties of a Motion Graphics Template (MOGRT) clip
 */
export const getMOGRTProperties = (trackId: number, clipId: number) => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }
        const clip = app.project.activeSequence.videoTracks[trackId].clips[clipId];
        if (!clip) {
            throw new Error("Clip not found");
        }
        
        const mgtComponent = clip.getMGTComponent();
        if (!mgtComponent) {
            return null;
        }

        return {
            name: mgtComponent.displayName,
            matchName: mgtComponent.matchName,
            properties: mgtComponent.properties
        };
    } catch (err: any) {
        alert("Error getting MOGRT properties: " + String(err.message || err));
        return null;
    }
}

/**
 * Updates a text parameter in a MOGRT clip
 */
export const updateMOGRTText = (trackId: number, clipId: number, paramName: string, newText: string) => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }
        const clip = app.project.activeSequence.videoTracks[trackId].clips[clipId];
        if (!clip) {
            throw new Error("Clip not found");
        }

        const mgtComponent = clip.getMGTComponent();
        if (!mgtComponent) {
            throw new Error("Not a MOGRT clip");
        }

        const textParam = mgtComponent.properties.getParamForDisplayName(paramName);
        if (!textParam) {
            throw new Error(`Text parameter '${paramName}' not found`);
        }

        textParam.setValue(newText, true); // true to update UI
        return true;
    } catch (err: any) {
        alert("Error updating MOGRT text: " + String(err.message || err));
        return false;
    }
}

/**
 * Updates a color parameter in a MOGRT clip
 * @param color Array of [red, green, blue, alpha] values (0-255)
 */
export const updateMOGRTColor = (trackId: number, clipId: number, paramName: string, color: [number, number, number, number]) => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }
        const clip = app.project.activeSequence.videoTracks[trackId].clips[clipId];
        if (!clip) {
            throw new Error("Clip not found");
        }

        const mgtComponent = clip.getMGTComponent();
        if (!mgtComponent) {
            throw new Error("Not a MOGRT clip");
        }

        const colorParam = mgtComponent.properties.getParamForDisplayName(paramName);
        if (!colorParam) {
            throw new Error(`Color parameter '${paramName}' not found`);
        }

        colorParam.setColorValue(...color, true); // spread the array and add true to update UI
        return true;
    } catch (err: any) {
        alert("Error updating MOGRT color: " + String(err.message || err));
        return false;
    }
}

/**
 * Imports a MOGRT file into the sequence
 */
export const importMOGRT = (pathToMOGRT: string, timeInSeconds: number, videoTrackOffset: number = 0) => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }

        // Convert seconds to ticks (Premiere's time format)
        const time = new Time();
        time.seconds = timeInSeconds;
        
        const result = app.project.activeSequence.importMGT(
            pathToMOGRT,
            time.ticks,
            videoTrackOffset,
            0 // audioTrackOffset (0 since MOGRTs typically don't have audio)
        );

        return result;
    } catch (err: any) {
        alert("Error importing MOGRT: " + String(err.message || err));
        return null;
    }
}

/**
 * Lists all parameters available in a MOGRT clip
 */
export const listMOGRTParameters = (trackId: number, clipId: number) => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }
        const clip = app.project.activeSequence.videoTracks[trackId].clips[clipId];
        if (!clip) {
            throw new Error("Clip not found");
        }

        const mgtComponent = clip.getMGTComponent();
        if (!mgtComponent) {
            throw new Error("Not a MOGRT clip");
        }

        const params = [];
        const properties = mgtComponent.properties;
        
        for (let i = 0; i < properties.numItems; i++) {
            const param = properties[i];
            params.push({
                name: param.displayName,
                value: param.getValue(),
                isTimeVarying: param.isTimeVarying(),
                supportsKeyframes: param.areKeyframesSupported()
            });
        }

        return params;
    } catch (err: any) {
        alert("Error listing MOGRT parameters: " + String(err.message || err));
        return null;
    }
}

/**
 * Adds a keyframe to a MOGRT parameter
 */
export const addMOGRTKeyframe = (trackId: number, clipId: number, paramName: string, timeInSeconds: number, value: any) => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }
        const clip = app.project.activeSequence.videoTracks[trackId].clips[clipId];
        if (!clip) {
            throw new Error("Clip not found");
        }

        const mgtComponent = clip.getMGTComponent();
        if (!mgtComponent) {
            throw new Error("Not a MOGRT clip");
        }

        const param = mgtComponent.properties.getParamForDisplayName(paramName);
        if (!param) {
            throw new Error(`Parameter '${paramName}' not found`);
        }

        if (!param.areKeyframesSupported()) {
            throw new Error(`Parameter '${paramName}' does not support keyframes`);
        }

        // Convert seconds to time object
        const time = new Time();
        time.seconds = timeInSeconds;

        // Enable time-varying if not already enabled
        if (!param.isTimeVarying()) {
            param.setTimeVarying(true);
        }

        param.setValueAtKey(time, value, true); // true to update UI
        return true;
    } catch (err: any) {
        alert("Error adding MOGRT keyframe: " + String(err.message || err));
        return false;
    }
}
