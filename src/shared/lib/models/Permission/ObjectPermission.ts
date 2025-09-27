import type { ObjectPermissionDto } from '@/app';
import type { Nullable } from '../../types';
import { PermissionLevel } from './PermissionLevel';
import type { PermissionObjectType } from './PermissionObjectType';

export class ObjectPermission {
  objectType: PermissionObjectType;
  objectId: Nullable<number>;
  createPermission: PermissionLevel;
  viewPermission: PermissionLevel;
  editPermission: PermissionLevel;
  deletePermission: PermissionLevel;
  reportPermission: PermissionLevel;
  dashboardPermission: PermissionLevel;

  constructor({
    objectType,
    objectId,
    createPermission,
    viewPermission,
    editPermission,
    deletePermission,
    reportPermission,
    dashboardPermission,
  }: {
    objectType: PermissionObjectType;
    objectId: Nullable<number>;
    createPermission: PermissionLevel;
    viewPermission: PermissionLevel;
    editPermission: PermissionLevel;
    deletePermission: PermissionLevel;
    reportPermission: PermissionLevel;
    dashboardPermission: PermissionLevel;
  }) {
    this.objectType = objectType;
    this.objectId = objectId;
    this.createPermission = createPermission;
    this.viewPermission = viewPermission;
    this.editPermission = editPermission;
    this.deletePermission = deletePermission;
    this.reportPermission = reportPermission;
    this.dashboardPermission = dashboardPermission;
  }

  static fromDto(dto: ObjectPermissionDto): ObjectPermission {
    return new ObjectPermission({
      objectId: dto.objectId,
      objectType: dto.objectType,
      viewPermission: dto.viewPermission,
      editPermission: dto.editPermission,
      createPermission: dto.createPermission,
      deletePermission: dto.deletePermission,
      reportPermission: dto.reportPermission,
      dashboardPermission: dto.dashboardPermission,
    });
  }

  static getDefaultAllowed(
    objectType: PermissionObjectType,
    objectId: Nullable<number>
  ): ObjectPermission {
    return new ObjectPermission({
      objectId,
      objectType,
      viewPermission: PermissionLevel.ALLOWED,
      editPermission: PermissionLevel.ALLOWED,
      createPermission: PermissionLevel.ALLOWED,
      deletePermission: PermissionLevel.ALLOWED,
      reportPermission: PermissionLevel.ALLOWED,
      dashboardPermission: PermissionLevel.ALLOWED,
    });
  }

  static getDefaultDenied(
    objectType: PermissionObjectType,
    objectId: Nullable<number>
  ): ObjectPermission {
    return new ObjectPermission({
      objectId,
      objectType,
      viewPermission: PermissionLevel.DENIED,
      editPermission: PermissionLevel.DENIED,
      createPermission: PermissionLevel.DENIED,
      deletePermission: PermissionLevel.DENIED,
      reportPermission: PermissionLevel.DENIED,
      dashboardPermission: PermissionLevel.DENIED,
    });
  }
}
