import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import { WazzupChannel, WazzupProvider } from '../../shared';
import { MultichatApiRoutes } from '../MultichatApiRoutes';
import type { CreateWazzupProviderDto, UpdateWazzupProviderDto } from '../dtos';

class WazzupProviderSettingsApi {
  getWazzupProvidersSettings = async (): Promise<WazzupProvider[]> => {
    const response = await baseApi.get(MultichatApiRoutes.GET_WAZZUP_PROVIDERS_SETTINGS);

    return WazzupProvider.fromDtos(response.data);
  };

  getWazzupProviderSettings = async (providerId: number): Promise<WazzupProvider> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(MultichatApiRoutes.GET_WAZZUP_PROVIDER_SETTINGS, { providerId })
    );

    return WazzupProvider.fromDto(response.data);
  };

  // either apiKey or state is required to get wazzup channels
  getWazzupProviderSettingsChannels = async (apiKey: string): Promise<WazzupChannel[]> => {
    const response = await baseApi.get(MultichatApiRoutes.GET_WAZZUP_PROVIDER_SETTINGS_CHANNELS, {
      params: {
        apiKey,
      },
    });

    return WazzupChannel.fromDtos(response.data);
  };

  createWazzupProviderSettings = async (dto: CreateWazzupProviderDto): Promise<WazzupProvider> => {
    const response = await baseApi.post(MultichatApiRoutes.CREATE_WAZZUP_PROVIDER_SETTINGS, dto);

    return WazzupProvider.fromDto(response.data);
  };

  updateWazzupProviderSettings = async ({
    providerId,
    dto,
  }: {
    providerId: number;
    dto: UpdateWazzupProviderDto;
  }): Promise<WazzupProvider> => {
    const response = await baseApi.patch(
      UrlTemplateUtil.toPath(MultichatApiRoutes.UPDATE_WAZZUP_PROVIDER_SETTINGS, { providerId }),
      dto
    );

    return WazzupProvider.fromDto(response.data);
  };

  deleteWazzupProviderSettings = async (providerId: number): Promise<boolean> => {
    const response = await baseApi.delete(
      UrlTemplateUtil.toPath(MultichatApiRoutes.DELETE_WAZZUP_PROVIDER_SETTINGS, { providerId })
    );

    return response.data;
  };

  getWazzupApiKeyByState = async (state: string): Promise<string> => {
    const response = await baseApi.get(MultichatApiRoutes.GET_WAZZUP_API_KEY_BY_STATE, {
      params: {
        state,
      },
    });

    return response.data;
  };
}

export const wazzupProviderSettingsApi = new WazzupProviderSettingsApi();
