import type { EntityTypeTrigger } from '@/shared';
import { getCrmEventTypeByEntityTypeTrigger } from '../helpers';

export class EventMessageNameUtil {
  static template = ':accountId|:entityTypeId|:entityTypeTrigger';

  static getMessageName({
    accountId,
    entityTypeId,
    entityTypeTrigger,
  }: {
    accountId: number;
    entityTypeId: number;
    entityTypeTrigger: EntityTypeTrigger;
  }): string {
    return this.template
      .replace(':accountId', String(accountId))
      .replace(':entityTypeId', String(entityTypeId))
      .replace(':entityTypeTrigger', getCrmEventTypeByEntityTypeTrigger(entityTypeTrigger));
  }
}
