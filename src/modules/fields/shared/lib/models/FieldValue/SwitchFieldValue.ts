import { BooleanModel, ObjectState, type FieldType } from '@/shared';
import { action, makeObservable, observable } from 'mobx';
import type { FieldValueDto } from '../../../../api';
import type { SwitchFieldValuePrimitive } from '../../types';
import type { Field } from '../Field/Field';
import { FieldValue } from './FieldValue';

export class SwitchFieldValue extends FieldValue<SwitchFieldValuePrimitive, BooleanModel> {
  value: boolean = false;

  constructor(fieldId: number, fieldType: FieldType, value: boolean, state: ObjectState) {
    super({ fieldId, fieldType, state, model: BooleanModel.create(value) });

    this.value = value;

    makeObservable(this, {
      state: true,
      value: true,
      model: observable,
      changeValue: action,
      changeState: action,
    });
  }

  static empty(field: Field): SwitchFieldValue {
    return new SwitchFieldValue(field.id, field.type, false, ObjectState.CREATED_EMPTY);
  }

  static fromDto({
    fieldId,
    fieldType,
    payload,
  }: FieldValueDto<SwitchFieldValuePrimitive>): SwitchFieldValue {
    return new SwitchFieldValue(fieldId, fieldType, payload.value, ObjectState.UNCHANGED);
  }

  changeValue = (value: boolean): void => {
    this.value = value;

    this.calculateStateAfterUpdate();
  };

  toDto = (): FieldValueDto<SwitchFieldValuePrimitive> => {
    return this.toDtoWithPayload({ value: this.value });
  };

  filled = (): boolean => {
    return this.value;
  };
}
