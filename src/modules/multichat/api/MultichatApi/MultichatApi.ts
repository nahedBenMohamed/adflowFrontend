import { baseApi } from '@/app';
import { MultichatApiRoutes } from '../MultichatApiRoutes';

class MultichatApi {
  getUnseenCount = async (): Promise<number> => {
    const response = await baseApi.get(MultichatApiRoutes.GET_MULTICHAT_UNSEEN_COUNT);

    return response.data;
  };
}

export const multichatApi = new MultichatApi();
