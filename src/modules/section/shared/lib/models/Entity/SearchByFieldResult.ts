import type { EntityInfo, Nullable } from '@/shared';

export interface SearchByFieldResult {
  entity: Nullable<EntityInfo>;
  linked: Nullable<EntityInfo>;
}
