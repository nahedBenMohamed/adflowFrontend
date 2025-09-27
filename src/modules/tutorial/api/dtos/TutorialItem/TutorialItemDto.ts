import type { Nullable } from '@/shared';
import type { TutorialItemProduct } from '../../../shared';

export interface TutorialItemDto {
  id: number;
  groupId: number;
  name: string;
  link: string;
  sortOrder: number;
  // null -> item is visible for all users
  userIds: Nullable<number[]>;
  products: Nullable<TutorialItemProduct[]>;
  createdAt: string;
}
