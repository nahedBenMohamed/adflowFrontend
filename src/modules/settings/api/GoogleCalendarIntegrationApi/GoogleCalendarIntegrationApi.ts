import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import { CalendarAccess, GoogleCalendar } from '../../shared';
import { SettingsApiRoutes } from '../SettingsApiRoutes';
import type { CreateGoogleCalendarDto, UpdateGoogleCalendarDto } from '../dtos';

export class GoogleCalendarIntegrationApi {
  authorizeUrl = async (state?: string): Promise<string> => {
    const response = await baseApi.get(SettingsApiRoutes.GOOGLE_CALENDAR_AUTHORIZE_URL, {
      params: { state },
    });

    return response.data;
  };

  processCode = async ({
    code,
    state,
  }: {
    code: string;
    state?: string;
  }): Promise<CalendarAccess> => {
    const response = await baseApi.get(SettingsApiRoutes.GOOGLE_CALENDAR_PROCESS_CODE, {
      params: { code, state },
    });

    return CalendarAccess.fromDto(response.data);
  };

  getGoogleCalendarIntegrations = async (): Promise<GoogleCalendar[]> => {
    const response = await baseApi.get(SettingsApiRoutes.GET_GOOGLE_CALENDAR_INTEGRATIONS);

    return GoogleCalendar.fromDtos(response.data);
  };

  getGoogleCalendarIntegration = async (calendarId: number): Promise<GoogleCalendar> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(SettingsApiRoutes.GET_GOOGLE_CALENDAR_INTEGRATION, { calendarId })
    );

    return GoogleCalendar.fromDto(response.data);
  };

  createGoogleCalendarIntegration = async (
    dto: CreateGoogleCalendarDto
  ): Promise<GoogleCalendar> => {
    const response = await baseApi.post(SettingsApiRoutes.CREATE_GOOGLE_CALENDAR_INTEGRATION, dto);

    return GoogleCalendar.fromDto(response.data);
  };

  updateGoogleCalendarIntegration = async ({
    calendarId,
    dto,
  }: {
    calendarId: number;
    dto: UpdateGoogleCalendarDto;
  }): Promise<GoogleCalendar> => {
    const response = await baseApi.patch(
      UrlTemplateUtil.toPath(SettingsApiRoutes.UPDATE_GOOGLE_CALENDAR_INTEGRATION, { calendarId }),
      dto
    );

    return GoogleCalendar.fromDto(response.data);
  };

  deleteGoogleCalendarIntegration = async (calendarId: number): Promise<number> => {
    const response = await baseApi.delete(
      UrlTemplateUtil.toPath(SettingsApiRoutes.DELETE_API_ACCESS_GOOGLE_CALENDAR_INTEGRATION, {
        calendarId,
      })
    );

    return response.data;
  };
}

export const googleCalendarIntegrationApi = new GoogleCalendarIntegrationApi();
