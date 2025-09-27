import type { User } from '@/shared';
import type { SalesPlan } from './SalesPlan';

export interface SalesPlanWithUser extends SalesPlan {
  user: User;
}
