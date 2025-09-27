import type { Nullable } from '../types';
import { storageService } from './StorageService';

interface SchedulerParams {
  entityTypeId: number;
  lastSchedulerId: number;
}

class LastSchedulerService {
  readonly _key = 'LastScheduler';

  getLastSchedulerId(entityTypeId: number): Nullable<number> {
    const schedulers = storageService.get<SchedulerParams[]>(this._key);

    if (!schedulers) return null;

    const lastSchedulerParams = schedulers.find(s => s.entityTypeId === entityTypeId);

    if (!lastSchedulerParams) return null;

    return lastSchedulerParams.lastSchedulerId;
  }

  setLastSchedulerId({
    entityTypeId,
    schedulerId,
  }: {
    schedulerId: number;
    entityTypeId: number;
  }): void {
    const schedulerParams = storageService.get<SchedulerParams[]>(this._key) ?? [];

    const params: SchedulerParams = {
      entityTypeId,
      lastSchedulerId: schedulerId,
    };

    const idx = schedulerParams.findIndex(s => s.entityTypeId === entityTypeId);

    let newParams = [];

    if (idx !== -1) {
      newParams = schedulerParams.toSpliced(idx, 1, params);
    } else {
      newParams = [...schedulerParams, params];
    }

    storageService.set(this._key, newParams);
  }
}

export const lastSchedulerService = new LastSchedulerService();
