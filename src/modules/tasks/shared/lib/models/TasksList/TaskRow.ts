import type { EntityInfo, InputModel, Nullable, SelectModel } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { type Task } from '../BaseTask/BaseTask';

export class TaskRow {
  isResolved: boolean;
  title: InputModel;
  stageId: SelectModel;
  endDate: SelectModel;
  startDate: SelectModel;
  createdBy: number;
  responsibleUserId: number;
  plannedTime: Nullable<number>;
  entityInfo: Nullable<EntityInfo>;

  originalTask: Task;

  constructor({
    isResolved,
    title,
    stageId,
    endDate,
    startDate,
    createdBy,
    responsibleUserId,
    plannedTime,
    entityInfo,
    originalTask,
  }: {
    isResolved: boolean;
    title: InputModel;
    stageId: SelectModel;
    endDate: SelectModel;
    startDate: SelectModel;
    createdBy: number;
    responsibleUserId: number;
    plannedTime: Nullable<number>;
    originalTask: Task;
    entityInfo: Nullable<EntityInfo>;
  }) {
    this.isResolved = isResolved;
    this.title = title;
    this.stageId = stageId;
    this.endDate = endDate;
    this.startDate = startDate;
    this.createdBy = createdBy;
    this.responsibleUserId = responsibleUserId;
    this.plannedTime = plannedTime;
    this.entityInfo = entityInfo;
    this.originalTask = originalTask;

    makeAutoObservable(this);
  }

  toggleResolved = (): void => {
    this.isResolved = !this.isResolved;
  };

  setResponsibleUserId = (responsibleUserId: number): void => {
    this.responsibleUserId = responsibleUserId;
  };

  setPlannedTime = (plannedTime: Nullable<number>): void => {
    this.plannedTime = plannedTime;
  };
}
