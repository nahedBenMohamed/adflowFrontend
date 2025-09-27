import type { Nullable } from '@/shared';
import type { TutorialItemDto } from '../TutorialItem/TutorialItemDto';

export interface TutorialGroupDto {
  id: number;
  name: string;
  sortOrder: number;
  items: Nullable<TutorialItemDto[]>;
}
