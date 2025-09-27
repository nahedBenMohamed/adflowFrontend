import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import { PhoneNumber, VoximplantNumber } from '../../shared';
import { TelephonyApiRoutes } from '../TelephonyApiRoutes';
import type { CreateVoximplantNumberDto, UpdateVoximplantNumberDto } from '../dtos';

class VoximplantNumbersApi {
  getVoximplantAvailablePhoneNumbers = async (): Promise<PhoneNumber[]> => {
    const response = await baseApi.get(TelephonyApiRoutes.GET_VOXIMPLANT_AVAILABLE_PHONE_NUMBERS);

    return PhoneNumber.fromDtos(response.data);
  };

  getVoximplantPhoneNumbers = async (accessibleUserId?: number): Promise<VoximplantNumber[]> => {
    const response = await baseApi.get(TelephonyApiRoutes.GET_VOXIMPLANT_PHONE_NUMBERS, {
      params: {
        expand: 'users',
        accessibleUserId,
      },
    });

    return VoximplantNumber.fromDtos(response.data);
  };

  createVoximplantPhoneNumber = async (
    dto: CreateVoximplantNumberDto
  ): Promise<VoximplantNumber> => {
    const response = await baseApi.post(TelephonyApiRoutes.CREATE_VOXIMPLANT_PHONE_NUMBER, dto);

    return VoximplantNumber.fromDto(response.data);
  };

  deleteVoximplantPhoneNumber = async (numberId: number): Promise<number> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(TelephonyApiRoutes.DELETE_VOXIMPLANT_PHONE_NUMBER, { numberId })
    );

    return numberId;
  };

  updateVoximplantPhoneNumber = async ({
    numberId,
    dto,
  }: {
    numberId: number;
    dto: UpdateVoximplantNumberDto;
  }): Promise<VoximplantNumber> => {
    const response = await baseApi.patch(
      UrlTemplateUtil.toPath(TelephonyApiRoutes.UPDATE_VOXIMPLANT_PHONE_NUMBER, { numberId }),
      dto
    );

    return VoximplantNumber.fromDto(response.data);
  };
}

export const voximplantNumbersApi = new VoximplantNumbersApi();
