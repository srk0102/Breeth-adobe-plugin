// ProjectItem Helpers

export const forEachChild = (
  item: ProjectItem,
  callback: (item: ProjectItem) => void
) => {
  const len = item.children.numItems;
  for (let i = 0; i < len; i++) {
    callback(item.children[i]);
  }
};

export const deleteItem = (item: ProjectItem) => {
  if (item.type === 2 /* BIN */) {
    item.deleteBin();
  } else {
    const tmpBin = app.project.rootItem.createBin("tmp");
    item.moveBin(tmpBin);
    tmpBin.deleteBin();
  }
};

export const getChildByName = (item: ProjectItem, name: string) => {
  for (let i = 0; i < item.children.numItems; i++) {
    const child = item.children[i];
    if (child.name === name) {
      return child;
    }
  }
};

export const getParentItem = (item: ProjectItem) => {
  const dir = item.treePath.split("\\");
  if (dir.length < 2) {
    return app.project.rootItem;
  }
  let current = app.project.rootItem;
  for (let i = 2; i < dir.length - 1; i++) {
    const name = dir[i];
    const next = getChildByName(current, name);
    if (next) {
      current = next;
    }
  }
  return current;
};

export const findItemByPath = (
  item: ProjectItem,
  path: string
): ProjectItem | undefined => {
  const len = item.children.numItems;
  for (let i = 0; i < len; i++) {
    const child = item.children[i];
    if (child.children && child.children.numItems > 0) {
      const res = findItemByPath(child, path);
      if (res) {
        return res;
      }
    } else if (child.getMediaPath() === path) {
      return child;
    }
  }
};

// Sequence Helpers

export const getSequenceLengthInFrames = (seq: Sequence) => {
  const settings = seq.getSettings();
  const end = seq.end;
  const fps = settings.videoFrameRate.ticks;
  const frames = parseInt(end) / parseInt(fps);
  return frames;
};

export const forEachVideoTrack = (
  sequence: Sequence,
  callback: (track: Track, index: number) => void,
  reverse?: boolean
) => {
  const num = sequence.videoTracks.numTracks;
  if (reverse) {
    for (let i = num - 1; i > -1; i--) {
      callback(sequence.videoTracks[i], i);
    }
  } else {
    for (let i = 0; i < num; i++) {
      callback(sequence.videoTracks[i], i);
    }
  }
};

export const forEachAudioTrack = (
  sequence: Sequence,
  callback: (track: Track, index: number) => void,
  reverse?: boolean
) => {
  const num = sequence.audioTracks.numTracks;
  if (reverse) {
    for (let i = num - 1; i > -1; i--) {
      callback(sequence.audioTracks[i], i);
    }
  } else {
    for (let i = 0; i < num; i++) {
      callback(sequence.audioTracks[i], i);
    }
  }
};

export const forEachClip = (
  track: Track,
  callback: (clip: TrackItem, index: number) => void,
  reverse?: boolean
) => {
  const num = track.clips.numItems;
  if (reverse) {
    for (let i = num - 1; i > -1; i--) {
      callback(track.clips[i], i);
    }
  } else {
    for (let i = 0; i < num; i++) {
      callback(track.clips[i], i);
    }
  }
};

// Time Helpers

export const addTime = (a: Time, b: Time) => {
  const ticks = parseInt(a.ticks) + parseInt(b.ticks);
  let time = new Time();
  time.ticks = ticks.toString();
  return time;
};

export const subtractTime = (a: Time, b: Time) => {
  const ticks = parseInt(a.ticks) - parseInt(b.ticks);
  let time = new Time();
  time.ticks = ticks.toString();
  return time;
};
export const multiplyTime = (a: Time, factor: number) => {
  const ticks = parseInt(a.ticks) * factor;
  let time = new Time();
  time.ticks = ticks.toString();
  return time;
};
export const divideTime = (a: Time, factor: number) => {
  const ticks = parseInt(a.ticks) / factor;
  let time = new Time();
  time.ticks = ticks.toString();
  return time;
};

export const ticksToTime = (ticks: string) => {
  let time = new Time();
  time.ticks = ticks;
  return time;
};

export const secondsToTime = (seconds: number) => {
  let time = new Time();
  time.seconds = seconds;
  return time;
};

export const getTimecode = (
  t: Time,
  frameRateTime: Time,
  videoDisplayFormat: number
) => {
  const timecode = t.getFormatted(frameRateTime, videoDisplayFormat) as string;
  return timecode;
};

export const getTimecodeFromSequence = (t: Time, sequence: Sequence) => {
  return getTimecode(
    t,
    sequence.getSettings().videoFrameRate,
    sequence.getSettings().videoDisplayFormat
  );
};

// QE DOM Methods

