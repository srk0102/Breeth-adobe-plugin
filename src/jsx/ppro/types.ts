export interface Bin {
    name: string;
    path: string;
    children: Bin[];
    isRoot: boolean;
    parentBin?: Bin;
}

export interface ProjectBin {
    name: string;
    type: number;
    nodeId: string;
    treePath: string;
    timeDisplayFormat: number;
    children: {
        numItems: number;
        [index: number]: ProjectBin;
    };
    createBin: (name: string) => ProjectBin;
    deleteBin: () => void;
    moveBin: (destination: ProjectBin) => void;
    renameBin: (newName: string) => boolean;
    videoComponents: () => any;
}