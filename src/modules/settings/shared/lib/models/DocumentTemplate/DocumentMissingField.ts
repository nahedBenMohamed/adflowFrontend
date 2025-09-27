import { Field } from '@/modules/fields';
import type { CheckDocumentMissingFieldDto } from '../../../../api';

export class DocumentMissingField {
  entityTypeId: number;
  field: Field;

  constructor({ entityTypeId, field }: DocumentMissingField) {
    this.entityTypeId = entityTypeId;
    this.field = field;
  }

  static fromDto(dto: CheckDocumentMissingFieldDto): DocumentMissingField {
    return new DocumentMissingField({
      entityTypeId: dto.entityTypeId,
      field: Field.fromDto(dto.field),
    });
  }

  static fromDtos(dtos: CheckDocumentMissingFieldDto[]): DocumentMissingField[] {
    return dtos.map(this.fromDto);
  }
}
