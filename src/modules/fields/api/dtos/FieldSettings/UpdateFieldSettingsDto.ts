import type { Nullable } from '@/shared';

export class UpdateFieldSettingsDto {
  importantStageIds: Nullable<number[]>;
  requiredStageIds: Nullable<number[]>;
  excludeUserIds: Nullable<number[]>;
  readonlyUserIds: Nullable<number[]>;
  hideUserIds: Nullable<number[]>;
  hideStageIds: Nullable<number[]>;

  constructor({
    importantStageIds,
    requiredStageIds,
    excludeUserIds,
    readonlyUserIds,
    hideUserIds,
    hideStageIds,
  }: UpdateFieldSettingsDto) {
    this.importantStageIds = importantStageIds;
    this.requiredStageIds = requiredStageIds;
    this.excludeUserIds = excludeUserIds;
    this.readonlyUserIds = readonlyUserIds;
    this.hideUserIds = hideUserIds;
    this.hideStageIds = hideStageIds;
  }
}
