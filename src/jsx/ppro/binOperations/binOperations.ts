import { Bin, ProjectBin } from '../types';

/**
 * Create a new bin in the project
 * @param name Name of the bin to create
 * @param parentPath Optional parent bin path, defaults to root
 */
export const createBin = (name: string, parentPath?: string): ProjectBin | null => {
    try {
        if (!app.project) {
            throw new Error("No active project");
        }

        var parentBin = parentPath ? findBinByPath(parentPath) : app.project.rootItem;
        if (!parentBin) {
            throw new Error("Parent bin not found: " + parentPath);
        }

        return parentBin.createBin(name);
    } catch (err: any) {
        alert("Error creating bin: " + String(err.message || err));
        return null;
    }
};

/**
 * Delete a bin and optionally its contents
 * @param binPath Path to the bin to delete
 * @param deleteContents If true, deletes all contents. If false, moves contents to parent
 */
export const deleteBin = (binPath: string, deleteContents: boolean = false): boolean => {
    try {
        if (!app.project) {
            throw new Error("No active project");
        }

        var bin = findBinByPath(binPath);
        if (!bin) {
            throw new Error("Bin not found: " + binPath);
        }

        if (deleteContents) {
            // First delete all contents
            for (var i = bin.children.numItems - 1; i >= 0; i--) {
                bin.children[i].deleteBin();
            }
        } else {
            // Move contents to parent
            var parent = app.project.rootItem;
            for (var i = 0; i < bin.children.numItems; i++) {
                bin.children[i].moveBin(parent);
            }
        }

        bin.deleteBin();
        return true;
    } catch (err: any) {
        alert("Error deleting bin: " + String(err.message || err));
        return false;
    }
};

/**
 * Move a bin to a new parent
 * @param sourcePath Path to the bin to move
 * @param targetPath Path to the destination bin
 */
export const moveBin = (sourcePath: string, targetPath: string): boolean => {
    try {
        if (!app.project) {
            throw new Error("No active project");
        }

        var sourceBin = findBinByPath(sourcePath);
        var targetBin = findBinByPath(targetPath);

        if (!sourceBin || !targetBin) {
            throw new Error("Source or target bin not found");
        }

        sourceBin.moveBin(targetBin);
        return true;
    } catch (err: any) {
        alert("Error moving bin: " + String(err.message || err));
        return false;
    }
};

/**
 * Rename an existing bin
 * @param binPath Path to the bin to rename
 * @param newName New name for the bin
 */
export const renameBin = (binPath: string, newName: string): boolean => {
    try {
        if (!app.project) {
            throw new Error("No active project");
        }

        var bin = findBinByPath(binPath);
        if (!bin) {
            throw new Error("Bin not found: " + binPath);
        }

        return bin.renameBin(newName);
    } catch (err: any) {
        alert("Error renaming bin: " + String(err.message || err));
        return false;
    }
};

/**
 * Get all bins in the project
 * @returns Array of all bins
 */
// Helper function for processing bins
function processBin(item: any, parentPath: string = ''): Bin {
    var currentPath = parentPath ? parentPath + '/' + item.name : item.name;
    var result: Bin = {
        name: item.name,
        path: currentPath,
        children: [],
        isRoot: !parentPath,
        parentBin: undefined
    };

    if (item.children && item.children.numItems > 0) {
        for (var i = 0; i < item.children.numItems; i++) {
            var child = item.children[i];
            if (child.type === ProjectItemType.BIN) {
                var childBin = processBin(child, currentPath);
                childBin.parentBin = result;
                result.children.push(childBin);
            }
        }
    }

    return result;
}

export const getAllBins = (): Bin[] => {
    try {
        if (!app.project) {
            throw new Error("No active project");
        }
        return processBin(app.project.rootItem).children;
    } catch (err: any) {
        alert("Error getting bins: " + String(err.message || err));
        return [];
    }
};

/**
 * Find a bin by its path
 * @param path Path to the bin (e.g., "Footage/Day 1")
 */
export const findBinByPath = (path: string): any => {
    try {
        if (!app.project) {
            throw new Error("No active project");
        }

        var pathParts = path.split('/');
        var currentBin = app.project.rootItem;

        for (var i = 0; i < pathParts.length; i++) {
            var found = false;
            for (var j = 0; j < currentBin.children.numItems; j++) {
                var child = currentBin.children[j];
                if (child.type === ProjectItemType.BIN && child.name === pathParts[i]) {
                    currentBin = child;
                    found = true;
                    break;
                }
            }
            if (!found) {
                return null;
            }
        }

        return currentBin;
    } catch (err: any) {
        alert("Error finding bin: " + String(err.message || err));
        return null;
    }
};

/**
 * Check if a bin is empty
 * @param bin The bin to check
 */
export const isBinEmpty = (bin: any): boolean => {
    try {
        return bin.children.numItems === 0;
    } catch (err: any) {
        alert("Error checking bin: " + String(err.message || err));
        return false;
    }
};

/**
 * Get the contents of a bin
 * @param bin The bin to check
 * @returns Array of items in the bin (both bins and non-bins)
 */
export const getBinContents = (bin: any): any[] => {
    try {
        var contents = [];
        for (var i = 0; i < bin.children.numItems; i++) {
            contents.push(bin.children[i]);
        }
        return contents;
    } catch (err: any) {
        alert("Error getting bin contents: " + String(err.message || err));
        return [];
    }
};

/**
 * Create a bin structure from a path
 * @param path Path to create (e.g., "Footage/Day 1/Camera A")
 */
export const createBinPath = (path: string) => {
    try {
        if (!app.project) {
            throw new Error("No active project");
        }

        var pathParts = path.split('/');
        var currentPath = '';
        var currentBin = app.project.rootItem;

        for (var i = 0; i < pathParts.length; i++) {
            currentPath += (i > 0 ? '/' : '') + pathParts[i];
            var existingBin = findBinByPath(currentPath);
            
            if (!existingBin) {
                var newBin = currentBin.createBin(pathParts[i]);
                if (!newBin) {
                    throw new Error("Failed to create bin: " + pathParts[i]);
                }
                currentBin = newBin;
            } else {
                currentBin = existingBin;
            }
        }

        return currentBin ? currentBin : null;
    } catch (err: any) {
        alert("Error creating bin path: " + String(err.message || err));
        return null;
    }
};
