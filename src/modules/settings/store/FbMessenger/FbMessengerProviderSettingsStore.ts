import {
  fbMessengerProviderSettingsApi,
  type MessengerProviderSettings,
  type UpdateMessengerProviderDto,
} from '@/modules/multichat';
import { makeAutoObservable } from 'mobx';

class FbMessengerProviderSettingsStore {
  providersSettings: MessengerProviderSettings[] = [];

  areProvidersSettingsLoading = false;
  areProvidersSettingsLoaded = false;
  isProviderSettingsLoading = false;
  isProviderSettingsUpdating = false;
  isProviderSettingsDeleting = false;
  isGettingRedirectUrl = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadData = async (): Promise<void> => {
    try {
      this.areProvidersSettingsLoading = true;

      this.providersSettings = await fbMessengerProviderSettingsApi.getProvidersSettings();
    } catch (e) {
      throw new Error(`Error while loading Facebook Messenger providers: ${e}`);
    } finally {
      this.areProvidersSettingsLoading = false;
      this.areProvidersSettingsLoaded = true;
    }
  };

  loadProviderSettingsById = async (id: number): Promise<MessengerProviderSettings> => {
    try {
      this.isProviderSettingsLoading = true;

      return await fbMessengerProviderSettingsApi.getProviderSettings(id);
    } catch (e) {
      throw new Error(`Error while loading Facebook Messenger provider: ${e}`);
    } finally {
      this.isProviderSettingsLoading = false;
    }
  };

  getAuthRedirectUrl = async (): Promise<string> => {
    try {
      this.isGettingRedirectUrl = true;

      return await fbMessengerProviderSettingsApi.getAuthRedirectUrl();
    } catch (e) {
      throw new Error(`Error while getting auth redirect url from Facebook: ${e}`);
    } finally {
      this.isGettingRedirectUrl = false;
    }
  };

  updateProviderSettings = async ({
    id,
    dto,
  }: {
    id: number;
    dto: UpdateMessengerProviderDto;
  }): Promise<MessengerProviderSettings> => {
    try {
      this.isProviderSettingsUpdating = true;

      const updatedProviderSettings = await fbMessengerProviderSettingsApi.updateProviderSettings({
        id,
        dto,
      });

      this.providersSettings = this.providersSettings.map(p =>
        p.id === updatedProviderSettings.id ? updatedProviderSettings : p
      );

      return updatedProviderSettings;
    } catch (e) {
      throw new Error(`Error while updating Facebook Messenger provider settings ${id}: ${e}`);
    } finally {
      this.isProviderSettingsUpdating = false;
    }
  };

  deleteProviderSettings = async (id: number): Promise<void> => {
    try {
      this.isProviderSettingsDeleting = true;

      await fbMessengerProviderSettingsApi.deleteProviderSettings(id);

      this.providersSettings = this.providersSettings.filter(p => p.id !== id);
    } catch (e) {
      throw new Error(`Error while deleting Facebook Messenger provider settings ${id}: ${e}`);
    } finally {
      this.isProviderSettingsDeleting = false;
    }
  };
}

export const fbMessengerProviderSettingsStore = new FbMessengerProviderSettingsStore();
