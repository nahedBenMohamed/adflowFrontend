import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import { TwilioProviderSettings } from '../../shared';
import { MultichatApiRoutes } from '../MultichatApiRoutes';
import type { CreateTwilioProviderDto, UpdateTwilioProviderDto } from '../dtos';

class TwilioProviderSettingsApi {
  getProvidersSettings = async (): Promise<TwilioProviderSettings[]> => {
    const response = await baseApi.get(MultichatApiRoutes.GET_TWILIO_PROVIDERS_SETTINGS);

    return TwilioProviderSettings.fromDtos(response.data);
  };

  getProviderSettings = async (id: number): Promise<TwilioProviderSettings> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(MultichatApiRoutes.GET_TWILIO_PROVIDER_SETTINGS, { providerId: id })
    );

    return TwilioProviderSettings.fromDto(response.data);
  };

  updateProviderSettings = async ({
    id,
    dto,
  }: {
    id: number;
    dto: UpdateTwilioProviderDto;
  }): Promise<TwilioProviderSettings> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(MultichatApiRoutes.UPDATE_TWILIO_PROVIDER_SETTINGS, {
        providerId: id,
      }),
      dto
    );

    return TwilioProviderSettings.fromDto(response.data);
  };

  createProviderSettings = async (
    dto: CreateTwilioProviderDto
  ): Promise<TwilioProviderSettings> => {
    const response = await baseApi.post(MultichatApiRoutes.CREATE_TWILIO_PROVIDER_SETTINGS, dto);

    return TwilioProviderSettings.fromDto(response.data);
  };

  deleteProviderSettings = async (id: number): Promise<void> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(MultichatApiRoutes.DELETE_TWILIO_PROVIDER_SETTINGS, {
        providerId: id,
      })
    );
  };
}

export const twilioProviderSettingsApi = new TwilioProviderSettingsApi();
