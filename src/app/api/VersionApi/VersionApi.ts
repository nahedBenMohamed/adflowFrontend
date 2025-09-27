import { type Nullable, Version } from '@/shared';
import { ApiRoutes } from '../ApiRoutes';
import { baseApi } from '../BaseApi/BaseApi';

class VersionApi {
  getLatestFrontendVersion = async (currentVersion: string): Promise<Nullable<Version>> => {
    const response = await baseApi.get(ApiRoutes.GET_LATEST_FRONTEND_VERSION, {
      params: {
        currentVersion,
      },
    });

    return response.data ? Version.fromDto(response.data) : null;
  };
}

export const versionApi = new VersionApi();
