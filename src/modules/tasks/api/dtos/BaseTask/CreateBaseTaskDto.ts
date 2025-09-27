import type { Nullable } from '@/shared';

export interface CreateBaseTaskDto {
  responsibleUserId: number;
  startDate: Nullable<string>;
  endDate: Nullable<string>;
  text: string;
  fileIds: string[];
}
