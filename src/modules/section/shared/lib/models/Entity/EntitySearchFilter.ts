import type { FieldType, Nullable } from '@/shared';

export class EntitySearchFilter {
  entityTypeId?: Nullable<number | number[]>;
  name?: Nullable<string>;
  boardId?: Nullable<number | number[]>;
  excludeEntityId?: Nullable<number | number[]>;
  fieldValue?: Nullable<string>;
  fieldType?: Nullable<FieldType>;
  searchInLinked?: Nullable<boolean>;

  limit?: number;
  offset?: number;

  constructor({
    entityTypeId,
    name,
    excludeEntityId,
    boardId,
    fieldValue,
    fieldType,
    searchInLinked,
    limit,
    offset,
  }: EntitySearchFilter) {
    this.entityTypeId = entityTypeId;
    this.name = name;
    this.boardId = boardId;
    this.excludeEntityId = excludeEntityId;
    this.fieldValue = fieldValue;
    this.fieldType = fieldType;
    this.searchInLinked = searchInLinked;
    this.limit = limit;
    this.offset = offset;
  }
}
