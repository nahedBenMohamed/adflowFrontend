import type { Nullable } from '@/shared';

export interface FieldSettingsDto {
  fieldId: number;
  importantStageIds: Nullable<number[]>;
  requiredStageIds: Nullable<number[]>;
  excludeUserIds: Nullable<number[]>;
  readonlyUserIds: Nullable<number[]>;
  hideUserIds: Nullable<number[]>;
  hideStageIds: Nullable<number[]>;
}
