import { type Nullable } from '@/shared';

export interface TopSellerData {
  avatar: Nullable<string>;
  initials: Nullable<string>;
  userName: Nullable<string>;
  percent: number;
  value: number;
}
