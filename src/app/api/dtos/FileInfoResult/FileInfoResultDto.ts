import type { Nullable } from '@/shared';

export interface FileInfoResultDto {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  downloadUrl: Nullable<string>;
  previewUrl: Nullable<string>;
  createdAt: string;
}
