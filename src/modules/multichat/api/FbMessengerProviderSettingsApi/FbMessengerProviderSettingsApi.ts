import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import { MessengerProviderSettings } from '../../shared';
import { MultichatApiRoutes } from '../MultichatApiRoutes';
import type { UpdateMessengerProviderDto } from '../dtos';

class FbMessengerProviderSettingsApi {
  getProvidersSettings = async (): Promise<MessengerProviderSettings[]> => {
    const response = await baseApi.get(MultichatApiRoutes.GET_FB_MESSENGER_PROVIDERS_SETTINGS);

    return MessengerProviderSettings.fromDtos(response.data);
  };

  getProviderSettings = async (id: number): Promise<MessengerProviderSettings> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(MultichatApiRoutes.GET_FB_MESSENGER_PROVIDER_SETTINGS, {
        providerId: id,
      })
    );

    return MessengerProviderSettings.fromDto(response.data);
  };

  getAuthRedirectUrl = async (): Promise<string> => {
    const response = await baseApi.get(MultichatApiRoutes.GET_FB_MESSENGER_AUTH_REDIRECT_URL);

    return response.data;
  };

  updateProviderSettings = async ({
    id,
    dto,
  }: {
    id: number;
    dto: UpdateMessengerProviderDto;
  }): Promise<MessengerProviderSettings> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(MultichatApiRoutes.UPDATE_FB_MESSENGER_PROVIDER_SETTINGS, {
        providerId: id,
      }),
      dto
    );

    return MessengerProviderSettings.fromDto(response.data);
  };

  deleteProviderSettings = async (id: number): Promise<void> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(MultichatApiRoutes.DELETE_FB_MESSENGER_PROVIDER_SETTINGS, {
        providerId: id,
      })
    );
  };
}

export const fbMessengerProviderSettingsApi = new FbMessengerProviderSettingsApi();
