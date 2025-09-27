import { baseApi } from '@/app';
import { PhoneUserInfo } from '../../shared';
import { FieldsApiRoutes } from '../FieldsApiRoutes';

class FieldHelperApi {
  getPhoneUserInfo = async (phone: string): Promise<PhoneUserInfo> => {
    const response = await baseApi.get(FieldsApiRoutes.GET_AGGREGATED_PHONE_USER_INFO, {
      params: { phone },
    });

    return PhoneUserInfo.fromDto(response.data);
  };
}

export const fieldHelperApi = new FieldHelperApi();
