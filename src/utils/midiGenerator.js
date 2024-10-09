import MidiWriter from 'midi-writer-js';
import fs from 'fs';
import path from 'path';
import { extractFramesWithTiming, detectHoles } from './videoProcessor.js';

function mapHolesToMIDI(hole, currentTime) {
  // Implement mapping logic here
  // This is a placeholder and should be replaced with actual mapping logic
  return {
    type: 'note',
    pitch: 60, // Middle C
    start: currentTime,
    duration: 0.5,
  };
}

export async function processVideoToMIDI(videoPath) {
  const { frames, timestamps } = await extractFramesWithTiming(videoPath);
  let midiEvents = [];

  frames.forEach((frame, index) => {
    const holes = detectHoles(frame);
    const currentTime = timestamps[index];

    holes.forEach((hole) => {
      const midiEvent = mapHolesToMIDI(hole, currentTime);
      midiEvents.push(midiEvent);
    });
  });

  return generateMIDI(midiEvents);
}

async function generateMIDI(midiEvents) {
  let track = new MidiWriter.Track();

  midiEvents.forEach((event) => {
    if (event.type === 'note') {
      track.addEvent(new MidiWriter.NoteEvent({
        pitch: event.pitch,
        duration: '4',
        startTick: event.start * 1000,
        velocity: 100,
      }));
    }
  });

  let writer = new MidiWriter.Writer(track);
  const midiFilePath = path.join('output', `output-${Date.now()}.mid`);
  fs.writeFileSync(midiFilePath, writer.buildFile());

  return midiFilePath;
}