export const qeGetClipAt = (track: Track, index: number) => {
  let curClipIndex = -1;
  for (let i = 0; i < track.numItems; i++) {
    const item = track.getItemAt(i);
    //@ts-ignore
    const type = item.type as "Empty" | "Clip";
    if (type === "Clip") {
      curClipIndex++;
      if (curClipIndex === index) {
        return item;
      }
    }
  }
};

// Metadata Helpers

export const getPrMetadata = (projectItem: ProjectItem, fields: string[]) => {
  let PProMetaURI = "http://ns.adobe.com/premierePrivateProjectMetaData/1.0/";
  if (ExternalObject.AdobeXMPScript === undefined) {
    ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
  }
  if (!app.isDocumentOpen() || !ExternalObject.AdobeXMPScript || !XMPMeta) {
    return {};
  }
  let xmp = new XMPMeta(projectItem.getProjectMetadata());
  let result: {
    [key: string]: string;
  } = {};
  for (let i = 0; i < fields.length; i++) {
    if (xmp.doesPropertyExist(PProMetaURI, fields[i])) {
      result[fields[i]] = xmp.getProperty(PProMetaURI, fields[i]).value;
    }
  }
  return result;
};

// Motion Graphics Template ( MOGRT ) Helpers

export const fillMogrtText = (
  clip: TrackItem,
  propName: string,
  text: string
) => {
  const mgt = clip.getMGTComponent();
  const prop = mgt.properties.getParamForDisplayName(propName);
  if (prop) {
    const valueStr = prop.getValue();
    let value = JSON.parse(valueStr) as any;
    value.textEditValue = text;
    prop.setValue(JSON.stringify(value), true);
  }
};

// Audio Conversions

export const dbToDec = (x: number) => Math.pow(10, (x - 15) / 20);

export const decToDb = (x: number) => 20 * Math.log(x) * Math.LOG10E + 15;

// Ripple Algorithm Utilities

export const getActiveSeq = () => {
    return app.project.activeSequence;
};

export const isAnyTrackLocked = (seq: any) => {
    // Check video tracks
    for (let i = 0; i < seq.videoTracks.numTracks; i++) {
        if (seq.videoTracks[i].isLocked()) return true;
    }
    // Check audio tracks
    for (let i = 0; i < seq.audioTracks.numTracks; i++) {
        if (seq.audioTracks[i].isLocked()) return true;
    }
    return false;
};

export const getVideoTracks = (seq: any) => {
    const tracks = [];
    for (let i = 0; i < seq.videoTracks.numTracks; i++) {
        tracks.push(seq.videoTracks[i]);
    }
    return tracks;
};

export const getAudioTracks = (seq: any) => {
    const tracks = [];
    for (let i = 0; i < seq.audioTracks.numTracks; i++) {
        tracks.push(seq.audioTracks[i]);
    }
    return tracks;
};

export const getClips = (track: any) => {
    const clips = [];
    for (let i = 0; i < track.clips.numItems; i++) {
        clips.push(track.clips[i]);
    }
    return clips;
};

export const collectAllIntervals = (seq: any) => {
    const out: any[] = [];

    const pull = (tracks: any[]) => {
        for (const t of tracks) {
            const clips = getClips(t);
            for (const c of clips) {
                const s = c.start.seconds;
                const e = c.end.seconds;
                if (e > s) {
                    out.push({ start: s, end: e });
                }
            }
        }
    };

    pull(getVideoTracks(seq));
    pull(getAudioTracks(seq));

    return out;
};

export const mergeIntervals = (iv: Array<{start: number; end: number;}>) => {
    if (iv.length <= 1) {
        const sorted = iv.slice().sort(function(a, b) { return a.start - b.start; });
        return sorted;
    }
    
    const eps = 1e-9;
    const sorted = iv.slice().sort(function(a, b) { return a.start - b.start; });
    const out = [];
    let cur = { start: sorted[0].start, end: sorted[0].end };

    for (let i = 1; i < sorted.length; i++) {
        const x = sorted[i];
        if (x.start <= cur.end + eps) {
            if (x.end > cur.end) cur.end = x.end;
        } else {
            out.push(cur);
            cur = { start: x.start, end: x.end };
        }
    }
    out.push(cur);
    return out;
};

export const computeGaps = (merged: Array<{start: number; end: number;}>) => {
    const gaps = [];
    for (let i = 0; i < merged.length - 1; i++) {
        const a = merged[i];
        const b = merged[i + 1];
        const gap = b.start - a.end;
        if (gap > 0) {
            gaps.push({ start: a.end, end: b.start });
        }
    }
    return gaps;
};

export const rippleShiftClipsFrom = (seq: any, pivotStart: number, delta: number) => {
    const shiftTrack = (tracks: any[]) => {
        for (const t of tracks) {
            const clips = getClips(t);
            for (const c of clips) {
                const cs = c.start.seconds;
                if (cs >= pivotStart) {
                    // Move clip by delta seconds
                    c.move(delta);
                }
            }
        }
    };

    shiftTrack(getVideoTracks(seq));
    shiftTrack(getAudioTracks(seq));
};