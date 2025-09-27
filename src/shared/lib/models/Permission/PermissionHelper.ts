import { PermissionLevel } from './PermissionLevel';

const PermissionWeight = new Map([
  [PermissionLevel.DENIED, 0],
  [PermissionLevel.RESPONSIBLE, 1],
  [PermissionLevel.SUBDEPARTMENT, 2],
  [PermissionLevel.DEPARTMENT, 3],
  [PermissionLevel.ALLOWED, 4],
]);

export class PermissionHelper {
  static isBigger(permission1: PermissionLevel, permission2: PermissionLevel): boolean {
    const permission1Weight = PermissionWeight.get(permission1) ?? 0;
    const permission2Weight = PermissionWeight.get(permission2) ?? 0;

    return permission1Weight > permission2Weight;
  }
}
