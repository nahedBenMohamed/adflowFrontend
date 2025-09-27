import { InputModel, SelectModel, type Nullable, type Optional } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { VoximplantScenarioEntityDto, type VoximplantScenarioTaskDto } from '../../api';
import {
  ScenarioAutoCreateState,
  ScenarioType,
  type VoximplantScenarioEntity,
  type VoximplantScenarioTask,
} from '../../shared';
import { TaskAndActivityFormData } from './TaskAndActivityFormData';

export class IncomingUnknownMissingFormData {
  autoCreate: InputModel;

  contactId: SelectModel;
  dealId: SelectModel;
  boardId: SelectModel;
  ownerId: SelectModel;

  taskAndActivityFormData: TaskAndActivityFormData;

  constructor() {
    this.autoCreate = InputModel.create(ScenarioAutoCreateState.DISABLED);

    this.contactId = SelectModel.create();
    this.dealId = SelectModel.create();
    this.boardId = SelectModel.create();
    this.ownerId = SelectModel.create();

    this.taskAndActivityFormData = new TaskAndActivityFormData();

    makeAutoObservable(this);
  }

  get updateDto(): {
    entity: Optional<VoximplantScenarioEntityDto>;
    task: Optional<VoximplantScenarioTaskDto>;
  } {
    if (this.autoCreate.value === ScenarioAutoCreateState.DISABLED || !this.contactId.value)
      return { entity: undefined, task: undefined };

    return {
      entity: new VoximplantScenarioEntityDto({
        scenarioType: ScenarioType.INCOMING_UNKNOWN_MISSING,
        contactId: this.contactId.value,
        ownerId: this.ownerId.value,
        dealId: this.dealId.value ?? null,
        boardId: this.boardId.value ?? null,
      }),
      task: this.taskAndActivityFormData.getUpdateDto(
        ScenarioType.INCOMING_UNKNOWN_MISSING,
        this.ownerId.value
      ).task,
    };
  }

  initForm = ({
    entityScenario: { contactId, dealId, boardId, ownerId },
    taskAndActivityFormData,
  }: {
    entityScenario: VoximplantScenarioEntity;
    taskAndActivityFormData: Nullable<VoximplantScenarioTask>;
  }): void => {
    // if no contact was selected we assume that auto create was not set
    if (!contactId) {
      this.autoCreate.setValue(ScenarioAutoCreateState.DISABLED);

      return;
    }

    this.autoCreate.setValue(ScenarioAutoCreateState.ENABLED);

    this.contactId.setValue(contactId);

    if (dealId) this.dealId.setValue(dealId);

    if (boardId) this.boardId.setValue(boardId);

    if (ownerId) this.ownerId.setValue(ownerId);

    if (!taskAndActivityFormData) return;

    this.taskAndActivityFormData.initForm(taskAndActivityFormData);
  };

  clearTasksAndActivitiesFormData = (): void => {
    this.taskAndActivityFormData = new TaskAndActivityFormData();
  };

  validate = (): boolean => {
    let isValid;

    if (this.autoCreate.value === ScenarioAutoCreateState.DISABLED) {
      isValid = true;
    } else if (this.autoCreate.value === ScenarioAutoCreateState.ENABLED && !this.contactId.value) {
      this.contactId.required();

      return this.contactId.validate();
    } else if (this.contactId.value && !this.dealId.value) {
      this.contactId.required();

      isValid = this.contactId.validate();
    } else if (this.contactId.value && this.dealId.value) {
      this.boardId.required();

      isValid = this.boardId.validate();
    } else {
      isValid = true;
    }

    return this.taskAndActivityFormData.validate() && isValid;
  };
}
