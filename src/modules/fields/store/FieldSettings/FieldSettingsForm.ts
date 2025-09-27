import { MultiselectModel } from '@/shared';
import { computed, makeAutoObservable } from 'mobx';
import { UpdateFieldSettingsDto } from '../../api';
import type { FieldSettings } from '../../shared';

export class FieldSettingsForm {
  fieldId: number;

  hideUserIds: MultiselectModel<number>;
  hideStageIds: MultiselectModel<number>;
  excludeUserIds: MultiselectModel<number>;
  readonlyUserIds: MultiselectModel<number>;
  requiredStageIds: MultiselectModel<number>;
  importantStageIds: MultiselectModel<number>;

  constructor(fieldSettings: FieldSettings) {
    this.fieldId = fieldSettings.fieldId;

    this.hideUserIds = MultiselectModel.createFromNullable<number>(fieldSettings.hideUserIds);
    this.hideStageIds = MultiselectModel.createFromNullable<number>(fieldSettings.hideStageIds);
    this.excludeUserIds = MultiselectModel.createFromNullable<number>(fieldSettings.excludeUserIds);
    this.readonlyUserIds = MultiselectModel.createFromNullable<number>(
      fieldSettings.readonlyUserIds
    );
    this.requiredStageIds = MultiselectModel.createFromNullable<number>(
      fieldSettings.requiredStageIds
    );
    this.importantStageIds = MultiselectModel.createFromNullable<number>(
      fieldSettings.importantStageIds
    );

    makeAutoObservable(this);
  }

  get updateFieldSettingsDto(): UpdateFieldSettingsDto {
    return new UpdateFieldSettingsDto({
      hideUserIds: this.hideUserIds.values,
      hideStageIds: this.hideStageIds.values,
      excludeUserIds: this.excludeUserIds.values,
      readonlyUserIds: this.readonlyUserIds.values,
      requiredStageIds: this.requiredStageIds.values,
      importantStageIds: this.importantStageIds.values,
    });
  }

  @computed.struct
  someSettingsApplied = (): boolean => {
    return (
      this.hideUserIds.values.length > 0 ||
      this.hideStageIds.values.length > 0 ||
      this.excludeUserIds.values.length > 0 ||
      this.readonlyUserIds.values.length > 0 ||
      this.importantStageIds.values.length > 0 ||
      this.requiredStageIds.values.length > 0
    );
  };
}
