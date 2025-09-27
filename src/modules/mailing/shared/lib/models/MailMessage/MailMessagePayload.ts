import { type Nullable } from '@/shared';
import { type MailMessagePayloadDto } from '../../../../api';

export class MailMessagePayload {
  id: number;
  mimeType: string;
  filename: Nullable<string>;
  content: Nullable<string>;
  size: Nullable<number>;
  sortOrder: number;

  constructor({ id, mimeType, filename, content, size, sortOrder }: MailMessagePayload) {
    this.id = id;
    this.mimeType = mimeType;
    this.filename = filename;
    this.content = content;
    this.size = size;
    this.sortOrder = sortOrder;
  }

  static fromDto(dto: MailMessagePayloadDto): MailMessagePayload {
    return new MailMessagePayload({
      id: dto.id,
      mimeType: dto.mimeType,
      filename: dto.filename,
      content: dto.content,
      size: dto.size,
      sortOrder: dto.sortOrder,
    });
  }

  static fromDtos(dtos: MailMessagePayloadDto[]): MailMessagePayload[] {
    return dtos.map(this.fromDto);
  }
}
