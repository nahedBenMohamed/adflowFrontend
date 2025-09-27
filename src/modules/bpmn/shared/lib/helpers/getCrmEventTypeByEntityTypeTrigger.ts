import { CrmEventType, EntityTypeTrigger } from '@/shared';

export const getCrmEventTypeByEntityTypeTrigger = (entityTypeTrigger: EntityTypeTrigger) => {
  switch (entityTypeTrigger) {
    case EntityTypeTrigger.CREATE:
      return CrmEventType.ENTITY_CREATED;

    case EntityTypeTrigger.CHANGE_OWNER:
      return CrmEventType.ENTITY_OWNER_CHANGED;

    case EntityTypeTrigger.CHANGE_STAGE:
      return CrmEventType.ENTITY_STAGE_CHANGED;
  }
};
