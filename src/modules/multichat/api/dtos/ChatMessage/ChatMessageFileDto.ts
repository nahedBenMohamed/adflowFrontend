import type { Nullable } from '@/shared';

export interface ChatMessageFileDto {
  id: number;
  fileId: Nullable<string>;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  downloadUrl: string;
}
