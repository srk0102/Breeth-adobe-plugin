import { TrackType } from './types';

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