import { frontendObjectsApi, watchdogStore } from '@/app';
import type { DataStore, FrontendObject, Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import {
  generateGeneralReportSettingsObjStorageKey,
  type GeneralReportSettings,
  type GeneralReportType,
} from '../shared';

export class GeneralReportTemplateSettingsStore implements DataStore {
  readonly _objectStorageKey: string;

  settingsFrontendObject: Nullable<FrontendObject<GeneralReportSettings>> = null;

  isLoaded = false;
  isUpdating = false;

  constructor({
    entityTypeId,
    reportType,
  }: {
    entityTypeId: number;
    reportType: GeneralReportType;
  }) {
    this._objectStorageKey = generateGeneralReportSettingsObjStorageKey({
      reportType,
      entityTypeId,
    });

    watchdogStore.watch(this);
    makeAutoObservable(this);
  }

  loadData = async (): Promise<void> => {
    try {
      this.isLoaded = false;

      this.settingsFrontendObject =
        await frontendObjectsApi.getFrontendObject<GeneralReportSettings>(this._objectStorageKey);
    } catch (e) {
      throw new Error(
        `Failed to load general report settings by key ${this._objectStorageKey}: ${e}`
      );
    } finally {
      this.isLoaded = true;
    }
  };

  upsertSettings = async (settings: GeneralReportSettings): Promise<void> => {
    try {
      this.isUpdating = true;

      this.settingsFrontendObject =
        await frontendObjectsApi.upsertFrontendObject<GeneralReportSettings>({
          key: this._objectStorageKey,
          value: settings,
        });
    } catch (e) {
      throw new Error(
        `Failed to upsert general report settings by key ${this._objectStorageKey}: ${e}`
      );
    } finally {
      this.isUpdating = false;
    }
  };

  reset = (): void => {
    this.settingsFrontendObject = null;
  };
}
