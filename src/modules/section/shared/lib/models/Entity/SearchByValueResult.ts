import type { EntityInfo, PagingMeta } from '@/shared';
import type { SearchByValueResultDto } from '../../../../api';

export class SearchByValueResult {
  meta: PagingMeta;
  entities: EntityInfo[];

  constructor({ entities, meta }: SearchByValueResult) {
    this.meta = meta;
    this.entities = entities;
  }

  static fromDto(dto: SearchByValueResultDto): SearchByValueResult {
    return new SearchByValueResult({
      meta: dto.meta,
      entities: dto.entities,
    });
  }
}
