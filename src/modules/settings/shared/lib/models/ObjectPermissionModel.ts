import type { InputModel, Nullable, PermissionObjectType } from '@/shared';

export interface ObjectPermissionModel {
  view: InputModel;
  edit: InputModel;
  create: InputModel;
  delete: InputModel;
  report: InputModel;
  dashboard: InputModel;
  objectId: Nullable<number>;
  objectType: PermissionObjectType;
}
