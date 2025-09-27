import { UrlTemplateUtil } from '@/shared/lib/utils/UrlTemplateUtil';
import { UserProfile } from '../../../shared/lib/models/Profile/UserProfile';
import { ApiRoutes } from '../ApiRoutes';
import { baseApi } from '../BaseApi/BaseApi';
import { type UpdateUserProfileDto } from '../dtos/Profile/UpdateUserProfileDto';
import { type UserProfileDto } from '../dtos/Profile/UserProfileDto';

class UserProfileApi {
  getUserProfile = async (id: number): Promise<UserProfile> => {
    const response = await baseApi.get(UrlTemplateUtil.toPath(ApiRoutes.GET_USER_PROFILE, { id }));

    const dto: UserProfileDto = response.data;

    return new UserProfile(dto);
  };

  updateUserProfile = async ({
    id,
    dto,
  }: {
    id: number;
    dto: UpdateUserProfileDto;
  }): Promise<void> => {
    await baseApi.patch(UrlTemplateUtil.toPath(ApiRoutes.UPDATE_USER_PROFILE, { id }), dto);
  };
}

export const userProfileApi = new UserProfileApi();
