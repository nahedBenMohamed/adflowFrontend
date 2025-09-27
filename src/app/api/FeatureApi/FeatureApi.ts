import { ApiRoutes } from '../ApiRoutes';
import { baseApi } from '../BaseApi/BaseApi';
import { type FeatureDto } from '../dtos/Builder/FeatureDto';

class FeatureApi {
  getFeatures = async (): Promise<FeatureDto[]> => {
    const response = await baseApi.get(ApiRoutes.GET_FEATURES);

    return response.data;
  };
}

export const featureApi = new FeatureApi();
