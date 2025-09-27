import { InputModel, ObjectState, type FieldType, type Nullable } from '@/shared';
import { action, makeObservable, observable } from 'mobx';
import type { FieldValueDto } from '../../../../api';
import type { LinkFieldValuePrimitive } from '../../types';
import type { Field } from '../Field/Field';
import { FieldValue } from './FieldValue';

export class LinkFieldValue extends FieldValue<LinkFieldValuePrimitive, InputModel> {
  value: string = '';

  constructor(fieldId: number, fieldType: FieldType, value: Nullable<string>, state: ObjectState) {
    super({ fieldId, fieldType, state, model: InputModel.create(value) });

    this.value = value || '';

    makeObservable(this, {
      state: true,
      value: true,
      model: observable,
      changeState: action,
      changeValue: action,
    });
  }

  static empty(field: Field): LinkFieldValue {
    return new LinkFieldValue(field.id, field.type, '', ObjectState.CREATED_EMPTY);
  }

  static fromDto({
    fieldId,
    fieldType,
    payload,
  }: FieldValueDto<LinkFieldValuePrimitive>): LinkFieldValue {
    return new LinkFieldValue(fieldId, fieldType, payload.value, ObjectState.UNCHANGED);
  }

  changeValue = (value: string): void => {
    this.value = value;
    this.calculateStateAfterUpdate();
  };

  toDto = (): FieldValueDto<LinkFieldValuePrimitive> => {
    return this.toDtoWithPayload({ value: this.value });
  };

  filled = (): boolean => {
    // although it should be initialized with an empty string we make optional
    // check to avoid any possible legacy errors
    return this.value?.length > 0;
  };
}
