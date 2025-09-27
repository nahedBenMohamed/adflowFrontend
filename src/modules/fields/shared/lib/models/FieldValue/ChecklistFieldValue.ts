import { CheckedInputModel, FieldType, ObjectState } from '@/shared';
import { action, makeObservable, observable, type IObservableArray } from 'mobx';
import type { FieldValueDto } from '../../../../api';
import type { ChecklistFieldPayloadItem, ChecklistFieldValuePrimitive } from '../../types';
import type { Field } from '../Field/Field';
import { FieldValue } from './FieldValue';

export class ChecklistFieldValue extends FieldValue<
  ChecklistFieldValuePrimitive,
  IObservableArray<CheckedInputModel>
> {
  value: ChecklistFieldPayloadItem[] = [];

  constructor(
    fieldId: number,
    fieldType: FieldType,
    value: ChecklistFieldPayloadItem[] = [],
    state: ObjectState
  ) {
    super({
      state,
      fieldId,
      fieldType,
      // https://mobx.js.org/api.html#observablearray
      model: observable.array(
        Array.isArray(value) && value.length
          ? value.map<CheckedInputModel>(v => CheckedInputModel.create(v))
          : [CheckedInputModel.create()]
      ),
    });

    // There is a usual error where API users makes values an empty string or other non-array type so we need to add this for safety and to make sure frontend won't break
    this.value = Array.isArray(value) ? value : [];

    makeObservable(this, {
      state: true,
      value: true,
      model: observable,
      changeState: action,
      changeValues: action,
    });
  }

  static empty(field: Field): ChecklistFieldValue {
    return new this(field.id, field.type, [], ObjectState.CREATED_EMPTY);
  }

  static fromDto({
    fieldId,
    fieldType,
    payload,
  }: FieldValueDto<ChecklistFieldValuePrimitive>): ChecklistFieldValue {
    return new this(fieldId, fieldType, payload.value, ObjectState.UNCHANGED);
  }

  toDto = (): FieldValueDto<ChecklistFieldValuePrimitive> => {
    return this.toDtoWithPayload({ value: this.value });
  };

  changeValues = (values: ChecklistFieldPayloadItem[]): void => {
    this.value = values;

    this.calculateStateAfterUpdate();
  };

  addOption = (): void => {
    this.model.push(CheckedInputModel.create());
  };

  clearEmptyModels = (): void => {
    // we allow to have one empty model (for proper possible indicators display)
    if (this.model.length === 1) return;

    this.model.replace(this.model.filter(m => m.text.value.length > 0));
  };

  filled = (): boolean => {
    // to prevent legacy errors (cases where values are undefined or null)
    return this.value?.length > 0;
  };
}
