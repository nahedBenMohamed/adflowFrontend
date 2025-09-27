import { FieldUtil, FieldValuesStore, type Field, type PossibleFieldValue } from '@/modules/fields';
import { UtcDate, type Nullable, type UserRights } from '@/shared';
import { observable } from 'mobx';
import type { EntityListItemDto } from '../../../../api';

export class EntityListItem {
  id: number;
  name: string;
  responsibleUserId: number;
  entityTypeId: number;
  createdAt: UtcDate;
  fieldValues: PossibleFieldValue[];
  userRights: UserRights;
  stageId: Nullable<number>;
  copiedFrom: Nullable<number>;
  copiedCount: Nullable<number>;
  focused?: boolean;

  constructor({
    id,
    name,
    responsibleUserId,
    entityTypeId,
    createdAt,
    fieldValues,
    userRights,
    stageId,
    copiedCount,
    copiedFrom,
    focused,
  }: {
    id: number;
    name: string;
    stageId: Nullable<number>;
    createdAt: UtcDate;
    userRights: UserRights;
    entityTypeId: number;
    fieldValues: PossibleFieldValue[];
    responsibleUserId: number;
    copiedFrom: Nullable<number>;
    copiedCount: Nullable<number>;
    focused?: boolean;
  }) {
    this.id = id;
    this.name = name;
    this.stageId = stageId;
    this.createdAt = createdAt;
    this.userRights = userRights;
    this.fieldValues = fieldValues;
    this.entityTypeId = entityTypeId;
    this.responsibleUserId = responsibleUserId;
    this.copiedFrom = copiedFrom;
    this.copiedCount = copiedCount;
    this.focused = focused;
  }

  getOrCreateByField = (field: Field): PossibleFieldValue => {
    let fieldValue = this.fieldValues.find(i => i.fieldId === field.id);

    if (fieldValue) return fieldValue;

    fieldValue = observable(FieldValuesStore.createFieldValue(field));

    this.fieldValues.push(fieldValue);

    return fieldValue;
  };

  static fromDto(dto: EntityListItemDto): EntityListItem {
    return new EntityListItem({
      id: dto.id,
      name: dto.name,
      stageId: dto.stageId,
      userRights: dto.userRights,
      entityTypeId: dto.entityTypeId,
      responsibleUserId: dto.responsibleUserId,
      createdAt: UtcDate.parseISO(dto.createdAt),
      fieldValues: FieldUtil.fromDtos(dto.fieldValues),
      copiedFrom: dto.copiedFrom,
      copiedCount: dto.copiedCount,
      focused: dto.focused,
    });
  }

  static fromDtos(dtos: EntityListItemDto[]): EntityListItem[] {
    return dtos.map(this.fromDto);
  }
}
