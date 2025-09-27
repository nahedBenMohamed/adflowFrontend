import { EntityLinkDto } from '@/app';
import { ObjectState } from '../ObjectState';

export class EntityLink {
  sourceId: number;
  targetId: number;
  sortOrder: number;
  state: ObjectState;

  constructor({
    sourceId,
    targetId,
    sortOrder,
    state,
  }: {
    sourceId: number;
    targetId: number;
    sortOrder: number;
    state: ObjectState;
  }) {
    this.sourceId = sourceId;
    this.targetId = targetId;
    this.sortOrder = sortOrder;
    this.state = state;
  }

  static fromDto(dto: EntityLinkDto): EntityLink {
    return new EntityLink({
      state: dto.state,
      sourceId: dto.sourceId,
      targetId: dto.targetId,
      sortOrder: dto.sortOrder,
    });
  }

  static fromDtos(dtos: EntityLinkDto[]): EntityLink[] {
    return dtos.map(this.fromDto);
  }

  static toDto(model: EntityLink): EntityLinkDto {
    return new EntityLinkDto({
      sourceId: model.sourceId,
      targetId: model.targetId,
      sortOrder: model.sortOrder,
      state: model.state,
    });
  }

  static toDtos(models: EntityLink[]): EntityLinkDto[] {
    return models.map(this.toDto);
  }

  markDeleted = (): void => {
    this.state = ObjectState.DELETED;
  };

  markChanged = (): void => {
    this.state = ObjectState.UPDATED;
  };

  changeSortOrder = (newSortOrder: number): void => {
    this.sortOrder = newSortOrder;
  };

  changeState = (state: ObjectState): void => {
    this.state = state;
  };
}
