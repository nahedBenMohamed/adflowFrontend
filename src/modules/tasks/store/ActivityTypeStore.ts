import type { DataStore, Optional } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { activityTypeApi, type CreateActivityTypeDto, UpdateActivityTypeDto } from '../api';
import type { ActivityType } from '../shared';

class ActivityTypeStore implements DataStore {
  activityTypes: ActivityType[] = [];

  isLoading = true;
  isAdding = false;

  constructor() {
    makeAutoObservable(this);
  }

  get firstActivityType(): Optional<ActivityType> {
    return this.activeActivityTypes[0];
  }

  get activeActivityTypes(): ActivityType[] {
    return this.activityTypes.filter(a => a.isActive);
  }

  loadData = async (): Promise<void> => {
    try {
      this.isLoading = true;

      this.activityTypes = await activityTypeApi.getActivityTypes();
    } catch (e) {
      throw new Error(`Error while loading activity types: ${e}`);
    } finally {
      this.isLoading = false;
    }
  };

  getById = (id: number): ActivityType => {
    const activityType = this.activityTypes.find(at => at.id === id);

    if (!activityType) throw new Error(`Activity type with id ${id} not found`);

    return activityType;
  };

  add = async (dto: CreateActivityTypeDto): Promise<ActivityType> => {
    try {
      this.isAdding = true;

      const createdActivityType = await activityTypeApi.addActivityType(dto);
      this.activityTypes.push(createdActivityType);

      return createdActivityType;
    } catch (e) {
      throw new Error(`Error while adding activity type ${dto.name}: ${e}`);
    } finally {
      this.isAdding = false;
    }
  };

  update = async ({ id, dto }: { id: number; dto: UpdateActivityTypeDto }): Promise<void> => {
    try {
      const updatedActivityType = await activityTypeApi.updateActivityType({ id, dto });

      const idx = this.activityTypes.findIndex(at => at.id === updatedActivityType.id);

      if (idx !== -1) {
        this.activityTypes.splice(idx, 1, updatedActivityType);
      }
    } catch (e) {
      throw new Error(`Error while updating activity type ${id}: ${e}`);
    }
  };

  delete = async (activityTypeId: number): Promise<void> => {
    await activityTypeApi.deleteActivityType(activityTypeId);

    const inactiveCandidate = this.activityTypes.find(t => t.id === activityTypeId);

    if (inactiveCandidate) inactiveCandidate.isActive = false;
  };

  reset = (): void => {
    this.activityTypes = [];

    this.isLoading = true;
    this.isAdding = false;
  };
}

export const activityTypeStore = new ActivityTypeStore();
