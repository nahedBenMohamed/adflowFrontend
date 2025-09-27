import type { FieldType, Nullable } from '@/shared';

export class SearchByFieldFilter {
  fieldType: FieldType;
  fieldValue: string;
  excludeEntityId?: number[];
  entityTypeId?: Nullable<number>;

  constructor({ fieldValue, fieldType, excludeEntityId, entityTypeId }: SearchByFieldFilter) {
    this.fieldValue = fieldValue;
    this.fieldType = fieldType;
    this.excludeEntityId = excludeEntityId;
    this.entityTypeId = entityTypeId;
  }
}
