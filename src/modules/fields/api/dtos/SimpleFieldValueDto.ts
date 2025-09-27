import type { FieldType } from '@/shared';
import type { PossiblePrimitiveFieldValue } from '../../shared';

export class SimpleFieldValueDto {
  fieldId?: number;
  fieldName?: string;
  fieldType?: FieldType;
  payload?: PossiblePrimitiveFieldValue | unknown;

  constructor({ fieldId, fieldName, fieldType, payload }: SimpleFieldValueDto) {
    this.fieldId = fieldId;
    this.fieldName = fieldName;
    this.fieldType = fieldType;
    this.payload = payload;
  }
}
