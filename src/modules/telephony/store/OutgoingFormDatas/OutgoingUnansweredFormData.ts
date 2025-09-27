import { InputModel, type Optional } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { VoximplantScenarioNoteDto } from '../../api';
import { ScenarioType, type VoximplantScenarioNote } from '../../shared';

export class OutgoingUnansweredFormData {
  createNoteInFeed: boolean;
  noteText: InputModel;

  constructor(defaultNoteText: string) {
    this.createNoteInFeed = false;

    this.noteText = InputModel.create(defaultNoteText).required();

    makeAutoObservable(this);
  }

  get updateDto(): { note: Optional<VoximplantScenarioNoteDto> } {
    if (!this.createNoteInFeed) return { note: undefined };

    return {
      note: new VoximplantScenarioNoteDto({
        scenarioType: ScenarioType.OUTGOING_UNANSWERED,
        noteText: this.noteText.value,
      }),
    };
  }

  initForm = (noteScenario: VoximplantScenarioNote): void => {
    this.createNoteInFeed = true;

    this.noteText.setValue(noteScenario.noteText);
  };

  setCreateNoteInFeed = (value: boolean): void => {
    this.createNoteInFeed = value;
  };

  validate = (): boolean => {
    if (!this.createNoteInFeed) {
      return true;
    }

    return this.noteText.validate();
  };
}
