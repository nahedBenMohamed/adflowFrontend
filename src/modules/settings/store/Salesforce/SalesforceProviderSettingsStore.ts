import { makeAutoObservable } from 'mobx';
import { salesforceProviderSettingsApi, type CreateSalesforceSettingsDto } from '../../api';
import type { SalesforceSettings } from '../../shared';

class SalesforceProviderSettingsStore {
  constructor() {
    makeAutoObservable(this);
  }

  loadData = async (): Promise<SalesforceSettings[]> => {
    const settingsList = await salesforceProviderSettingsApi.getSettings();

    return settingsList.filter(s => s.isConnected);
  };

  createAndConnect = async (dto: CreateSalesforceSettingsDto): Promise<string> => {
    const settings = await salesforceProviderSettingsApi.createSettings(dto);

    return await salesforceProviderSettingsApi.connect(settings.id);
  };

  disconnectAndDelete = async (id: string): Promise<void> => {
    await salesforceProviderSettingsApi.disconnect(id);

    await salesforceProviderSettingsApi.deleteProviderSettings(id);
  };
}

export const salesforceProviderSettingsStore = new SalesforceProviderSettingsStore();
