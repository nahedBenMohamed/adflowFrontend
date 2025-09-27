import type { Nullable } from '@/shared';
import type { FieldSettingsDto } from '../../../../api';

export class FieldSettings {
  fieldId: number;
  importantStageIds: Nullable<number[]>;
  requiredStageIds: Nullable<number[]>;
  excludeUserIds: Nullable<number[]>;
  readonlyUserIds: Nullable<number[]>;
  hideUserIds: Nullable<number[]>;
  hideStageIds: Nullable<number[]>;

  constructor({
    fieldId,
    importantStageIds,
    requiredStageIds,
    excludeUserIds,
    readonlyUserIds,
    hideUserIds,
    hideStageIds,
  }: {
    fieldId: number;
    importantStageIds: Nullable<number[]>;
    requiredStageIds: Nullable<number[]>;
    excludeUserIds: Nullable<number[]>;
    readonlyUserIds: Nullable<number[]>;
    hideUserIds: Nullable<number[]>;
    hideStageIds: Nullable<number[]>;
  }) {
    this.fieldId = fieldId;
    this.importantStageIds = importantStageIds;
    this.requiredStageIds = requiredStageIds;
    this.excludeUserIds = excludeUserIds;
    this.readonlyUserIds = readonlyUserIds;
    this.hideUserIds = hideUserIds;
    this.hideStageIds = hideStageIds;
  }

  static empty(fieldId: number): FieldSettings {
    return new FieldSettings({
      fieldId,
      importantStageIds: null,
      requiredStageIds: null,
      excludeUserIds: null,
      readonlyUserIds: null,
      hideUserIds: null,
      hideStageIds: null,
    });
  }

  static fromDto(dto: FieldSettingsDto): FieldSettings {
    return new FieldSettings({
      fieldId: dto.fieldId,
      importantStageIds: dto.importantStageIds,
      requiredStageIds: dto.requiredStageIds,
      excludeUserIds: dto.excludeUserIds,
      readonlyUserIds: dto.readonlyUserIds,
      hideUserIds: dto.hideUserIds,
      hideStageIds: dto.hideStageIds,
    });
  }

  static fromDtos(dtos: FieldSettingsDto[]): FieldSettings[] {
    return dtos.map(FieldSettings.fromDto);
  }

  showMandatoryIndicator = (currentStageId: number): boolean => {
    return Boolean(this.requiredStageIds?.includes(currentStageId));
  };

  showImportantIndicator = ({
    currentStageId,
    currentUserId,
  }: {
    currentStageId: number;
    currentUserId: number;
  }): boolean => {
    return Boolean(
      this.importantStageIds?.includes(currentStageId) &&
        !this.excludeUserIds?.includes(currentUserId)
    );
  };

  readonly = (currentUserId: number): boolean => {
    return Boolean(this.readonlyUserIds?.includes(currentUserId));
  };

  hideField = (currentUserId: number): boolean => {
    return Boolean(this.hideUserIds?.includes(currentUserId));
  };

  hideFieldOnStage = (currentStageId: number): boolean => {
    return Boolean(this.hideStageIds?.includes(currentStageId));
  };
}
