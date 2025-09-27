import { baseApi } from '@/app';
import { UrlTemplateUtil, type Nullable } from '@/shared';
import { VoximplantSIP } from '../../shared/lib/models/VoximplantSIP/VoximplantSIP';
import type { CreateVoximplantSIPDto, UpdateVoximplantSIPDto } from '../dtos';
import { TelephonyApiRoutes } from '../TelephonyApiRoutes';

class VoximplantSIPApi {
  getVoximplantSIPRegistrationsExpanded = async ({
    accessibleUserId,
  }: {
    accessibleUserId?: number;
  }): Promise<VoximplantSIP[]> => {
    const response = await baseApi.get(TelephonyApiRoutes.GET_VOXIMPLANT_SIP_REGISTRATIONS, {
      params: {
        accessibleUserId,
        expand: 'registration,users',
      },
    });

    return VoximplantSIP.fromDtos(response.data);
  };

  getVoximplantSIPRegistrations = async ({
    accessibleUserId,
  }: {
    accessibleUserId?: number;
  }): Promise<VoximplantSIP[]> => {
    const response = await baseApi.get(TelephonyApiRoutes.GET_VOXIMPLANT_SIP_REGISTRATIONS, {
      params: {
        accessibleUserId,
      },
    });

    return VoximplantSIP.fromDtos(response.data);
  };

  getVoximplantSIPRegistrationByExternalId = async (
    externalId: Nullable<number>
  ): Promise<Nullable<VoximplantSIP>> => {
    if (!externalId) return null;

    const response = await baseApi.get(
      UrlTemplateUtil.toPath(TelephonyApiRoutes.GET_VOXIMPLANT_SIP_REGISTRATION_BY_EXTERNAL_ID, {
        externalId,
      }),
      {
        params: {
          expand: 'registration',
        },
      }
    );

    return VoximplantSIP.fromDto(response.data);
  };

  createVoximplantSIPRegistration = async (dto: CreateVoximplantSIPDto): Promise<VoximplantSIP> => {
    const response = await baseApi.post(TelephonyApiRoutes.CREATE_VOXIMPLANT_SIP_REGISTRATION, dto);

    return VoximplantSIP.fromDto(response.data);
  };

  updateVoximplantSIPRegistration = async ({
    sipId,
    dto,
  }: {
    sipId: number;
    dto: UpdateVoximplantSIPDto;
  }): Promise<VoximplantSIP> => {
    const response = await baseApi.patch(
      UrlTemplateUtil.toPath(TelephonyApiRoutes.UPDATE_VOXIMPLANT_SIP_REGISTRATION, {
        sipId,
      }),
      dto
    );

    return VoximplantSIP.fromDto(response.data);
  };

  deleteVoximplantSIPRegistration = async (sipId: number): Promise<number> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(TelephonyApiRoutes.DELETE_VOXIMPLANT_SIP_REGISTRATION, {
        sipId,
      })
    );

    return sipId;
  };
}

export const voximplantSIPApi = new VoximplantSIPApi();
