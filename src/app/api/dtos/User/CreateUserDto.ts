import type { Nullable, UserRole } from '@/shared';
import type { ObjectPermissionDto } from '../Permission/ObjectPermissionDto';

export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: Nullable<string>;
  password: string;
  role: UserRole;
  departmentId: Nullable<number>;
  position: Nullable<string>;
  objectPermissions: ObjectPermissionDto[];
  accessibleUserIds?: Nullable<number[]>;

  constructor({
    firstName,
    lastName,
    email,
    phone,
    password,
    role,
    departmentId,
    position,
    objectPermissions,
    accessibleUserIds,
  }: CreateUserDto) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.role = role;
    this.departmentId = departmentId;
    this.position = position;
    this.objectPermissions = objectPermissions;
    this.accessibleUserIds = accessibleUserIds;
  }
}
