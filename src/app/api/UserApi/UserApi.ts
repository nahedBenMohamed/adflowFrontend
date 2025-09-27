import { UrlTemplateUtil, User } from '@/shared';
import { ApiRoutes } from '../ApiRoutes';
import { baseApi } from '../BaseApi/BaseApi';
import type { ChangeUserPasswordDto, CreateUserDto, UpdateUserDto, UserDto } from '../dtos';

class UserApi {
  getUserById = async (userId: number): Promise<User> => {
    const response = await baseApi.get(UrlTemplateUtil.toPath(ApiRoutes.GET_USER, { id: userId }));

    return User.fromDto(response.data);
  };

  getUsers = async (): Promise<User[]> => {
    const response = await baseApi.get(ApiRoutes.GET_USERS);

    return User.fromDtos(response.data);
  };

  addUser = async (dto: CreateUserDto): Promise<User> => {
    const response = await baseApi.post(ApiRoutes.ADD_USER, dto);

    return User.fromDto(response.data);
  };

  updateUser = async ({ id, dto }: { id: number; dto: UpdateUserDto }): Promise<User> => {
    const response = await baseApi.put(UrlTemplateUtil.toPath(ApiRoutes.UPDATE_USER, { id }), dto);

    return User.fromDto(response.data);
  };

  deleteUser = async ({
    userId,
    newUserId,
  }: {
    userId: number;
    newUserId?: number;
  }): Promise<void> => {
    await baseApi.delete(UrlTemplateUtil.toPath(ApiRoutes.DELETE_USER, { id: userId }), {
      params: { newUserId },
    });
  };

  uploadUserAvatar = async ({
    userId,
    formData,
  }: {
    userId: number;
    formData: FormData;
  }): Promise<User> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(ApiRoutes.UPLOAD_USER_AVATAR, { id: userId }),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return User.fromDto(response.data as UserDto);
  };

  removeUserAvatar = async (userId: number): Promise<User> => {
    const response = await baseApi.delete(
      UrlTemplateUtil.toPath(ApiRoutes.REMOVE_USER_AVATAR, { id: userId })
    );

    return User.fromDto(response.data);
  };

  changeUserPassword = async (dto: ChangeUserPasswordDto): Promise<boolean> => {
    const response = await baseApi.post(ApiRoutes.CHANGE_USER_PASSWORD, dto);

    return response.data;
  };
}

export const userApi = new UserApi();
