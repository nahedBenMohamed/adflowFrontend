import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import type { SalesforceSettings } from '../../shared';
import { SettingsApiRoutes } from '../SettingsApiRoutes';
import type { CreateSalesforceSettingsDto } from '../dtos';

class SalesforceProviderSettingsApi {
  getSettings = async (): Promise<SalesforceSettings[]> => {
    const response = await baseApi.get(SettingsApiRoutes.SF_GET_SETTINGS);

    return response.data;
  };

  createSettings = async (dto: CreateSalesforceSettingsDto): Promise<SalesforceSettings> => {
    const response = await baseApi.post(SettingsApiRoutes.SF_ADD_SETTINGS, dto);

    return response.data;
  };

  deleteProviderSettings = async (id: string): Promise<void> => {
    await baseApi.delete(UrlTemplateUtil.toPath(SettingsApiRoutes.SF_DELETE_SETTINGS, { id }));
  };

  connect = async (id: string): Promise<string> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(SettingsApiRoutes.SF_CONNECT, { id })
    );

    return response.data;
  };

  disconnect = async (id: string): Promise<void> => {
    await baseApi.post(UrlTemplateUtil.toPath(SettingsApiRoutes.SF_DISCONNECT, { id }));
  };
}

export const salesforceProviderSettingsApi = new SalesforceProviderSettingsApi();
