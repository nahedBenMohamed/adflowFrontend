import { type Nullable } from '@/shared';

export interface FileLinkDto {
  id: number;
  fileId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  downloadUrl: string;
  previewUrl: Nullable<string>;
  createdAt: string;
  createdBy: number;
}
