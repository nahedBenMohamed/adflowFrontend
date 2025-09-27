import { JsonStateHelper, validateForm, type Nullable } from '@/shared';
import { computed, makeAutoObservable } from 'mobx';
import { VoximplantScenariosDto, voximplantApi } from '../api';
import type { VoximplantScenarios } from '../shared';
import { IncomingCallsFormDatas } from './IncomingFormDatas/IncomingCallsFormDatas';
import { OutgoingCallsFormDatas } from './OutgoingFormDatas/OutgoingCallsFormDatas';

export class VoximplantScenariosStore {
  voximplantScenarios: Nullable<VoximplantScenarios> = null;

  incomingCallsFormDatas: IncomingCallsFormDatas;
  outgoingCallsFormDatas: OutgoingCallsFormDatas;

  isLoaded = false;
  isSaving = false;

  jsonState: Nullable<JsonStateHelper> = null;

  createEmpty = (defaultNoteText: string) => {
    this.incomingCallsFormDatas = new IncomingCallsFormDatas();
    this.outgoingCallsFormDatas = new OutgoingCallsFormDatas(defaultNoteText);
  };

  constructor(defaultNoteText: string) {
    this.createEmpty(defaultNoteText);

    makeAutoObservable(this);
  }

  get updateDto(): VoximplantScenariosDto {
    const { entities: incomingEntities, tasks: incomingTasks } =
      this.incomingCallsFormDatas.updateDto;

    const { entities: outgoingEntities, notes: outgoingNotes } =
      this.outgoingCallsFormDatas.updateDto;

    return new VoximplantScenariosDto({
      entities: [...incomingEntities, ...outgoingEntities],
      tasks: incomingTasks,
      notes: outgoingNotes,
    });
  }

  initializeJsonState = (): void => {
    this.jsonState = new JsonStateHelper(() =>
      JSON.stringify([this.incomingCallsFormDatas, this.outgoingCallsFormDatas])
    );

    this.jsonState.calculateState();
  };

  loadData = async (): Promise<void> => {
    try {
      this.isLoaded = false;

      this.voximplantScenarios = await voximplantApi.getVoximplantScenarios();

      this.incomingCallsFormDatas.initForm(this.voximplantScenarios);
      this.outgoingCallsFormDatas.initForm(this.voximplantScenarios);
    } catch (e) {
      throw new Error(`Failed to load voximplant scenarios: ${e}`);
    } finally {
      this.isLoaded = true;

      this.initializeJsonState();
    }
  };

  validate = (): boolean => {
    return validateForm([this.incomingCallsFormDatas, this.outgoingCallsFormDatas]);
  };

  saveChanges = async (): Promise<void> => {
    if (!this.validate()) return;

    try {
      this.isSaving = true;

      const dto = this.updateDto;

      await voximplantApi.updateVoximplantScenarios(dto);
    } catch (e) {
      throw new Error(`Failed to update voximplant scenarios: ${e}`);
    } finally {
      this.isSaving = false;

      this.initializeJsonState();
    }
  };

  clearChanges = (defaultNoteText: string): void => {
    this.isLoaded = false;

    this.createEmpty(defaultNoteText);
    this.loadData();
  };

  @computed.struct
  isJsonStateChanged = (): boolean => {
    if (this.jsonState) return this.jsonState.stateChanged;

    return false;
  };
}
