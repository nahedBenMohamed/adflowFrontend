import { baseApi } from '@/app';
import { UrlTemplateUtil, type Nullable } from '@/shared';
import {
  SCHEDULE_APPOINTMENTS_LIMIT,
  ScheduleAppointment,
  ScheduleAppointmentResult,
  type GetScheduleAppointmentCountQueryParams,
  type GetScheduleAppointmentsQueryParams,
  type ScheduleAppointmentsExpandParam,
} from '../../shared';
import { SchedulerApiRoutes } from '../SchedulerApiRoutes';
import type {
  CreateScheduleAppointmentDto,
  ScheduleAppointmentStatisticsDto,
  UpdateScheduleAppointmentDto,
} from '../dtos';

class ScheduleAppointmentApi {
  getScheduleAppointments = async (
    queryParams: GetScheduleAppointmentsQueryParams
  ): Promise<ScheduleAppointmentResult> => {
    const response = await baseApi.get(SchedulerApiRoutes.GET_SCHEDULE_APPOINTMENTS, {
      params: {
        ...queryParams,
      },
    });

    return ScheduleAppointmentResult.fromDto(response.data);
  };

  getPaginatedScheduleAppointments = async (
    queryParams: GetScheduleAppointmentsQueryParams
  ): Promise<ScheduleAppointmentResult> => {
    const response = await baseApi.get(SchedulerApiRoutes.GET_SCHEDULE_APPOINTMENTS, {
      params: {
        ...queryParams,
        limit: SCHEDULE_APPOINTMENTS_LIMIT,
      },
    });

    return ScheduleAppointmentResult.fromDto(response.data);
  };

  getScheduleAppointment = async ({
    appointmentId,
    expand,
  }: {
    appointmentId: number;
    expand?: ScheduleAppointmentsExpandParam;
  }): Promise<ScheduleAppointment> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(SchedulerApiRoutes.GET_SCHEDULE_APPOINTMENT, { appointmentId }),
      {
        params: {
          expand,
        },
      }
    );

    return ScheduleAppointment.fromDto(response.data);
  };

  createScheduleAppointment = async (
    dto: CreateScheduleAppointmentDto
  ): Promise<ScheduleAppointment> => {
    const response = await baseApi.post(SchedulerApiRoutes.CREATE_SCHEDULE_APPOINTMENT, dto);

    return ScheduleAppointment.fromDto(response.data);
  };

  updateScheduleAppointment = async ({
    appointmentId,
    dto,
  }: {
    appointmentId: number;
    dto: UpdateScheduleAppointmentDto;
  }): Promise<ScheduleAppointment> => {
    const response = await baseApi.patch(
      UrlTemplateUtil.toPath(SchedulerApiRoutes.UPDATE_SCHEDULE_APPOINTMENT, { appointmentId }),
      dto
    );

    return ScheduleAppointment.fromDto(response.data);
  };

  getLastScheduleAppointment = async (
    queryParams: GetScheduleAppointmentCountQueryParams
  ): Promise<Nullable<ScheduleAppointment>> => {
    const response = await baseApi.get(SchedulerApiRoutes.GET_LAST_SCHEDULE_APPOINTMENT, {
      params: queryParams,
    });

    const lastScheduleAppointment = response.data;

    return lastScheduleAppointment ? ScheduleAppointment.fromDto(lastScheduleAppointment) : null;
  };

  getScheduleAppointmentCount = async (
    queryParams: GetScheduleAppointmentCountQueryParams
  ): Promise<number> => {
    const response = await baseApi.get(SchedulerApiRoutes.GET_SCHEDULE_APPOINTMENT_COUNT, {
      params: queryParams,
    });

    return response.data;
  };

  getScheduleAppointmentStatistics = async (
    queryParams: GetScheduleAppointmentCountQueryParams
  ): Promise<ScheduleAppointmentStatisticsDto> => {
    const response = await baseApi.get(SchedulerApiRoutes.GET_SCHEDULE_APPOINTMENT_STATISTICS, {
      params: queryParams,
    });

    return response.data;
  };
}

export const scheduleAppointmentApi = new ScheduleAppointmentApi();
