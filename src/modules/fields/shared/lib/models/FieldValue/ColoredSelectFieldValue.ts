import { ObjectState, SelectModel, type FieldType, type Nullable } from '@/shared';
import { action, makeObservable, observable } from 'mobx';
import type { FieldValueDto } from '../../../../api';
import type { ColoredSelectFieldValuePrimitive } from '../../types';
import type { Field } from '../Field/Field';
import { FieldValue } from './FieldValue';

export class ColoredSelectFieldValue extends FieldValue<
  ColoredSelectFieldValuePrimitive,
  SelectModel
> {
  optionId: Nullable<number> = null;

  private constructor(
    fieldId: number,
    fieldType: FieldType,
    optionId: Nullable<number>,
    state: ObjectState
  ) {
    super({ fieldId, fieldType, state, model: SelectModel.create(optionId) });

    this.optionId = optionId;

    makeObservable(this, {
      state: true,
      optionId: true,
      model: observable,
      changeState: action,
      changeOptionId: action,
    });
  }

  static empty(field: Field): ColoredSelectFieldValue {
    return new ColoredSelectFieldValue(field.id, field.type, null, ObjectState.CREATED_EMPTY);
  }

  static fromDto({
    fieldId,
    fieldType,
    payload,
  }: FieldValueDto<ColoredSelectFieldValuePrimitive>): ColoredSelectFieldValue {
    return new ColoredSelectFieldValue(fieldId, fieldType, payload.optionId, ObjectState.UNCHANGED);
  }

  changeOptionId = (optionId: Nullable<number>): void => {
    this.optionId = optionId;

    this.calculateStateAfterUpdate();
  };

  toDto = (): FieldValueDto<ColoredSelectFieldValuePrimitive> => {
    return this.toDtoWithPayload({ optionId: this.optionId });
  };

  filled = (): boolean => {
    // to prevent legacy errors (cases where optionId is undefined)
    return this.optionId !== null && this.optionId !== undefined;
  };
}
