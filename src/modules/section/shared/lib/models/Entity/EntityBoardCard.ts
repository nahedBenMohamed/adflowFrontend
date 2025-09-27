import { EntityCategory, UtcDate, type Nullable } from '@/shared';
import {
  type CommonEntityCardDto,
  type EntityBoardCardDataDto,
  type EntityBoardCardDto,
  type ProjectEntityCardDto,
} from '../../../../api';
import { CommonEntityCard } from './CommonEntityCard';
import type { EntityBoardCardData } from './EntityBoardCardData';
import { ProjectEntityCard } from './ProjectEntityCard';

export class EntityBoardCard {
  id: number;
  entityCategory: EntityCategory;
  stageId: number;
  price: Nullable<number>;
  data: EntityBoardCardData;
  closedAt: Nullable<UtcDate>;
  weight: number;
  focused?: boolean;

  constructor({
    id,
    entityCategory,
    stageId,
    price,
    data,
    closedAt,
    weight,
    focused,
  }: EntityBoardCard) {
    this.id = id;
    this.entityCategory = entityCategory;
    this.stageId = stageId;
    this.price = price;
    this.data = data;
    this.closedAt = closedAt;
    this.weight = weight;
    this.focused = focused;
  }

  static fromDto(dto: EntityBoardCardDto): EntityBoardCard {
    const data = EntityBoardCard.fromBoardCardDataDto({
      entityCategory: dto.entityCategory,
      dataDto: dto.data,
    });

    return new EntityBoardCard({
      id: dto.id,
      entityCategory: dto.entityCategory,
      stageId: dto.stageId,
      price: dto.price,
      data,
      closedAt: UtcDate.parseISONullable(dto.closedAt),
      weight: dto.weight,
      focused: dto.focused,
    });
  }

  static fromBoardCardDataDto({
    entityCategory,
    dataDto,
  }: {
    entityCategory: EntityCategory;
    dataDto: EntityBoardCardDataDto;
  }): ProjectEntityCard | CommonEntityCard {
    if (entityCategory === EntityCategory.PROJECT) {
      const dto = dataDto as ProjectEntityCardDto;

      return new ProjectEntityCard({
        id: dto.id,
        name: dto.name,
        ownerId: dto.ownerId,
        tasksCount: dto.tasksCount,
        userRights: dto.userRights,
        copiedFrom: dto.copiedFrom,
        copiedCount: dto.copiedCount,
        entityTypeId: dto.entityTypeId,
        participantIds: dto.participantIds,
        createdAt: UtcDate.parseISO(dto.createdAt),
        endDate: UtcDate.parseISONullable(dto.endDate),
        startDate: UtcDate.parseISONullable(dto.startDate),
      });
    }

    const dto = dataDto as CommonEntityCardDto;

    return new CommonEntityCard({
      id: dto.id,
      entityTypeId: dto.entityTypeId,
      name: dto.name,
      userId: dto.userId,
      copiedFrom: dto.copiedFrom,
      userRights: dto.userRights,
      copiedCount: dto.copiedCount,
      linkedEntityNames: dto.linkedEntityNames,
      createdAt: UtcDate.parseISO(dto.createdAt),
      taskIndicatorColor: dto.taskIndicatorColor,
    });
  }

  static fromDtos(dtos: EntityBoardCardDto[]): EntityBoardCard[] {
    return dtos.map(this.fromDto);
  }
}
