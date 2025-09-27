import { Account, AccountSettings } from '@/modules/settings';
import { ApiRoutes } from '../ApiRoutes';
import { baseApi } from '../BaseApi/BaseApi';
import type { UpdateAccountSettingsDto } from '../dtos';

class GeneralSettingsApi {
  getAccount = async (): Promise<Account> => {
    const response = await baseApi.get(ApiRoutes.GET_ACCOUNT);

    return Account.fromDto(response.data);
  };

  searchAccounts = async (search: string): Promise<Account[]> => {
    const response = await baseApi.get(ApiRoutes.SEARCH_ACCOUNTS, { params: { search } });

    return Account.fromDtos(response.data);
  };

  getAccountSettings = async (): Promise<AccountSettings> => {
    const response = await baseApi.get(ApiRoutes.GET_ACCOUNT_SETTINGS);

    return AccountSettings.fromDto(response.data);
  };

  updateAccountSettings = async (dto: UpdateAccountSettingsDto): Promise<AccountSettings> => {
    const response = await baseApi.put(ApiRoutes.UPDATE_ACCOUNT_SETTINGS, dto);

    return AccountSettings.fromDto(response.data);
  };

  uploadAccountLogo = async (formData: FormData): Promise<Account> => {
    const response = await baseApi.post(ApiRoutes.UPLOAD_ACCOUNT_LOGO, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return Account.fromDto(response.data);
  };

  removeAccountLogo = async (): Promise<Account> => {
    const response = await baseApi.delete(ApiRoutes.REMOVE_ACCOUNT_LOGO);

    return Account.fromDto(response.data);
  };

  getDemoDataExists = async (): Promise<boolean> => {
    const response = await baseApi.get(ApiRoutes.GET_DEMO_DATA_EXISTS);

    return Boolean(response.data);
  };

  deleteDemoData = async (): Promise<AccountSettings> => {
    const response = await baseApi.delete(ApiRoutes.DELETE_DEMO_DATA);

    return AccountSettings.fromDto(response.data);
  };
}

export const generalSettingsApi = new GeneralSettingsApi();
