import { watchdogStore } from '@/app';
import type { DataStore, Optional } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { fieldsSettingsApi } from '../../api';
import type { FieldSettings } from '../../shared';
import { FieldSettingsForm } from './FieldSettingsForm';

export class FieldSettingsStore implements DataStore {
  entityTypeId: number;

  fieldsSettings: FieldSettings[] = [];
  fieldsSettingsForms: FieldSettingsForm[] = [];

  isLoading = false;

  constructor(entityTypeId: number) {
    this.entityTypeId = entityTypeId;

    watchdogStore.watch(this);
    makeAutoObservable(this);
  }

  initializeFieldSettingsForms = (fieldSettings: FieldSettings[]): void => {
    this.fieldsSettingsForms = fieldSettings.map<FieldSettingsForm>(
      fs => new FieldSettingsForm(fs)
    );
  };

  loadData = async (): Promise<void> => {
    try {
      this.isLoading = true;

      this.fieldsSettings = await fieldsSettingsApi.getFieldSettings(this.entityTypeId);

      this.initializeFieldSettingsForms(this.fieldsSettings);
    } catch (e) {
      throw new Error(`Failed to load field settings: ${e}`);
    } finally {
      this.isLoading = false;
    }
  };

  findFieldSettingsFormById = (fieldId: number): Optional<FieldSettingsForm> => {
    return this.fieldsSettingsForms.find(fs => fs.fieldId === fieldId);
  };

  findFieldSettingsById = (fieldId: number): Optional<FieldSettings> => {
    return this.fieldsSettings.find(fs => fs.fieldId === fieldId);
  };

  updateFieldSettings = async (fieldId: number): Promise<void> => {
    try {
      const fieldSettingsForm = this.findFieldSettingsFormById(fieldId);

      if (!fieldSettingsForm)
        throw new Error(`Field settings form for field with id ${fieldId} were not found`);

      const updatedFieldSettings = await fieldsSettingsApi.updateFieldSettings({
        fieldId,
        entityTypeId: this.entityTypeId,
        dto: fieldSettingsForm.updateFieldSettingsDto,
      });

      this.fieldsSettings = this.fieldsSettings.map(fs => {
        if (fs.fieldId === fieldId) return updatedFieldSettings;

        return fs;
      });

      this.initializeFieldSettingsForms(this.fieldsSettings);
    } catch (e) {
      throw new Error(`Failed to update field settings: ${e}`);
    }
  };

  clearFieldSettingsForm = (fieldId: number): void => {
    const fieldSettings = this.findFieldSettingsById(fieldId);

    if (!fieldSettings)
      throw new Error(
        `Failed to clear field settings form, field settings with id ${fieldId} were not found`
      );

    this.fieldsSettingsForms = this.fieldsSettingsForms.map<FieldSettingsForm>(f =>
      f.fieldId === fieldId ? new FieldSettingsForm(fieldSettings) : f
    );
  };

  getAllMandatoryFieldsIds = (currentStageId: number): number[] => {
    return this.fieldsSettings
      .filter(fs => fs.showMandatoryIndicator(currentStageId))
      .map<number>(fs => fs.fieldId);
  };

  reset = (): void => {
    this.fieldsSettings = [];
  };
}
