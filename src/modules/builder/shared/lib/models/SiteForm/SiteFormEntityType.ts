import type { Nullable } from '@/shared';
import type { SiteFormEntityTypeDto } from '../../../../api';

export class SiteFormEntityType {
  entityTypeId: number;
  boardId: Nullable<number>;
  isMain: boolean;

  constructor({ entityTypeId, boardId, isMain }: SiteFormEntityType) {
    this.entityTypeId = entityTypeId;
    this.boardId = boardId;
    this.isMain = isMain;
  }

  static fromDto(dto: SiteFormEntityTypeDto): SiteFormEntityType {
    return new SiteFormEntityType({
      isMain: dto.isMain,
      boardId: dto.boardId,
      entityTypeId: dto.entityTypeId,
    });
  }

  static fromDtos(dtos: SiteFormEntityTypeDto[]): SiteFormEntityType[] {
    return dtos.map(this.fromDto);
  }
}
