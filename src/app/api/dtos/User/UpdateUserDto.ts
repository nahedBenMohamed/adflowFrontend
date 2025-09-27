import type { Nullable, User, UserRole } from '@/shared';
import type { ObjectPermissionDto } from '../Permission/ObjectPermissionDto';

export class UpdateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: Nullable<string>;
  password: Nullable<string>;
  role: UserRole;
  avatarUrl: Nullable<string>;
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
    avatarUrl,
    departmentId,
    position,
    objectPermissions,
    accessibleUserIds,
  }: UpdateUserDto) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.role = role;
    this.avatarUrl = avatarUrl;
    this.departmentId = departmentId;
    this.position = position;
    this.objectPermissions = objectPermissions;
    this.accessibleUserIds = accessibleUserIds;
  }

  static fromExistingUser(user: User): UpdateUserDto {
    return new UpdateUserDto({
      firstName: user.firstName,
      lastName: user.lastName || '',
      email: user.email,
      phone: user.phone,
      password: null,
      role: user.role,
      avatarUrl: user.avatarUrl,
      departmentId: user.departmentId,
      position: user.position,
      objectPermissions: user.objectPermissions,
      accessibleUserIds: user.accessibleUserIds,
    });
  }
}
