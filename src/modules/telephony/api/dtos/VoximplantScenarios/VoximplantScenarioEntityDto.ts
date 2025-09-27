import type { Nullable } from '@/shared';
import type { ScenarioType } from '../../../shared';

export class VoximplantScenarioEntityDto {
  scenarioType: ScenarioType;
  contactId: Nullable<number>;
  dealId: Nullable<number>;
  boardId: Nullable<number>;
  ownerId: Nullable<number>;

  constructor({
    scenarioType,
    contactId,
    dealId,
    boardId,
    ownerId,
  }: {
    scenarioType: ScenarioType;
    contactId: Nullable<number>;
    dealId: Nullable<number>;
    boardId: Nullable<number>;
    ownerId: Nullable<number>;
  }) {
    this.scenarioType = scenarioType;
    this.contactId = contactId;
    this.dealId = dealId;
    this.boardId = boardId;
    this.ownerId = ownerId;
  }
}
