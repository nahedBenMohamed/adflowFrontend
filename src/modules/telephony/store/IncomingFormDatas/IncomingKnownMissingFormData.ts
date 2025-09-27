import type { Optional } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { VoximplantScenarioTaskDto } from '../../api';
import { ScenarioType, type VoximplantScenarioTask } from '../../shared';
import { TaskAndActivityFormData } from './TaskAndActivityFormData';

export class IncomingKnownMissingFormData {
  taskAndActivityFormData: TaskAndActivityFormData;

  constructor() {
    this.taskAndActivityFormData = new TaskAndActivityFormData();

    makeAutoObservable(this);
  }

  get updateDto(): { task: Optional<VoximplantScenarioTaskDto> } {
    return this.taskAndActivityFormData.getUpdateDto(ScenarioType.INCOMING_KNOWN_MISSING, null);
  }

  initForm = (taskAndActivityFormData: VoximplantScenarioTask): void => {
    this.taskAndActivityFormData.initForm(taskAndActivityFormData);
  };

  clearTasksAndActivitiesFormData = (): void => {
    this.taskAndActivityFormData = new TaskAndActivityFormData();
  };

  validate = (): boolean => {
    return this.taskAndActivityFormData.validate();
  };
}
