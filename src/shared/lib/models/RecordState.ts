import { type PlayerPlaybackRate } from '../types';

export interface RecordState {
  played: number;
  duration: number;
  playing: boolean;
  recordUrl: string;
  expanded: boolean;
  seekingStatus: boolean;
  playbackRate: PlayerPlaybackRate;
}
