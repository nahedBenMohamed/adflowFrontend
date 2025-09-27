import {
  twilioProviderSettingsApi,
  type CreateTwilioProviderDto,
  type TwilioProviderSettings,
  type UpdateTwilioProviderDto,
} from '@/modules/multichat';
import { makeAutoObservable } from 'mobx';

class TwilioWhatsAppProviderSettingsStore {
  providersSettings: TwilioProviderSettings[] = [];

  areProvidersSettingsLoading = false;
  areProvidersSettingsLoaded = false;
  isProviderSettingsLoading = false;
  isProviderSettingsUpdating = false;
  isProviderSettingsAdding = false;
  isProviderSettingsDeleting = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadData = async (): Promise<void> => {
    try {
      this.areProvidersSettingsLoading = true;
      this.areProvidersSettingsLoaded = false;

      this.providersSettings = await twilioProviderSettingsApi.getProvidersSettings();
    } catch (e) {
      throw new Error(`Error while loading Twilio WhatsApp providers: ${e}`);
    } finally {
      this.areProvidersSettingsLoading = false;
      this.areProvidersSettingsLoaded = true;
    }
  };

  loadProviderSettingsById = async (id: number): Promise<TwilioProviderSettings> => {
    try {
      this.isProviderSettingsLoading = true;

      return await twilioProviderSettingsApi.getProviderSettings(id);
    } catch (e) {
      throw new Error(`Error while loading Twilio WhatsApp provider with id ${id}: ${e}`);
    } finally {
      this.isProviderSettingsLoading = false;
    }
  };

  updateProviderSettings = async ({
    id,
    dto,
  }: {
    id: number;
    dto: UpdateTwilioProviderDto;
  }): Promise<void> => {
    try {
      this.isProviderSettingsUpdating = true;

      const updateProviderSettings = await twilioProviderSettingsApi.updateProviderSettings({
        id,
        dto,
      });

      this.providersSettings = this.providersSettings.map(p =>
        p.id === updateProviderSettings.id ? updateProviderSettings : p
      );
    } catch (e) {
      throw new Error(`Error while updating Twilio WhatsApp provider with id ${id}: ${e}`);
    } finally {
      this.isProviderSettingsUpdating = false;
    }
  };

  addProviderSettings = async (dto: CreateTwilioProviderDto): Promise<void> => {
    try {
      this.isProviderSettingsAdding = true;

      const provider = await twilioProviderSettingsApi.createProviderSettings(dto);
      this.providersSettings.push(provider);
    } catch (e) {
      throw new Error(
        `Error while adding Twilio WhatsApp provider with sid ${dto.accountSid}: ${e}`
      );
    } finally {
      this.isProviderSettingsAdding = false;
    }
  };

  deleteProviderSettings = async (id: number): Promise<void> => {
    try {
      this.isProviderSettingsDeleting = true;

      await twilioProviderSettingsApi.deleteProviderSettings(id);
      this.providersSettings = this.providersSettings.filter(p => p.id !== id);
    } catch (e) {
      throw new Error(`Error while deleting Twilio WhatsApp provider with id ${id}: ${e}`);
    } finally {
      this.isProviderSettingsDeleting = false;
    }
  };
}

export const twilioWhatsAppProviderSettingsStore = new TwilioWhatsAppProviderSettingsStore();
