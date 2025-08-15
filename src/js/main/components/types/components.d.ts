export interface Clip {
	name: string;
	filePath: string;
	assetDuration: number;
	fileData?: string;
	timelineInpoint?: number;
	timelineoutPoint?: number;
	assetInpoint?: number;
	assetOutpoint?: number;
}

export interface PreviewClip {
	name: string;
	filePath: string;
	fileData?: string;
	type: string;
	timelineInpoint?: number;
	timelineoutPoint?: number;
	assetInpoint?: number;
	assetOutpoint?: number;
}

export interface SelectedClip extends Clip {}


