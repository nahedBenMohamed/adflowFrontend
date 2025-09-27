import { InputModel, SelectModel, validateForm, type Nullable, type Optional } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { VoximplantScenarioTaskDto } from '../../api';
import {
  TaskAndActivityCreateMode,
  type ScenarioType,
  type VoximplantScenarioTask,
} from '../../shared';

export class TaskAndActivityFormData {
  createMode: InputModel;

  taskTitle: InputModel;
  taskText: InputModel;
  // in minutes
  taskDuration: InputModel;
  taskOwnerId: SelectModel;

  activityTypeId: SelectModel;
  activityText: InputModel;
  // in minutes
  activityDuration: InputModel;
  activityOwnerId: SelectModel;

  createEmptyTaskForm = (): void => {
    this.taskTitle = InputModel.create();
    this.taskText = InputModel.create();
    this.taskDuration = InputModel.create().min(1);
    this.taskOwnerId = SelectModel.create();
  };

  createEmptyActivityForm = (): void => {
    this.activityTypeId = SelectModel.create();
    this.activityText = InputModel.create();
    this.activityDuration = InputModel.create().min(1);
    this.activityOwnerId = SelectModel.create();
  };

  getUpdateDto = (
    scenarioType: ScenarioType,
    ownerId: Nullable<number>
  ): { task: Optional<VoximplantScenarioTaskDto> } => {
    switch (this.createMode.value) {
      case TaskAndActivityCreateMode.DO_NOT_CREATE:
        return { task: undefined };

      case TaskAndActivityCreateMode.CREATE_TASK:
        return {
          task: new VoximplantScenarioTaskDto({
            scenarioType,
            createActivity: false,
            activityTypeId: null,
            activityText: null,
            activityDuration: null,
            activityOwnerId: null,
            createTask: true,
            taskTitle: this.taskTitle.value,
            taskText: this.taskText.value,
            taskDuration: this.taskDuration.asNumber(),
            taskOwnerId: ownerId,
          }),
        };

      case TaskAndActivityCreateMode.CREATE_ACTIVITY:
        return {
          task: new VoximplantScenarioTaskDto({
            scenarioType,
            createActivity: true,
            activityTypeId: this.activityTypeId.value,
            activityText: this.activityText.value,
            activityDuration: this.activityDuration.asNumber(),
            activityOwnerId: ownerId,
            createTask: false,
            taskTitle: null,
            taskText: null,
            taskDuration: null,
            taskOwnerId: null,
          }),
        };

      default:
        return { task: undefined };
    }
  };

  constructor() {
    this.createMode = InputModel.create(TaskAndActivityCreateMode.DO_NOT_CREATE);

    this.createEmptyTaskForm();
    this.createEmptyActivityForm();

    makeAutoObservable(this);
  }

  initForm = ({
    createTask,
    taskTitle,
    taskText,
    taskDuration,
    taskOwnerId,
    createActivity,
    activityTypeId,
    activityText,
    activityDuration,
    activityOwnerId,
  }: VoximplantScenarioTask): void => {
    if (createTask) {
      this.createMode.setValue(TaskAndActivityCreateMode.CREATE_TASK);
    } else if (createActivity) {
      this.createMode.setValue(TaskAndActivityCreateMode.CREATE_ACTIVITY);
    } else {
      this.createMode.setValue(TaskAndActivityCreateMode.DO_NOT_CREATE);
    }

    if (taskTitle) this.taskTitle.setValue(taskTitle);

    if (taskText) this.taskText.setValue(taskText);

    if (taskDuration) this.taskDuration.setNumberValue(taskDuration);

    if (taskOwnerId) this.taskOwnerId.setValue(taskOwnerId);

    if (activityTypeId) this.activityTypeId.setValue(activityTypeId);

    if (activityText) this.activityText.setValue(activityText);

    if (activityDuration) this.activityDuration.setNumberValue(activityDuration);

    if (activityOwnerId) this.activityOwnerId.setValue(activityOwnerId);
  };

  validate = (): boolean => {
    switch (this.createMode.value) {
      case TaskAndActivityCreateMode.DO_NOT_CREATE:
        return true;
      case TaskAndActivityCreateMode.CREATE_TASK: {
        this.taskTitle.required();
        this.taskDuration.required();

        return validateForm({ 0: this.taskTitle, 1: this.taskDuration });
      }
      case TaskAndActivityCreateMode.CREATE_ACTIVITY: {
        this.activityTypeId.required();
        this.activityDuration.required();

        return validateForm({ 0: this.activityTypeId, 1: this.activityDuration });
      }
      default:
        return true;
    }
  };
}
