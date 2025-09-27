import type { Nullable } from '@/shared';
import type { VoximplantScenarioEntityDto } from '../../../../api';
import type { ScenarioType } from './ScenarioType';

export class VoximplantScenarioEntity {
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

  static fromDto(dto: VoximplantScenarioEntityDto): VoximplantScenarioEntity {
    const { scenarioType, contactId, boardId, dealId, ownerId } = dto;

    return new VoximplantScenarioEntity({
      scenarioType,
      contactId,
      boardId,
      dealId,
      ownerId,
    });
  }

  static fromDtos(dtos: VoximplantScenarioEntityDto[]): VoximplantScenarioEntity[] {
    return dtos.map(this.fromDto);
  }
}
