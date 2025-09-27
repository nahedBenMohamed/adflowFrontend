import type { EntityInfo, PagingMeta } from '@/shared';

export interface SearchByValueResultDto {
  meta: PagingMeta;
  entities: EntityInfo[];
}
