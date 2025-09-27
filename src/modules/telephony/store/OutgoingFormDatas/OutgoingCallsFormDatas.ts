import { validateForm } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { VoximplantScenarioEntityDto, VoximplantScenarioNoteDto } from '../../api';
import { ScenarioType, type VoximplantScenarios } from '../../shared';
import { OutgoingUnansweredFormData } from './OutgoingUnansweredFormData';
import { OutgoingUnknownFormData } from './OutgoingUnknownFormData';

export class OutgoingCallsFormDatas {
  outgoingUnknownFormData: OutgoingUnknownFormData;
  outgoingUnansweredFormData: OutgoingUnansweredFormData;

  createEmptyUnknownFormData = (): void => {
    this.outgoingUnknownFormData = new OutgoingUnknownFormData();
  };

  createEmptyUnansweredFormData = (defaultNoteText: string): void => {
    this.outgoingUnansweredFormData = new OutgoingUnansweredFormData(defaultNoteText);
  };

  constructor(defaultNoteText: string) {
    this.outgoingUnknownFormData = new OutgoingUnknownFormData();
    this.outgoingUnansweredFormData = new OutgoingUnansweredFormData(defaultNoteText);

    makeAutoObservable(this);
  }

  get updateDto(): {
    entities: VoximplantScenarioEntityDto[];
    notes: VoximplantScenarioNoteDto[];
  } {
    const entities = [this.outgoingUnknownFormData.updateDto.entity].filter(
      c => c instanceof VoximplantScenarioEntityDto
    ) as VoximplantScenarioEntityDto[];

    const notes = [this.outgoingUnansweredFormData.updateDto.note].filter(
      c => c instanceof VoximplantScenarioNoteDto
    ) as VoximplantScenarioNoteDto[];

    return {
      entities,
      notes,
    };
  }

  initForm = (voximplantScenarios: VoximplantScenarios): void => {
    if (!voximplantScenarios) return;

    // outgoing unknown scenario
    if (voximplantScenarios.entities) {
      const outgoingUnknownEntityScenario = voximplantScenarios.entities.find(
        e => e.scenarioType === ScenarioType.OUTGOING_UNKNOWN
      );

      if (outgoingUnknownEntityScenario)
        this.outgoingUnknownFormData.initForm(outgoingUnknownEntityScenario);
    }

    // outgoing unanswered scenario
    if (!voximplantScenarios.notes) return;

    const outgoingUnansweredNoteScenario = voximplantScenarios.notes.find(
      n => n.scenarioType === ScenarioType.OUTGOING_UNANSWERED
    );

    if (outgoingUnansweredNoteScenario)
      this.outgoingUnansweredFormData.initForm(outgoingUnansweredNoteScenario);
  };

  validate = (): boolean => {
    return validateForm([this.outgoingUnknownFormData, this.outgoingUnansweredFormData]);
  };
}
