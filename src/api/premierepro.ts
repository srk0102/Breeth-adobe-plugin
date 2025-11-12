import { premierepro as app } from "../globals";

// ===== SEQUENCE FUNCTIONS =====

export const getCurrentSequenceInfo = async () => {
  try {
    const project = await app.Project.getActiveProject();
    const activeSequence = await project.getActiveSequence();
    
    if (!activeSequence) {
      return { success: false, error: "No active sequence" };
    }
    
    const videoTrackCount = activeSequence.getVideoTrackCount();
    const audioTrackCount = activeSequence.getAudioTrackCount();
    
    return {
      success: true,
      sequence: {
        name: activeSequence.name || "Untitled",
        videoTracks: videoTrackCount,
        audioTracks: audioTrackCount
      },
      message: `Sequence: "${activeSequence.name}", ${videoTrackCount} video tracks, ${audioTrackCount} audio tracks`
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getTrackCount = async () => {
  try {
    const project = await app.Project.getActiveProject();
    const activeSequence = await project.getActiveSequence();
    
    if (!activeSequence) {
      return { success: false, error: "No active sequence" };
    }
    
    const videoTrackCount = activeSequence.getVideoTrackCount();
    const audioTrackCount = activeSequence.getAudioTrackCount();
    
    return {
      success: true,
      videoTracks: videoTrackCount,
      audioTracks: audioTrackCount,
      message: `${videoTrackCount} video tracks, ${audioTrackCount} audio tracks`
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getSequenceDuration = async () => {
  try {
    const project = await app.Project.getActiveProject();
    const activeSequence = await project.getActiveSequence();
    
    if (!activeSequence) {
      return { success: false, error: "No active sequence" };
    }
    
    const zeroPoint = activeSequence.getZeroPoint();
    const endTime = activeSequence.getEndTime();
    // TickTime values - duration in ticks
    const durationTicks = Number(endTime) - Number(zeroPoint);
    const seconds = Math.round(durationTicks / 254016000000); // Convert ticks to seconds
    
    return {
      success: true,
      duration: seconds,
      message: `Sequence duration: ${seconds} seconds`
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const renameSequence = async (newName: string) => {
  try {
    const project = await app.Project.getActiveProject();
    const activeSequence = await project.getActiveSequence();
    
    if (!activeSequence) {
      return { success: false, error: "No active sequence" };
    }
    
    const oldName = activeSequence.name;
    activeSequence.name = newName;
    
    return {
      success: true,
      oldName,
      newName,
      message: `Renamed sequence from '${oldName}' to '${newName}'`
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};