import type { Nullable } from '@/shared';
import type { ScenarioType } from '../../../shared';

export class VoximplantScenarioTaskDto {
  scenarioType: ScenarioType;
  createActivity: Nullable<boolean>;
  activityTypeId: Nullable<number>;
  activityText: Nullable<string>;
  activityDuration: Nullable<number>;
  activityOwnerId: Nullable<number>;
  createTask: Nullable<boolean>;
  taskTitle: Nullable<string>;
  taskText: Nullable<string>;
  taskDuration: Nullable<number>;
  taskOwnerId: Nullable<number>;

  constructor({
    scenarioType,
    createActivity,
    activityTypeId,
    activityText,
    activityDuration,
    activityOwnerId,
    createTask,
    taskTitle,
    taskText,
    taskDuration,
    taskOwnerId,
  }: {
    scenarioType: ScenarioType;
    createActivity: Nullable<boolean>;
    activityTypeId: Nullable<number>;
    activityText: Nullable<string>;
    activityDuration: Nullable<number>;
    activityOwnerId: Nullable<number>;
    createTask: Nullable<boolean>;
    taskTitle: Nullable<string>;
    taskText: Nullable<string>;
    taskDuration: Nullable<number>;
    taskOwnerId: Nullable<number>;
  }) {
    this.scenarioType = scenarioType;
    this.createActivity = createActivity;
    this.activityTypeId = activityTypeId;
    this.activityText = activityText;
    this.activityDuration = activityDuration;
    this.activityOwnerId = activityOwnerId;
    this.createTask = createTask;
    this.taskTitle = taskTitle;
    this.taskText = taskText;
    this.taskDuration = taskDuration;
    this.taskOwnerId = taskOwnerId;
  }
}
