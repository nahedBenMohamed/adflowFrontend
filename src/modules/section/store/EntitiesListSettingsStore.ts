import { frontendObjectsApi, watchdogStore } from '@/app';
import type { DataStore, FrontendObject, Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { type EntityListSettings, generateEntitiesListSettingsObjStorageKey } from '../shared';

export class EntitiesListSettingsStore implements DataStore {
  readonly _objectStorageKey: string;

  settingsFrontendObject: Nullable<FrontendObject<EntityListSettings>> = null;

  isLoaded = false;
  isUpdating = false;

  constructor({
    entityTypeId,
    boardId = null,
  }: {
    entityTypeId: number;
    boardId: Nullable<number>;
  }) {
    this._objectStorageKey = generateEntitiesListSettingsObjStorageKey({
      entityTypeId,
      boardId,
    });

    watchdogStore.watch(this);
    makeAutoObservable(this);
  }

  loadData = async (): Promise<void> => {
    try {
      this.isLoaded = false;

      this.settingsFrontendObject = await frontendObjectsApi.getFrontendObject<EntityListSettings>(
        this._objectStorageKey
      );
    } catch (e) {
      throw new Error(`Failed to load list settings by key ${this._objectStorageKey}: ${e}`);
    } finally {
      this.isLoaded = true;
    }
  };

  upsertSettings = async (settings: EntityListSettings): Promise<void> => {
    try {
      this.isUpdating = true;

      this.settingsFrontendObject =
        await frontendObjectsApi.upsertFrontendObject<EntityListSettings>({
          key: this._objectStorageKey,
          value: settings,
        });
    } catch (e) {
      throw new Error(`Failed to upsert list settings by key ${this._objectStorageKey}: ${e}`);
    } finally {
      this.isUpdating = false;
    }
  };

  reset = (): void => {
    this.settingsFrontendObject = null;
  };
}
