import { type Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';

// we want to only play one record at a time (e.g. in Player component),
// so we need to store the current playing record url
class RecordSingularityStore {
  currentRecordUrl: Nullable<string> = null;

  constructor() {
    makeAutoObservable(this);
  }

  setCurrentRecordUrl = (url: Nullable<string>): void => {
    this.currentRecordUrl = url;
  };

  clear = (): void => {
    this.currentRecordUrl = null;
  };
}

export const recordSingularityStore = new RecordSingularityStore();
