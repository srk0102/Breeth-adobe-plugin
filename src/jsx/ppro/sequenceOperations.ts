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