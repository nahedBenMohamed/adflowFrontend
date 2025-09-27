import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import { UserAccessToken, UserToken } from '../../shared';
import { SettingsApiRoutes } from '../SettingsApiRoutes';
import type { CreateUserTokenDto } from '../dtos';

class UserTokensApi {
  createUserAccessToken = async (dto: CreateUserTokenDto): Promise<UserAccessToken> => {
    const response = await baseApi.post(SettingsApiRoutes.CREATE_USER_ACCESS_TOKEN, dto);

    return UserAccessToken.fromDto(response.data);
  };

  getUserAccessTokens = async (): Promise<UserToken[]> => {
    const response = await baseApi.get(SettingsApiRoutes.GET_USER_ACCESS_TOKENS);

    return UserToken.fromDtos(response.data);
  };

  deleteUserAccessToken = async (tokenId: number): Promise<number> => {
    const response = await baseApi.delete(
      UrlTemplateUtil.toPath(SettingsApiRoutes.DELETE_USER_ACCESS_TOKEN, { tokenId })
    );

    return response.data;
  };
}

export const userTokensApi = new UserTokensApi();
