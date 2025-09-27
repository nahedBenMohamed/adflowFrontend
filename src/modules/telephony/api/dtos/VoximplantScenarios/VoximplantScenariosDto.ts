import type { Nullable } from '@/shared';
import type { VoximplantScenarioEntityDto } from './VoximplantScenarioEntityDto';
import type { VoximplantScenarioNoteDto } from './VoximplantScenarioNoteDto';
import type { VoximplantScenarioTaskDto } from './VoximplantScenarioTaskDto';

export class VoximplantScenariosDto {
  entities: Nullable<VoximplantScenarioEntityDto[]>;
  notes: Nullable<VoximplantScenarioNoteDto[]>;
  tasks: Nullable<VoximplantScenarioTaskDto[]>;

  constructor({
    entities,
    notes,
    tasks,
  }: {
    entities: Nullable<VoximplantScenarioEntityDto[]>;
    notes: Nullable<VoximplantScenarioNoteDto[]>;
    tasks: Nullable<VoximplantScenarioTaskDto[]>;
  }) {
    this.entities = entities;
    this.notes = notes;
    this.tasks = tasks;
  }
}
