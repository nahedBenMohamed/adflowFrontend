import type { Nullable } from '@/shared';

export interface SiteFormEntityTypeDto {
  entityTypeId: number;
  boardId: Nullable<number>;
  isMain: boolean;
}
