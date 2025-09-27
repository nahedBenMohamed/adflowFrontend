import type { UserDto } from '@/app';
import { makeAutoObservable } from 'mobx';
import type { Nullable } from '../../types';
import { ObjectPermission } from '../Permission/ObjectPermission';
import { PermissionLevel } from '../Permission/PermissionLevel';
import type { PermissionObjectType } from '../Permission/PermissionObjectType';
import { Avatar } from './Avatar';
import { UserRole } from './UserRole';

export class User {
  id: number;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: Nullable<string>;
  isActive: boolean;
  analyticsId: string;
  phone: Nullable<string>;
  position: Nullable<string>;
  avatarUrl: Nullable<string>;
  departmentId: Nullable<number> = null;
  isPlatformAdmin?: boolean;

  objectPermissions: ObjectPermission[];
  // Empty array means that all users are accessible
  accessibleUserIds: number[] = [];

  constructor({
    id,
    role,
    email,
    phone,
    lastName,
    isActive,
    position,
    firstName,
    avatarUrl,
    analyticsId,
    isPlatformAdmin,
    departmentId = null,
    objectPermissions,
    accessibleUserIds = [],
  }: {
    id: number;
    email: string;
    role: UserRole;
    firstName: string;
    isActive: boolean;
    analyticsId: string;
    phone: Nullable<string>;
    isPlatformAdmin?: boolean;
    lastName: Nullable<string>;
    position: Nullable<string>;
    avatarUrl: Nullable<string>;
    accessibleUserIds: number[];
    departmentId: Nullable<number>;
    objectPermissions: ObjectPermission[];
  }) {
    this.id = id;
    this.role = role;
    this.email = email;
    this.phone = phone;
    this.lastName = lastName;
    this.isActive = isActive;
    this.position = position;
    this.firstName = firstName;
    this.avatarUrl = avatarUrl;
    this.analyticsId = analyticsId;
    this.departmentId = departmentId;
    this.isPlatformAdmin = isPlatformAdmin;
    this.objectPermissions = objectPermissions;
    this.accessibleUserIds = accessibleUserIds;

    makeAutoObservable(this);
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  static fromDto(dto: UserDto): User {
    const objectPermissions = dto.objectPermissions
      ? dto.objectPermissions.map(ObjectPermission.fromDto)
      : [];

    return new User({
      id: dto.id,
      role: dto.role,
      email: dto.email,
      phone: dto.phone,
      objectPermissions,
      lastName: dto.lastName,
      isActive: dto.isActive,
      position: dto.position,
      firstName: dto.firstName,
      avatarUrl: dto.avatarUrl,
      analyticsId: dto.analyticsId,
      departmentId: dto.departmentId,
      isPlatformAdmin: dto.isPlatformAdmin,
      accessibleUserIds: dto.accessibleUserIds,
    });
  }

  static fromDtos(dtos: UserDto[]): User[] {
    return dtos.map(User.fromDto);
  }

  isAdmin = (): boolean => this.role === UserRole.ADMIN || this.role === UserRole.OWNER;

  isOwner = (): boolean => this.role === UserRole.OWNER;

  isPartner = (): boolean => this.role === UserRole.PARTNER;

  getPermission = (
    objectType: PermissionObjectType,
    objectId: Nullable<number> = null
  ): ObjectPermission => {
    const permission =
      this.objectPermissions.find(op => op.objectType === objectType && op.objectId === objectId) ??
      ObjectPermission.getDefaultDenied(objectType, objectId);

    return permission;
  };

  canCreate = (objectType: PermissionObjectType, objectId: Nullable<number> = null): boolean => {
    if (this.isAdmin()) return true;

    const permission = this.getPermission(objectType, objectId);

    return permission.createPermission !== PermissionLevel.DENIED;
  };

  canEdit = (objectType: PermissionObjectType, objectId: Nullable<number> = null): boolean => {
    if (this.isAdmin()) return true;

    const permission = this.getPermission(objectType, objectId);

    return permission.editPermission !== PermissionLevel.DENIED;
  };

  canView = (objectType: PermissionObjectType, objectId: Nullable<number> = null): boolean => {
    if (this.isAdmin()) return true;

    const permission = this.getPermission(objectType, objectId);

    return permission.viewPermission !== PermissionLevel.DENIED;
  };

  canDelete = (objectType: PermissionObjectType, objectId: Nullable<number> = null): boolean => {
    if (this.isAdmin()) return true;

    const permission = this.getPermission(objectType, objectId);

    return permission.deletePermission !== PermissionLevel.DENIED;
  };

  canViewReport = (
    objectType: PermissionObjectType,
    objectId: Nullable<number> = null
  ): boolean => {
    if (this.isAdmin()) return true;

    const permission = this.getPermission(objectType, objectId);

    return permission.reportPermission !== PermissionLevel.DENIED;
  };

  canViewDashboard = (
    objectType: PermissionObjectType,
    objectId: Nullable<number> = null
  ): boolean => {
    if (this.isAdmin()) return true;

    const permission = this.getPermission(objectType, objectId);

    return permission.dashboardPermission !== PermissionLevel.DENIED;
  };

  getAvatar = (): Avatar => {
    return new Avatar({
      lastName: this.lastName,
      avatarUrl: this.avatarUrl,
      firstName: this.firstName,
    });
  };
}
