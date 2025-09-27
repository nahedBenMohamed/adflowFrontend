import {
  BooleanModel,
  type EntitySettings,
  InputModel,
  JsonStateHelper,
  type Nullable,
  SelectModel,
} from '@/shared';
import { computed, makeAutoObservable } from 'mobx';

export class EntitySettingsStore {
  createEntities: BooleanModel;
  contactEntityType: SelectModel;
  leadEntityType: SelectModel;
  leadBoard: SelectModel;
  leadStage: SelectModel;
  leadName: InputModel;
  ownerId: SelectModel;
  checkDuplicate: BooleanModel;
  checkActiveLead: BooleanModel;

  jsonState: Nullable<JsonStateHelper> = null;

  constructor(settings?: Nullable<EntitySettings>) {
    this.createEntities = BooleanModel.create(Boolean(settings));
    this.contactEntityType = SelectModel.create(settings?.contactEntityTypeId);
    this.leadEntityType = SelectModel.create(settings?.leadEntityTypeId);
    this.leadBoard = SelectModel.create(settings?.leadBoardId);
    this.leadStage = SelectModel.create(settings?.leadStageId);
    this.leadName = InputModel.create(settings?.leadName);
    this.ownerId = SelectModel.create(settings?.ownerId).required();
    this.checkDuplicate = BooleanModel.create(Boolean(settings?.checkDuplicate));
    this.checkActiveLead = BooleanModel.create(Boolean(settings?.checkActiveLead));

    this.initializeJsonState();

    makeAutoObservable(this);
  }

  initializeJsonState = (): void => {
    this.jsonState = new JsonStateHelper(() =>
      JSON.stringify([
        this.createEntities.value,
        this.contactEntityType.value,
        this.leadEntityType.value,
        this.leadBoard.value,
        this.leadStage.value,
        this.leadName.value,
        this.ownerId.value,
        this.checkDuplicate.value,
        this.checkActiveLead.value,
      ])
    );

    this.jsonState.calculateState();
  };

  get updateDto(): Nullable<EntitySettings> {
    if (!this.createEntities.value) return null;

    return {
      contactEntityTypeId: this.contactEntityType.value,
      leadEntityTypeId: this.leadEntityType.value,
      leadBoardId: this.leadBoard.value,
      leadStageId: this.leadStage.value,
      leadName: this.leadName.value,
      ownerId: this.ownerId.value,
      checkDuplicate: this.checkDuplicate.value,
      checkActiveLead: this.checkActiveLead.value,
    };
  }

  validate = (): boolean => {
    if (!this.createEntities.value) return true;

    if (!this.contactEntityType.value && !this.leadEntityType.value) {
      this.contactEntityType.setError();
      this.leadEntityType.setError();

      return false;
    }

    return this.ownerId.validate();
  };

  @computed.struct
  isJsonStateChanged = (): boolean => {
    if (this.jsonState) return this.jsonState.stateChanged;

    return false;
  };
}
