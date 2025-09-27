import type { Nullable, UserRole } from '@/shared';
import type { ObjectPermissionDto } from '../Permission/ObjectPermissionDto';

export interface UserDto {
  id: number;
  firstName: string;
  lastName: Nullable<string>;
  email: string;
  phone: Nullable<string>;
  role: UserRole;
  isActive: boolean;
  departmentId: Nullable<number>;
  avatarUrl: Nullable<string>;
  position: Nullable<string>;
  objectPermissions?: ObjectPermissionDto[];
  analyticsId: string;
  accessibleUserIds: number[];
  isPlatformAdmin?: boolean;
}
