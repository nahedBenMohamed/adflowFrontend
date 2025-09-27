import { InputModel, ObjectState, type FieldType, type Nullable } from '@/shared';
import { action, makeObservable, observable } from 'mobx';
import type { FieldValueDto } from '../../../../api';
import type { TextFieldValuePrimitive } from '../../types';
import type { Field } from '../Field/Field';
import { FieldValue } from './FieldValue';

export class TextFieldValue extends FieldValue<TextFieldValuePrimitive, InputModel> {
  value: string = '';

  constructor(fieldId: number, fieldType: FieldType, value: Nullable<string>, state: ObjectState) {
    super({ fieldId, fieldType, state, model: InputModel.create(value) });

    this.value = value || '';

    makeObservable(this, {
      state: true,
      value: true,
      model: observable,
      changeValue: action,
      changeState: action,
    });
  }

  static empty(field: Field): TextFieldValue {
    return new TextFieldValue(field.id, field.type, '', ObjectState.CREATED_EMPTY);
  }

  static fromDto({
    fieldId,
    fieldType,
    payload,
  }: FieldValueDto<TextFieldValuePrimitive>): TextFieldValue {
    return new TextFieldValue(fieldId, fieldType, payload.value, ObjectState.UNCHANGED);
  }

  changeValue = (value: string): void => {
    this.value = value;

    this.calculateStateAfterUpdate();
  };

  changeModelValue = (value: string): void => {
    this.model.setValue(value);

    this.changeValue(value);
  };

  toDto = (): FieldValueDto<TextFieldValuePrimitive> => {
    return this.toDtoWithPayload({ value: this.value });
  };

  filled = (): boolean => {
    // although it should be initialized with an empty string we make optional
    // check to avoid any possible legacy errors
    return this.value?.length > 0;
  };
}
