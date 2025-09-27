import { InputModel, SelectModel, type Optional } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { VoximplantScenarioEntityDto } from '../../api';
import { ScenarioAutoCreateState, ScenarioType, type VoximplantScenarioEntity } from '../../shared';

export class OutgoingUnknownFormData {
  autoCreate: InputModel;

  contactId: SelectModel;
  dealId: SelectModel;
  boardId: SelectModel;
  ownerId: SelectModel;

  constructor() {
    this.autoCreate = InputModel.create(ScenarioAutoCreateState.DISABLED);

    this.contactId = SelectModel.create();
    this.dealId = SelectModel.create();
    this.boardId = SelectModel.create();
    this.ownerId = SelectModel.create();

    makeAutoObservable(this);
  }

  get updateDto(): { entity: Optional<VoximplantScenarioEntityDto> } {
    if (this.autoCreate.value === ScenarioAutoCreateState.DISABLED || !this.contactId.value)
      return { entity: undefined };

    return {
      entity: new VoximplantScenarioEntityDto({
        scenarioType: ScenarioType.OUTGOING_UNKNOWN,
        contactId: this.contactId.value,
        ownerId: this.ownerId.value,
        dealId: this.dealId.value ?? null,
        boardId: this.boardId.value ?? null,
      }),
    };
  }

  initForm = (entityScenario: VoximplantScenarioEntity): void => {
    const { contactId, dealId, boardId, ownerId } = entityScenario;

    // if not contact was selected we assume that auto create was not set
    if (!this.contactId) {
      this.autoCreate.setValue(ScenarioAutoCreateState.DISABLED);

      return;
    }

    this.autoCreate.setValue(ScenarioAutoCreateState.ENABLED);

    this.contactId.setValue(contactId);

    if (dealId) this.dealId.setValue(dealId);

    if (boardId) this.boardId.setValue(boardId);

    if (ownerId) this.ownerId.setValue(boardId);
  };

  validate = (): boolean => {
    if (this.autoCreate.value === ScenarioAutoCreateState.DISABLED) return true;

    if (this.autoCreate.value === ScenarioAutoCreateState.ENABLED && !this.contactId.value) {
      this.contactId.required();

      return this.contactId.validate();
    }

    if (this.contactId.value && !this.dealId.value) return true;

    if (this.contactId.value && this.dealId.value) {
      this.boardId.required();

      return this.boardId.validate();
    }

    return true;
  };
}
