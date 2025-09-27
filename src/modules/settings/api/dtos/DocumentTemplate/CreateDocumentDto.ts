import type { Nullable } from '@/shared';
import type { DocumentType } from '../../../shared';

export class CreateDocumentDto {
  entityId: number;
  templateId: number;
  types: DocumentType[];
  orderId?: Nullable<number>;

  constructor({ entityId, templateId, types, orderId }: CreateDocumentDto) {
    this.entityId = entityId;
    this.templateId = templateId;
    this.types = types;
    this.orderId = orderId;
  }
}
