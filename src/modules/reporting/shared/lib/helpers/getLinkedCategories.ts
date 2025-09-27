import { entityTypeStore } from '@/app';
import type { EntityCategory } from '@/shared';

export const getLinkedCategories = (entityTypeId: number): EntityCategory[] =>
  entityTypeStore
    .getById(entityTypeId)
    .linkedEntityTypes.map(et => entityTypeStore.getById(et.targetId).entityCategory);
