import { type RecordState } from '@/shared';
import { makeAutoObservable } from 'mobx';

export class RecordStateStore {
  recordState: RecordState;

  constructor(recordState: RecordState) {
    this.recordState = recordState;

    makeAutoObservable(this);
  }

  setPlaybackRate = (rate: RecordState['playbackRate']): void => {
    this.recordState.playbackRate = rate;
  };

  setPlaying = (playing: RecordState['playing']): void => {
    this.recordState.playing = playing;
  };

  togglePlaying = (): void => {
    this.recordState.playing = !this.recordState.playing;
  };

  setPlayed = (played: RecordState['played']): void => {
    this.recordState.played = played;
  };

  setSeekingStatus = (status: RecordState['seekingStatus']): void => {
    this.recordState.seekingStatus = status;
  };

  setDuration = (duration: RecordState['duration']): void => {
    this.recordState.duration = duration;
  };

  setExpanded = (expanded: RecordState['expanded']): void => {
    this.recordState.expanded = expanded;
  };

  toggleExpanded = (): void => {
    this.recordState.expanded = !this.recordState.expanded;
  };
}
