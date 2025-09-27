import { FrontendObject, UrlTemplateUtil, type Nullable } from '@/shared';
import { ApiRoutes } from '../ApiRoutes';
import { baseApi } from '../BaseApi/BaseApi';
import type { CreateFrontendObjectDto } from '../dtos';

class FrontendObjectsApi {
  // null – object not found by the key
  getFrontendObject = async <T extends unknown = unknown>(
    key: string
  ): Promise<Nullable<FrontendObject<T>>> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(ApiRoutes.GET_FRONTEND_OBJECT, { key })
    );

    return response.data ? FrontendObject.fromDto<T>(response.data) : null;
  };

  upsertFrontendObject = async <T extends unknown = unknown>(
    dto: CreateFrontendObjectDto<T>
  ): Promise<FrontendObject<T>> => {
    const response = await baseApi.post(ApiRoutes.UPSERT_FRONTEND_OBJECT, dto);

    return FrontendObject.fromDto<T>(response.data);
  };

  deleteFrontendObject = async (key: string): Promise<void> => {
    await baseApi.delete(UrlTemplateUtil.toPath(ApiRoutes.DELETE_FRONTEND_OBJECT, { key }));
  };
}

export const frontendObjectsApi = new FrontendObjectsApi();
