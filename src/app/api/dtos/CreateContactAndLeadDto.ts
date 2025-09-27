import type { Nullable } from '@/shared';

export class CreateContactAndLeadDto {
  contactTypeId: number;
  leadTypeId: Nullable<number>;
  leadBoardId: Nullable<number>;

  constructor({ contactTypeId, leadTypeId, leadBoardId }: CreateContactAndLeadDto) {
    this.contactTypeId = contactTypeId;
    this.leadTypeId = leadTypeId;
    this.leadBoardId = leadBoardId;
  }
}
