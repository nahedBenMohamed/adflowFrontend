import type { FileLinkDto } from '@/app';

export interface NoteDto {
  id: number;
  entityId: number;
  createdAt: string;
  createdBy: number;
  text: string;
  fileLinks: FileLinkDto[];
}
