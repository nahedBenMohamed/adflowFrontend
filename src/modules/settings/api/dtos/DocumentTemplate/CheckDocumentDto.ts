import type { Nullable } from '@/shared';

export class CheckDocumentDto {
  entityId: number;
  templateId: number;
  orderId?: Nullable<number>;

  constructor({ entityId, templateId, orderId }: CheckDocumentDto) {
    this.entityId = entityId;
    this.templateId = templateId;
    this.orderId = orderId;
  }
}
