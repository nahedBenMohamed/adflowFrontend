import { MultiselectModel, ObjectState, type FieldType } from '@/shared';
import { action, makeObservable, observable } from 'mobx';
import type { FieldValueDto } from '../../../../api';
import type { ColoredMultiselectFieldValuePrimitive } from '../../types';
import type { Field } from '../Field/Field';
import { FieldValue } from './FieldValue';

export class ColoredMultiselectFieldValue extends FieldValue<
  ColoredMultiselectFieldValuePrimitive,
  MultiselectModel<number>
> {
  optionIds: number[] = [];

  private constructor(
    fieldId: number,
    fieldType: FieldType,
    optionIds: number[],
    state: ObjectState
  ) {
    super({ fieldId, fieldType, state, model: MultiselectModel.create<number>(optionIds) });

    this.optionIds = optionIds;

    makeObservable(this, {
      state: true,
      optionIds: true,
      model: observable,
      changeState: action,
      changeOptionIds: action,
    });
  }

  static empty(field: Field): ColoredMultiselectFieldValue {
    return new ColoredMultiselectFieldValue(field.id, field.type, [], ObjectState.CREATED_EMPTY);
  }

  static fromDto({
    fieldId,
    fieldType,
    payload,
  }: FieldValueDto<ColoredMultiselectFieldValuePrimitive>): ColoredMultiselectFieldValue {
    return new ColoredMultiselectFieldValue(
      fieldId,
      fieldType,
      payload.optionIds,
      ObjectState.UNCHANGED
    );
  }

  changeOptionIds = (optionIds: number[]): void => {
    this.optionIds = optionIds;
    this.calculateStateAfterUpdate();
  };

  toDto = (): FieldValueDto<ColoredMultiselectFieldValuePrimitive> => {
    return this.toDtoWithPayload({ optionIds: this.optionIds });
  };

  filled = (): boolean => {
    // to prevent legacy errors (cases where optionIds are undefined or null)
    return this.optionIds?.length > 0;
  };
}
