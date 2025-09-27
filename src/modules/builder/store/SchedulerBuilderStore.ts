import { iconStore } from '@/app';
import {
  type CreateScheduleDto,
  type Schedule,
  scheduleApi,
  SchedulePerformerType,
  type UpdateScheduleDto,
} from '@/modules/scheduler';
import type { Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { SchedulerSectionBuilderFormData } from '../shared';

export class SchedulerBuilderStore {
  formData: SchedulerSectionBuilderFormData;
  schedule: Nullable<Schedule> = null;

  isLoaded = false;
  isLoading = false;
  isCreating = false;
  isUpdating = false;

  constructor(defaultTitle: string) {
    this.formData = SchedulerSectionBuilderFormData.empty(defaultTitle);

    makeAutoObservable(this);
  }

  get isDestructiveUpdate(): boolean {
    if (!this.schedule) return false;

    // schedule type changed -> destructive
    if (this.formData.scheduleType.value !== this.schedule.type) return true;

    // performers type changed -> destructive
    if (
      this.schedule.performers[0] &&
      this.formData.performerType.value !== this.schedule.performers[0].type
    )
      return true;

    // performers removed → destructive
    if (
      this.schedule.performers[0] &&
      this.schedule.performers[0].type === SchedulePerformerType.USER
    ) {
      if (
        !this.schedule?.performers
          .map(p => p.userId)
          .every(
            userId => userId !== null && this.formData.performerIdsUsers.values.includes(userId)
          )
      ) {
        return true;
      }
    } else {
      if (
        !this.schedule?.performers
          .map(p => p.departmentId)
          .every(depId => depId !== null && this.formData.performerIdsGroups.values.includes(depId))
      ) {
        return true;
      }
    }

    return false;
  }

  extractPerformerIdsUsers = (schedule: Schedule): number[] => {
    return schedule.performers
      .filter(p => p.type === SchedulePerformerType.USER)
      .map(p => {
        if (p.userId) return p.userId;

        throw new Error(
          `Failed to extract user performer id from ${JSON.stringify(p)} in schedule ${schedule.id}`
        );
      });
  };

  extractPerformerIdsGroups = (schedule: Schedule): number[] => {
    return schedule.performers
      .filter(p => p.type === SchedulePerformerType.DEPARTMENT)
      .map(p => {
        if (p.departmentId) return p.departmentId;

        throw new Error(
          `Failed to extract group performer id from ${JSON.stringify(p)} in schedule ${
            schedule.id
          }`
        );
      });
  };

  extractPerformerType = (schedule: Schedule): SchedulePerformerType => {
    if (schedule.performers.every(p => p.type === SchedulePerformerType.USER))
      return SchedulePerformerType.USER;

    if (schedule.performers.every(p => p.type === SchedulePerformerType.DEPARTMENT))
      return SchedulePerformerType.DEPARTMENT;

    throw new Error(
      `Failed to extract performer type from schedule ${schedule.id}, different types for same schedule ${schedule.id} are not supported`
    );
  };

  initializeFormData = (schedule: Schedule): void => {
    this.formData = new SchedulerSectionBuilderFormData({
      name: schedule.name,
      scheduleType: schedule.type,
      intervals: schedule.intervals,
      timePeriod: schedule.timePeriod,
      entityTypeId: schedule.entityTypeId,
      icon: iconStore.getByName(schedule.icon),
      oneEntityPerDay: schedule.oneEntityPerDay,
      appointmentLimit: schedule.appointmentLimit,
      productsSectionId: schedule.productsSectionId,
      performerType: this.extractPerformerType(schedule),
      performerIdsUsers: this.extractPerformerIdsUsers(schedule),
      performerIdsGroups: this.extractPerformerIdsGroups(schedule),
    });
  };

  loadData = async (moduleId: number): Promise<void> => {
    try {
      this.isLoading = true;

      this.schedule = await scheduleApi.getSchedule(moduleId);

      this.initializeFormData(this.schedule);
    } catch (e) {
      throw new Error(`Failed to load schedule ${moduleId}: ${e}`);
    } finally {
      this.isLoaded = true;
      this.isLoading = false;
    }
  };

  invalidateData = async (moduleId: number): Promise<void> => {
    try {
      this.isLoading = true;

      this.schedule = await scheduleApi.getSchedule(moduleId);

      this.initializeFormData(this.schedule);
    } catch (e) {
      throw new Error(`Failed to invalidate schedule data ${moduleId}: ${e}`);
    } finally {
      this.isLoading = false;
    }
  };

  createSchedule = async (dto: CreateScheduleDto): Promise<Schedule> => {
    try {
      this.isCreating = true;

      this.schedule = await scheduleApi.createSchedule(dto);

      return this.schedule;
    } catch (e) {
      throw new Error(`Failed to create schedule ${dto.name}: ${e}`);
    } finally {
      this.isCreating = false;
    }
  };

  updateSchedule = async ({
    moduleId,
    dto,
  }: {
    moduleId: number;
    dto: UpdateScheduleDto;
  }): Promise<void> => {
    try {
      this.isUpdating = true;

      await scheduleApi.updateSchedule(moduleId, dto);
    } catch (e) {
      throw new Error(`Failed to update schedule ${moduleId}: ${e}`);
    } finally {
      this.isUpdating = false;
    }
  };
}
