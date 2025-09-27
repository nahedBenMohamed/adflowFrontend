import type { Nullable } from '@/shared';

export class MailMessagePayloadDto {
  id: number;
  mimeType: string;
  sortOrder: number;
  size: Nullable<number>;
  content: Nullable<string>;
  filename: Nullable<string>;
}
