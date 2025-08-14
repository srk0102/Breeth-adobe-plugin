export const getSelectedClips = () => {
    try {
        if (app.project.activeSequence) {
            var sequence = app.project.activeSequence;
            var selectedClips = [];
            var videoTracks = sequence.videoTracks;
            var audioTracks = sequence.audioTracks;
            var maxTracks = Math.max(videoTracks.numTracks, audioTracks.numTracks);
            
            // Single loop to process both video and audio tracks
            for (var i = 0; i < maxTracks; i++) {
                // Process video track if it exists
                if (i < videoTracks.numTracks) {
                    var videoTrack = videoTracks[i];
                    for (var j = 0; j < videoTrack.clips.numItems; j++) {
                        var videoClip = videoTrack.clips[j];
                        if (videoClip.isSelected()) {
                            selectedClips[selectedClips.length] = {
                                name: videoClip.name,
                                type: "video",
                                timelineInpoint: videoClip.start.seconds,
                                timelineoutPoint: videoClip.end.seconds,
                                assetInpoint: videoClip.inPoint.seconds,
                                assetOutpoint: videoClip.outPoint.seconds,
                                assetDuration: videoClip.duration.seconds,
                                filePath: videoClip.projectItem.getMediaPath(),
                                trackIndex: i
                            };
                        }
                    }
                }
                
                // Process audio track if it exists
                if (i < audioTracks.numTracks) {
                    var audioTrack = audioTracks[i];
                    for (var k = 0; k < audioTrack.clips.numItems; k++) {
                        var audioClip = audioTrack.clips[k];
                        if (audioClip.isSelected()) {
                            selectedClips[selectedClips.length] = {
                                name: audioClip.name,
                                type: "audio",
                                timelineInpoint: audioClip.start.seconds,
                                timelineoutPoint: audioClip.end.seconds,
                                assetInpoint: audioClip.inPoint.seconds,
                                assetOutpoint: audioClip.outPoint.seconds,
                                assetDuration: audioClip.duration.seconds,
                                filePath: audioClip.projectItem.getMediaPath(),
                                trackIndex: i
                            };
                        }
                    }
                }
            }

            return selectedClips;
        } else {
            return [];
        }
    } catch (e:any) {
        alert("Error getting selected clips: " + String(e.message || e));
        return [];
    }
}

export const getProjectDirectory = () => {
    if (app.project && app.project.path) {
        var fullPath = app.project.path;

        // Replace backslashes with forward slashes to standardize
        fullPath = fullPath.replace(/\\/g, "/");

        // Find last slash to extract directory path
        var lastSlashIndex = fullPath.lastIndexOf("/");

        if (lastSlashIndex === -1) {
            // Something is wrong if no slash is found
            return "";
        }

        // Extract directory (excluding filename)
        var projectDir = fullPath.substring(0, lastSlashIndex);

        return projectDir;
    }

    return "";
}

export const readFile = (filePath: string) => {
    try {
        var file = new File(filePath);
        if (file.exists) {
            file.open('r');
            var content = file.read();
            file.close();
            return content
        } else {
            alert('File not found.');
        }
    } catch (e: any) {
        alert(JSON.stringify({ error: e.message }));
    }
}

export const importAndSetFile = (filePath: string) => {
    try {
        var project = app.project;
        var activeSequence = project.activeSequence;

        if (!activeSequence) {
            alert("No active sequence found!");
            return;
        }
        var importFile = new File(filePath);
        var importResult = project.importFiles([importFile.fsName], false, project.rootItem, false);

        if (!importResult) {
            alert("File import failed!");
            return;
        }

        var importedItem = project.rootItem.children[project.rootItem.children.numItems - 1];

        var videoTrack = activeSequence.videoTracks[0];
        var playheadTime = activeSequence.getPlayerPosition();

        if (videoTrack) {
            videoTrack.insertClip(importedItem, playheadTime.seconds);
            alert("File added to timeline successfully!");
        } else {
            alert("No available video track found.");
        }
    }
    catch (e: any) {
        alert(JSON.stringify({ error: e.message }));
    }
}

export const importFileIntoProject = (filePath: string) => {
    try {
        if (!filePath) {
            return "Invalid file path";
        }
        var file = new File(filePath);
        if (!file.exists) {
            return `File does not exist: ${filePath}`;
        }
        if (!app.project) {
            return "No project available";
        }

        var importResult = app.project.importFiles([filePath], true, app.project.rootItem, false);

        if (importResult === true) {
            return `File imported successfully: ${filePath}`;
        } else {
            return `Failed to import file: ${filePath} (importResult: ${importResult})`;
        }
    } catch (error: any) {
        return `Error importing file: ${String(error.message)}`;
    }
}