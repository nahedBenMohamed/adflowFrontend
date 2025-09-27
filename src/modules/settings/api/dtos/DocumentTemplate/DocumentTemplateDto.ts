import type { FileLinkDto } from '@/app';

export interface DocumentTemplateDto {
  id: number;
  name: string;
  createdBy: number;
  file: FileLinkDto;
  accessibleBy: number[];
  entityTypeIds: number[];
}
