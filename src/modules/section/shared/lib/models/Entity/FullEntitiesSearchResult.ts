import { Entity, type PagingMeta } from '@/shared';
import type { FullEntitiesSearchResultDto } from '../../../../api';

export class FullEntitiesSearchResult {
  meta: PagingMeta;
  entities: Entity[];

  constructor({ entities, meta }: FullEntitiesSearchResult) {
    this.meta = meta;
    this.entities = entities;
  }

  static fromDto(dto: FullEntitiesSearchResultDto): FullEntitiesSearchResult {
    return new FullEntitiesSearchResult({
      meta: dto.meta,
      entities: Entity.fromDtos(dto.entities),
    });
  }
}
