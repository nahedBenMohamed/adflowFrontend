import { InputModel, ObjectState, type FieldType, type Nullable } from '@/shared';
import { action, makeObservable, observable } from 'mobx';
import type { FieldValueDto } from '../../../../api';
import type { NumberFieldValuePrimitive } from '../../types';
import type { Field } from '../Field/Field';
import { FieldValue } from './FieldValue';

export class NumberFieldValue extends FieldValue<NumberFieldValuePrimitive, InputModel> {
  value: Nullable<number> = null;

  constructor(fieldId: number, fieldType: FieldType, value: Nullable<number>, state: ObjectState) {
    super({ fieldId, fieldType, state, model: InputModel.createFromNullableNumber(value) });

    this.value = value;

    makeObservable(this, {
      state: true,
      value: true,
      model: observable,
      changeState: action,
      changeValue: action,
    });
  }

  static empty(field: Field): NumberFieldValue {
    return new this(field.id, field.type, null, ObjectState.CREATED_EMPTY);
  }

  static fromDto({
    fieldId,
    fieldType,
    payload,
  }: FieldValueDto<NumberFieldValuePrimitive>): NumberFieldValue {
    return new this(fieldId, fieldType, payload.value, ObjectState.UNCHANGED);
  }

  changeValue = (value: Nullable<number>): void => {
    this.value = value;

    this.calculateStateAfterUpdate();
  };

  toDto = (): FieldValueDto<NumberFieldValuePrimitive> => {
    return this.toDtoWithPayload({ value: this.value });
  };

  filled = (): boolean => {
    // to prevent legacy errors (cases where value is undefined)
    return this.value !== null && this.value !== undefined;
  };
}
