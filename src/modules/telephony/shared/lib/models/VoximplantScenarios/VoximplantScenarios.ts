import type { Nullable } from '@/shared';
import type { VoximplantScenariosDto } from '../../../../api';
import { VoximplantScenarioEntity } from './VoximplantScenarioEntity';
import { VoximplantScenarioNote } from './VoximplantScenarioNote';
import { VoximplantScenarioTask } from './VoximplantScenarioTask';

export class VoximplantScenarios {
  entities: Nullable<VoximplantScenarioEntity[]>;
  notes: Nullable<VoximplantScenarioNote[]>;
  tasks: Nullable<VoximplantScenarioTask[]>;

  constructor(
    entities: Nullable<VoximplantScenarioEntity[]>,
    notes: Nullable<VoximplantScenarioNote[]>,
    tasks: Nullable<VoximplantScenarioTask[]>
  ) {
    this.entities = entities;
    this.notes = notes;
    this.tasks = tasks;
  }

  static fromDto(dto: VoximplantScenariosDto): VoximplantScenarios {
    return new VoximplantScenarios(
      dto.entities ? VoximplantScenarioEntity.fromDtos(dto.entities) : null,
      dto.notes ? VoximplantScenarioNote.fromDtos(dto.notes) : null,
      dto.tasks ? VoximplantScenarioTask.fromDtos(dto.tasks) : null
    );
  }
}
