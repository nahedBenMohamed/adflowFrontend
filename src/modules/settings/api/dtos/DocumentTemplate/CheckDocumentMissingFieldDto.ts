import type { FieldDto } from '@/modules/fields';

export class CheckDocumentMissingFieldDto {
  entityTypeId: number;
  field: FieldDto;

  constructor({ entityTypeId, field }: CheckDocumentMissingFieldDto) {
    this.entityTypeId = entityTypeId;
    this.field = field;
  }
}
