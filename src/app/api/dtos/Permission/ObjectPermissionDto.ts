import { type Nullable, PermissionLevel, type PermissionObjectType } from '@/shared';

export class ObjectPermissionDto {
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
  }: ObjectPermissionDto) {
    this.objectType = objectType;
    this.objectId = objectId;
    this.createPermission = createPermission;
    this.viewPermission = viewPermission;
    this.editPermission = editPermission;
    this.deletePermission = deletePermission;
    this.reportPermission = reportPermission;
    this.dashboardPermission = dashboardPermission;
  }

  static createAllAllowed({
    objectId,
    objectType,
  }: {
    objectId: Nullable<number>;
    objectType: PermissionObjectType;
  }): ObjectPermissionDto {
    return new ObjectPermissionDto({
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

  static createAllDenied({
    objectId,
    objectType,
  }: {
    objectId: Nullable<number>;
    objectType: PermissionObjectType;
  }): ObjectPermissionDto {
    return new ObjectPermissionDto({
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
