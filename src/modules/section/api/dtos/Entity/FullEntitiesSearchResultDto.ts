import type { EntityDto } from '@/app';
import type { PagingMeta } from '@/shared';

export interface FullEntitiesSearchResultDto {
  meta: PagingMeta;
  entities: EntityDto[];
}
