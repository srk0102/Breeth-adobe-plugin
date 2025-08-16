export const setMarker = (start: number, name: string, duration: number, comments: string) => {
    try{
        app.project.activeSequence.markers.createMarker(start, name, duration, comments);
    }catch(err:any){
        alert("Error setting marker: " + String(err.message || err));
    }
}

export const getMarkers = () => {
    try{
        var markers = app.project.activeSequence.markers;
        return markers;
    }catch(err:any){
        alert("Error getting markers: " + String(err.message || err));
    }
}

export const deleteMarker = (markerIndex: number) => {
    try {
        if (!app.project.activeSequence) {
            throw new Error("No active sequence");
        }
        const markers = app.project.activeSequence.markers;
        if (!markers || markerIndex >= markers.numMarkers) {
            throw new Error("Invalid marker index");
        }
        const marker = markers[markerIndex];
        if (!marker) {
            throw new Error("Marker not found at index " + markerIndex);
        }
        markers.deleteMarker(marker);
        return "Marker deleted successfully";
    } catch (err: any) {
        alert("Error deleting marker: " + String(err.message || err));
    }
}

export const updateMarker = (markerIndex: number, name: string, start: Time, end: Time, comments: string) => {
    try{
        const markers = app.project.activeSequence.markers;
        if (!markers || markerIndex >= markers.numMarkers) {
            throw new Error("Invalid marker index");
        }
        const marker = markers[markerIndex];
        if (!marker) {
            throw new Error("Marker not found at index " + markerIndex);
        }
        marker.name = name;
        marker.start = start;
        marker.end = end;
        comments && (marker.comments = comments);
    }catch(err:any){
        alert("Error updating marker: " + String(err.message || err));
    }
}