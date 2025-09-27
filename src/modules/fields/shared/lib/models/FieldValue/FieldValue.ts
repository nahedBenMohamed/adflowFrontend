import { ObjectState, type FieldType } from '@/shared';
import { FieldValueDto } from '../../../../api';

export abstract class FieldValue<Value, Model, DtoValue = Value> {
  fieldId: number;
  state: ObjectState;
  fieldType: FieldType;
  model: Model;

  constructor({
    fieldId,
    fieldType,
    state,
    model,
  }: {
    fieldId: number;
    fieldType: FieldType;
    state: ObjectState;
    model: Model;
  }) {
    this.fieldId = fieldId;
    this.state = state;
    this.fieldType = fieldType;
    this.model = model;
  }

  abstract toDto(): FieldValueDto<DtoValue>;

  abstract filled(): boolean;

  toDtoWithPayload = (payload: DtoValue): FieldValueDto<DtoValue> => {
    return new FieldValueDto({
      payload,
      state: this.state,
      fieldId: this.fieldId,
      fieldType: this.fieldType,
    });
  };

  calculateStateAfterUpdate = (): void => {
    if (this.state === ObjectState.CREATED_EMPTY) this.state = ObjectState.CREATED;

    if ([ObjectState.UNCHANGED, ObjectState.DELETED].includes(this.state))
      this.state = ObjectState.UPDATED;
  };

  changeState = (state: ObjectState): void => {
    this.state = state;
  };

  isCommittable = (): boolean => {
    return [ObjectState.CREATED, ObjectState.UPDATED, ObjectState.DELETED].includes(this.state);
  };
}
