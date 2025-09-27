import { baseApi } from '@/app';
import type { JwtToken } from '@/shared';
import { AuthApiRoutes } from '../AuthApiRoutes';

class AuthApi {
  login = async ({ email, password }: { email: string; password: string }): Promise<JwtToken> => {
    const response = await baseApi.post(AuthApiRoutes.LOGIN, { email, password });

    return response.data;
  };

  decodeLoginLink = async (loginLink: string): Promise<JwtToken> => {
    const response = await baseApi.post(AuthApiRoutes.DECODE_LOGIN_LINK, { loginLink });

    return response.data;
  };

  refreshToken = async (token: string): Promise<JwtToken> => {
    baseApi.setAuthToken(token);

    const response = await baseApi.post(AuthApiRoutes.REFRESH_TOKEN);

    return response.data;
  };
}

export const authApi = new AuthApi();
