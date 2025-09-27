import { ObjectState, SelectModel, UtcDate, type FieldType, type UtcDateValue } from '@/shared';
import { action, makeObservable, observable } from 'mobx';
import type { FieldValueDto } from '../../../../api';
import type { DateFieldValueDtoPrimitive, DateFieldValuePrimitive } from '../../types';
import type { Field } from '../Field/Field';
import { FieldValue } from './FieldValue';

export class DateFieldValue extends FieldValue<
  DateFieldValuePrimitive,
  SelectModel,
  DateFieldValueDtoPrimitive
> {
  value: UtcDateValue = null;

  constructor(fieldId: number, fieldType: FieldType, value: UtcDateValue, state: ObjectState) {
    super({ fieldId, fieldType, state, model: SelectModel.create(value) });

    this.value = value;

    makeObservable(this, {
      state: true,
      value: true,
      model: observable,
      changeValue: action,
      changeState: action,
    });
  }

  static empty(field: Field): DateFieldValue {
    return new DateFieldValue(field.id, field.type, null, ObjectState.CREATED_EMPTY);
  }

  static fromDto({
    fieldId,
    fieldType,
    payload,
  }: FieldValueDto<DateFieldValueDtoPrimitive>): DateFieldValue {
    return new DateFieldValue(
      fieldId,
      fieldType,
      payload.value ? UtcDate.parseISOWithoutUnix(payload.value) : null,
      ObjectState.UNCHANGED
    );
  }

  changeValue = (value: UtcDateValue): void => {
    this.value = value;

    this.calculateStateAfterUpdate();
  };

  toDto = (): FieldValueDto<DateFieldValueDtoPrimitive> => {
    return this.toDtoWithPayload({ value: this.value ? this.value.formatISOWithoutUnix() : null });
  };

  filled = (): boolean => {
    // to prevent legacy errors (cases where value is undefined)
    return this.value !== null && this.value !== undefined;
  };
}
