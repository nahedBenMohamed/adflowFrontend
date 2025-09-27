import { validateForm } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { VoximplantScenarioEntityDto, VoximplantScenarioTaskDto } from '../../api';
import { ScenarioType, type VoximplantScenarios } from '../../shared';
import { IncomingKnownMissingFormData } from './IncomingKnownMissingFormData';
import { IncomingUnknownFormData } from './IncomingUnknownFormData';
import { IncomingUnknownMissingFormData } from './IncomingUnknownMissingFormData';

export class IncomingCallsFormDatas {
  incomingUnknownFormData: IncomingUnknownFormData;
  incomingUnknownMissingFormData: IncomingUnknownMissingFormData;
  incomingKnownMissingFormData: IncomingKnownMissingFormData;

  createEmptyIncomingUnknownFormData = (): void => {
    this.incomingUnknownFormData = new IncomingUnknownFormData();
  };

  createEmptyIncomingUnknownMissingFormData = (): void => {
    this.incomingUnknownMissingFormData = new IncomingUnknownMissingFormData();
  };

  createEmptyIncomingKnownMissingFormData = (): void => {
    this.incomingKnownMissingFormData = new IncomingKnownMissingFormData();
  };

  constructor() {
    this.createEmptyIncomingUnknownFormData();
    this.createEmptyIncomingUnknownMissingFormData();
    this.createEmptyIncomingKnownMissingFormData();

    makeAutoObservable(this);
  }

  get updateDto(): {
    entities: VoximplantScenarioEntityDto[];
    tasks: VoximplantScenarioTaskDto[];
  } {
    const incomingUnknownMissingFormDataUpdateDtos = this.incomingUnknownMissingFormData.updateDto;

    const entities = [
      this.incomingUnknownFormData.updateDto.entity,
      incomingUnknownMissingFormDataUpdateDtos.entity,
    ].filter(c => c instanceof VoximplantScenarioEntityDto) as VoximplantScenarioEntityDto[];

    const tasks = [
      incomingUnknownMissingFormDataUpdateDtos.task,
      this.incomingKnownMissingFormData.updateDto.task,
    ].filter(c => c instanceof VoximplantScenarioTaskDto) as VoximplantScenarioTaskDto[];

    return {
      entities,
      tasks,
    };
  }

  initForm = (voximplantScenarios: VoximplantScenarios): void => {
    if (!voximplantScenarios) return;

    // incoming unknown and incoming unknown missing scenarios
    if (voximplantScenarios.entities) {
      const incomingUnknownEntityScenario = voximplantScenarios.entities.find(
        e => e.scenarioType === ScenarioType.INCOMING_UNKNOWN
      );

      if (incomingUnknownEntityScenario)
        this.incomingUnknownFormData.initForm({ entityScenario: incomingUnknownEntityScenario });

      const incomingUnknownMissingEntityScenario = voximplantScenarios.entities.find(
        e => e.scenarioType === ScenarioType.INCOMING_UNKNOWN_MISSING
      );

      if (incomingUnknownMissingEntityScenario)
        this.incomingUnknownMissingFormData.initForm({
          entityScenario: incomingUnknownMissingEntityScenario,
          taskAndActivityFormData:
            voximplantScenarios.tasks?.find(
              t => t.scenarioType === ScenarioType.INCOMING_UNKNOWN_MISSING
            ) ?? null,
        });
    }

    // incoming known missing scenario
    if (voximplantScenarios.tasks) {
      const incomingKnownMissingTasksScenario = voximplantScenarios.tasks.find(
        t => t.scenarioType === ScenarioType.INCOMING_KNOWN_MISSING
      );

      if (incomingKnownMissingTasksScenario)
        this.incomingKnownMissingFormData.initForm(incomingKnownMissingTasksScenario);
    }
  };

  validate = (): boolean => {
    return validateForm([
      this.incomingUnknownFormData,
      this.incomingUnknownMissingFormData,
      this.incomingKnownMissingFormData,
    ]);
  };
}
