import {
  wazzupProviderSettingsApi,
  type CreateWazzupProviderDto,
  type UpdateWazzupProviderDto,
  type WazzupProvider,
} from '@/modules/multichat';
import { makeAutoObservable } from 'mobx';

class WazzupProviderSettingsStore {
  providersSettings: WazzupProvider[] = [];

  areProvidersSettingsLoaded = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadData = async (): Promise<void> => {
    try {
      this.areProvidersSettingsLoaded = false;

      this.providersSettings = await wazzupProviderSettingsApi.getWazzupProvidersSettings();
    } catch (e) {
      throw new Error(`Failed to load wazzup providers settings: ${e}`);
    } finally {
      this.areProvidersSettingsLoaded = true;
    }
  };

  loadProviderSettingsById = async (providerId: number): Promise<WazzupProvider> => {
    return await wazzupProviderSettingsApi.getWazzupProviderSettings(providerId);
  };

  deleteProviderSettings = async (providerId: number): Promise<void> => {
    await wazzupProviderSettingsApi.deleteWazzupProviderSettings(providerId);

    this.providersSettings = this.providersSettings.filter(p => p.id !== providerId);
  };

  createProviderSettings = async (dto: CreateWazzupProviderDto): Promise<void> => {
    const createdSettings = await wazzupProviderSettingsApi.createWazzupProviderSettings(dto);

    this.providersSettings = [...this.providersSettings, createdSettings];
  };

  updateProviderSettings = async ({
    providerId,
    dto,
  }: {
    providerId: number;
    dto: UpdateWazzupProviderDto;
  }): Promise<void> => {
    const updatedSettings = await wazzupProviderSettingsApi.updateWazzupProviderSettings({
      providerId,
      dto,
    });

    this.providersSettings = this.providersSettings.map<WazzupProvider>(p =>
      p.id === updatedSettings.id ? updatedSettings : p
    );
  };
}

export const wazzupProviderSettingsStore = new WazzupProviderSettingsStore();
