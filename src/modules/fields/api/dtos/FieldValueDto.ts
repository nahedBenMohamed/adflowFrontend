import type { FieldType, ObjectState } from '@/shared';

export class FieldValueDto<Value> {
  state: ObjectState;
  fieldId: number;
  fieldType: FieldType;
  payload: Value;

  constructor({ state, fieldId, payload, fieldType }: FieldValueDto<Value>) {
    this.state = state;
    this.fieldId = fieldId;
    this.payload = payload;
    this.fieldType = fieldType;
  }
}
