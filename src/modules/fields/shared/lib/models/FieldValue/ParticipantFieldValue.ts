import { ObjectState, SelectModel, type FieldType, type Nullable } from '@/shared';
import { action, makeObservable, observable } from 'mobx';
import type { FieldValueDto } from '../../../../api';
import type { ParticipantFieldValuePrimitive } from '../../types';
import type { Field } from '../Field/Field';
import { FieldValue } from './FieldValue';

export class ParticipantFieldValue extends FieldValue<ParticipantFieldValuePrimitive, SelectModel> {
  value: Nullable<number> = null;

  private constructor(
    fieldId: number,
    fieldType: FieldType,
    value: Nullable<number>,
    state: ObjectState
  ) {
    super({ fieldId, fieldType, state, model: SelectModel.create(value) });

    this.value = value;

    makeObservable(this, {
      state: true,
      value: true,
      model: observable,
      changeState: action,
      changeValue: action,
    });
  }

  static create({
    field,
    value,
  }: {
    field: Field;
    value: Nullable<number>;
  }): ParticipantFieldValue {
    return new ParticipantFieldValue(field.id, field.type, value, ObjectState.CREATED);
  }

  static empty(field: Field): ParticipantFieldValue {
    return new ParticipantFieldValue(field.id, field.type, null, ObjectState.CREATED_EMPTY);
  }

  static fromDto({
    fieldId,
    fieldType,
    payload,
  }: FieldValueDto<ParticipantFieldValuePrimitive>): ParticipantFieldValue {
    return new ParticipantFieldValue(fieldId, fieldType, payload.value, ObjectState.UNCHANGED);
  }

  changeValue = (value: Nullable<number>): void => {
    this.value = value;

    this.calculateStateAfterUpdate();
  };

  toDto = (): FieldValueDto<ParticipantFieldValuePrimitive> => {
    return this.toDtoWithPayload({ value: this.value });
  };

  filled = (): boolean => {
    return Boolean(this.value);
  };
}
