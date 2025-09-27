import { baseApi } from '@/app';
import { UrlTemplateUtil, type Nullable } from '@/shared';
import {
  VoximplantAccount,
  VoximplantCallList,
  VoximplantSIPData,
  VoximplantScenarios,
  VoximplantUser,
} from '../../shared';
import { TelephonyApiRoutes } from '../TelephonyApiRoutes';
import {
  type CreateVoximplantUserDto,
  type UpdateVoximplantCallDto,
  type UpdateVoximplantUserDto,
  type VoximplantScenariosDto,
} from '../dtos';

const VOXIMPLANT_CALLS_LIMIT = 20;

class VoximplantApi {
  getVoximplantAccount = async (): Promise<Nullable<VoximplantAccount>> => {
    const response = await baseApi.get(TelephonyApiRoutes.GET_VOXIMPLANT_ACCOUNT);

    if (!response.data) {
      return null;
    }

    return VoximplantAccount.fromDto(response.data);
  };

  createVoximplantAccount = async (): Promise<VoximplantAccount> => {
    const response = await baseApi.post(TelephonyApiRoutes.CREATE_VOXIMPLANT_ACCOUNT);

    return VoximplantAccount.fromDto(response.data);
  };

  getUsername = async (): Promise<Nullable<string>> => {
    const response = await baseApi.get(TelephonyApiRoutes.GET_VOXIMPLANT_USERNAME);

    if (!response.data) {
      return null;
    }

    return response.data;
  };

  getLoginToken = async (key: string): Promise<string> => {
    const response = await baseApi.get(TelephonyApiRoutes.GET_VOXIMPLANT_LOGIN_TOKEN, {
      params: { key },
    });

    return response.data;
  };

  patchVoximplantCall = async ({
    externalId,
    dto,
  }: {
    externalId: string;
    dto: UpdateVoximplantCallDto;
  }): Promise<void> => {
    await baseApi.patch(
      UrlTemplateUtil.toPath(TelephonyApiRoutes.PATCH_VOXIMPLANT_CALL, { externalId }),
      dto
    );
  };

  getVoximplantCalls = async (offset: Nullable<number> = null): Promise<VoximplantCallList> => {
    const response = await baseApi.get(TelephonyApiRoutes.GET_VOXIMPLANT_CALLS, {
      params: {
        limit: VOXIMPLANT_CALLS_LIMIT,
        offset,
      },
    });

    return VoximplantCallList.fromDto(response.data);
  };

  getVoximplantUsers = async (): Promise<VoximplantUser[]> => {
    const response = await baseApi.get(TelephonyApiRoutes.GET_VOXIMPLANT_USERS);

    return VoximplantUser.fromDtos(response.data);
  };

  getVoximplantUser = async (userId: number): Promise<VoximplantUser> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(TelephonyApiRoutes.GET_VOXIMPLANT_USER, { userId })
    );

    return VoximplantUser.fromDto(response.data);
  };

  deleteVoximplantUser = async (userId: number): Promise<void> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(TelephonyApiRoutes.DELETE_VOXIMPLANT_USER, { userId })
    );
  };

  patchVoximplantUser = async ({
    userId,
    dto,
  }: {
    userId: number;
    dto: UpdateVoximplantUserDto;
  }): Promise<VoximplantUser> => {
    const response = await baseApi.patch(
      UrlTemplateUtil.toPath(TelephonyApiRoutes.PATCH_VOXIMPLANT_USER, { userId }),
      dto
    );

    return VoximplantUser.fromDto(response.data);
  };

  createVoximplantUser = async ({
    userId,
    dto,
  }: {
    userId: number;
    dto: CreateVoximplantUserDto;
  }): Promise<VoximplantUser> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(TelephonyApiRoutes.CREATE_VOXIMPLANT_USER, { userId }),
      dto
    );

    return VoximplantUser.fromDto(response.data);
  };

  getVoximplantScenarios = async (): Promise<VoximplantScenarios> => {
    const response = await baseApi.get(TelephonyApiRoutes.GET_VOXIMPLANT_SCENARIOS);

    return VoximplantScenarios.fromDto(response.data);
  };

  createVoximplantScenarios = async (dto: VoximplantScenariosDto): Promise<VoximplantScenarios> => {
    const response = await baseApi.post(TelephonyApiRoutes.CREATE_VOXIMPLANT_SCENARIOS, dto);

    return VoximplantScenarios.fromDto(response.data);
  };

  updateVoximplantScenarios = async (dto: VoximplantScenariosDto): Promise<VoximplantScenarios> => {
    const response = await baseApi.put(TelephonyApiRoutes.UPDATE_VOXIMPLANT_SCENARIOS, dto);

    return VoximplantScenarios.fromDto(response.data);
  };

  getVoximplantUserSIPSettings = async (userId: number): Promise<VoximplantSIPData> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(TelephonyApiRoutes.GET_VOXIMPLANT_USER_SIP_SETTINGS, { userId })
    );

    return VoximplantSIPData.fromDto(response.data);
  };
}

export const voximplantApi = new VoximplantApi();
