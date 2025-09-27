import type { ScenarioType } from '../../../shared';

export class VoximplantScenarioNoteDto {
  scenarioType: ScenarioType;
  noteText: string;

  constructor({ scenarioType, noteText }: { scenarioType: ScenarioType; noteText: string }) {
    this.scenarioType = scenarioType;
    this.noteText = noteText;
  }
}
