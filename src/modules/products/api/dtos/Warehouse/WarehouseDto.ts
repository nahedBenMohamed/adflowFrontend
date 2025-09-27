import type { UserRights } from '@/shared';

export interface WarehouseDto {
  id: number;
  name: string;
  isDeleted: boolean;
  userRights: UserRights;
}
