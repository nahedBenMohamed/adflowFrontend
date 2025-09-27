import type { VoximplantScenarioNoteDto } from '../../../../api';
import type { ScenarioType } from './ScenarioType';

export class VoximplantScenarioNote {
  scenarioType: ScenarioType;
  noteText: string;

  constructor({ scenarioType, noteText }: { scenarioType: ScenarioType; noteText: string }) {
    this.scenarioType = scenarioType;
    this.noteText = noteText;
  }

  static fromDto(dto: VoximplantScenarioNoteDto): VoximplantScenarioNote {
    const { scenarioType, noteText } = dto;

    return new VoximplantScenarioNote({
      scenarioType,
      noteText,
    });
  }

  static fromDtos(dtos: VoximplantScenarioNoteDto[]): VoximplantScenarioNote[] {
    return dtos.map(this.fromDto);
  }
}
