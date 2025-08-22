interface FileChangeEvent {
    type: 'add' | 'remove' | 'modify';
    filePath: string;
    timestamp: number;
}

interface ProjectItem {
    name: string;
    type: string;
    path?: string;
    children?: ProjectItem[];
}

// Helper function moved outside to comply with ES5 strict mode
function processProjectItem(item: any): ProjectItem {
    var result: ProjectItem = {
        name: item.name,
        type: item.type === ProjectItemType.BIN ? 'bin' : 'clip'
    };

    if (item.type !== ProjectItemType.BIN) {
        result.path = item.getMediaPath();
    }

    if (item.children && item.children.numItems > 0) {
        result.children = [];
        for (var i = 0; i < item.children.numItems; i++) {
            result.children.push(processProjectItem(item.children[i]));
        }
    }

    return result;
}

/**
 * Gets the complete project tree structure
 */
export const getProjectStructure = (): ProjectItem[] => {
    try {
        if (!app.project) {
            throw new Error("No active project");
        }

        var rootItem = app.project.rootItem;
        if (!rootItem.children || rootItem.children.numItems === 0) {
            return [];
        }

        var items: ProjectItem[] = [];
        for (var i = 0; i < rootItem.children.numItems; i++) {
            items.push(processProjectItem(rootItem.children[i]));
        }
        return items;

    } catch (err: any) {
        alert("Error getting project structure: " + String(err.message || err));
        return [];
    }
};

// Helper function for array comparison
function findItemByName(items: ProjectItem[], name: string): ProjectItem | undefined {
    for (var i = 0; i < items.length; i++) {
        if (items[i].name === name) {
            return items[i];
        }
    }
    return undefined;
}

/**
 * Watch for project item changes using polling
 */
export const watchProjectChanges = (callback: (event: FileChangeEvent) => void) => {
    try {
        if (!app.project) {
            throw new Error("No active project");
        }

        // Store initial state
        var lastState = getProjectStructure();
        var timerId: number | null = null;

        // Check for changes every second
        function checkForChanges(): void {
            var currentState = getProjectStructure();
            
            // Check for added items
            for (var i = 0; i < currentState.length; i++) {
                var item = currentState[i];
                if (!findItemByName(lastState, item.name)) {
                    callback({
                        type: 'add',
                        filePath: item.path || item.name,
                        timestamp: Date.now()
                    });
                }
            }

            // Check for removed items
            for (var i = 0; i < lastState.length; i++) {
                var item = lastState[i];
                if (!findItemByName(currentState, item.name)) {
                    callback({
                        type: 'remove',
                        filePath: item.path || item.name,
                        timestamp: Date.now()
                    });
                }
            }

            lastState = currentState;
        }

        // Start polling
        timerId = window.setInterval(checkForChanges, 1000);

        // Return cleanup function
        return function cleanup(): void {
            if (timerId !== null) {
                window.clearInterval(timerId);
            }
        };
    } catch (err: any) {
        alert("Error watching project changes: " + String(err.message || err));
        return function noop(): void {};
    }
};

interface SelectedClip {
    name: string;
    type: 'video' | 'audio';
    trackIndex: number;
    clipIndex: number;
    start: number;
    end: number;
}

/**
 * Watch for sequence panel selection changes using polling
 */
export const watchSequenceSelection = (callback: (selectedClips: SelectedClip[]) => void) => {
    try {
        if (!app.project || !app.project.activeSequence) {
            throw new Error("No active sequence");
        }

        var lastSelection = '';
        var timerId: number | null = null;

        function checkSelection(): void {
            if (app.project.activeSequence) {
                var selectedClips: SelectedClip[] = [];
                var sequence = app.project.activeSequence;

                // Check video tracks
                for (var i = 0; i < sequence.videoTracks.numTracks; i++) {
                    var track = sequence.videoTracks[i];
                    for (var j = 0; j < track.clips.numItems; j++) {
                        var clip = track.clips[j];
                        if (clip.isSelected()) {
                            selectedClips.push({
                                name: clip.name,
                                type: 'video',
                                trackIndex: i,
                                clipIndex: j,
                                start: clip.start.seconds,
                                end: clip.end.seconds
                            });
                        }
                    }
                }

                // Check audio tracks
                for (var i = 0; i < sequence.audioTracks.numTracks; i++) {
                    var track = sequence.audioTracks[i];
                    for (var j = 0; j < track.clips.numItems; j++) {
                        var clip = track.clips[j];
                        if (clip.isSelected()) {
                            selectedClips.push({
                                name: clip.name,
                                type: 'audio',
                                trackIndex: i,
                                clipIndex: j,
                                start: clip.start.seconds,
                                end: clip.end.seconds
                            });
                        }
                    }
                }

                var currentSelection = JSON.stringify(selectedClips);
                if (currentSelection !== lastSelection) {
                    lastSelection = currentSelection;
                    callback(selectedClips);
                }
            }
        }

        // Start polling
        timerId = window.setInterval(checkSelection, 500);

        // Return cleanup function
        return function cleanup(): void {
            if (timerId !== null) {
                window.clearInterval(timerId);
            }
        };
    } catch (err: any) {
        alert("Error watching sequence selection: " + String(err.message || err));
        return function noop(): void {};
    }
};

/**
 * Import files into project
 */
export const importFiles = (filePaths: string[], targetBin?: any): boolean => {
    try {
        if (!app.project) {
            throw new Error("No active project");
        }

        return app.project.importFiles(
            filePaths,
            false, // suppressUI
            targetBin || app.project.rootItem,
            false // importAsNumberedStill
        );
    } catch (err: any) {
        alert("Error importing files: " + String(err.message || err));
        return false;
    }
};
//     try {
//         if (!app.project) {
//             throw new Error("No active project");
//         }

//         var bin = parentBin || app.project.rootItem;
//         return bin.createBin(name);
//     } catch (err: any) {
//         alert("Error creating bin: " + String(err.message || err));
//         return null;
//     }
// };