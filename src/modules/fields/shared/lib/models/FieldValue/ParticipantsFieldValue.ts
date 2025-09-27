import { MultiselectModel, ObjectState, type FieldType } from '@/shared';
import { action, makeObservable, observable } from 'mobx';
import type { FieldValueDto } from '../../../../api';
import type { ParticipantsFieldValuePrimitive } from '../../types';
import type { Field } from '../Field/Field';
import { FieldValue } from './FieldValue';

export class ParticipantsFieldValue extends FieldValue<
  ParticipantsFieldValuePrimitive,
  MultiselectModel<number>
> {
  userIds: number[] = [];

  private constructor(
    fieldId: number,
    fieldType: FieldType,
    userIds: number[],
    state: ObjectState
  ) {
    super({ fieldId, fieldType, state, model: MultiselectModel.create<number>(userIds) });

    this.userIds = userIds;

    makeObservable(this, {
      state: true,
      userIds: true,
      model: observable,
      changeState: action,
      changeUserIds: action,
    });
  }

  static create({ field, userIds }: { field: Field; userIds: number[] }): ParticipantsFieldValue {
    return new ParticipantsFieldValue(field.id, field.type, userIds, ObjectState.CREATED);
  }

  static empty(field: Field): ParticipantsFieldValue {
    return new ParticipantsFieldValue(field.id, field.type, [], ObjectState.CREATED_EMPTY);
  }

  static fromDto({
    fieldId,
    fieldType,
    payload,
  }: FieldValueDto<ParticipantsFieldValuePrimitive>): ParticipantsFieldValue {
    return new ParticipantsFieldValue(fieldId, fieldType, payload.userIds, ObjectState.UNCHANGED);
  }

  changeUserIds = (userIds: number[]): void => {
    this.userIds = userIds;

    this.calculateStateAfterUpdate();
  };

  toDto = (): FieldValueDto<ParticipantsFieldValuePrimitive> => {
    return this.toDtoWithPayload({ userIds: this.userIds });
  };

  filled = (): boolean => {
    // to prevent legacy errors (cases where userIds are undefined or null)
    return this.userIds?.length > 0;
  };
}
