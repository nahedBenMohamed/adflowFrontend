import { baseApi } from '@/app';
import { type Nullable, UrlTemplateUtil } from '@/shared';
import { UserCalendar } from '../../shared';
import type { UserCalendarDto } from '../dtos';
import { SettingsApiRoutes } from '../SettingsApiRoutes';

class UserCalendarApi {
  createUserCalendar = async ({
    userId,
    dto,
  }: {
    userId: number;
    dto: UserCalendarDto;
  }): Promise<UserCalendar> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(SettingsApiRoutes.CREATE_USER_CALENDAR, { userId }),
      dto
    );

    return UserCalendar.fromDto(response.data);
  };

  getUserCalendar = async (userId: number): Promise<Nullable<UserCalendar>> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(SettingsApiRoutes.GET_USER_CALENDAR, { userId })
    );

    return response.data ? UserCalendar.fromDto(response.data) : null;
  };

  updateUserCalendar = async ({
    userId,
    dto,
  }: {
    userId: number;
    dto: UserCalendarDto;
  }): Promise<UserCalendar> => {
    const response = await baseApi.patch(
      UrlTemplateUtil.toPath(SettingsApiRoutes.UPDATE_USER_CALENDAR, { userId }),
      dto
    );

    return UserCalendar.fromDto(response.data);
  };

  deleteUserCalendar = async (userId: number): Promise<void> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(SettingsApiRoutes.DELETE_USER_CALENDAR, { userId })
    );
  };
}

export const userCalendarApi = new UserCalendarApi();
