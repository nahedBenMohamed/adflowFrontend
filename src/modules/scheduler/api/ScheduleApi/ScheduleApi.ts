import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import { Schedule, type GetSchedulesQueryParams } from '../../shared';
import { SchedulerApiRoutes } from '../SchedulerApiRoutes';
import type { CreateScheduleDto, UpdateScheduleDto } from '../dtos';

class ScheduleApi {
  getSchedules = async (queryParams?: GetSchedulesQueryParams): Promise<Schedule[]> => {
    const response = await baseApi.get(SchedulerApiRoutes.GET_SCHEDULES, {
      params: queryParams,
    });

    return Schedule.fromDtos(response.data);
  };

  getSchedule = async (scheduleId: number): Promise<Schedule> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(SchedulerApiRoutes.GET_SCHEDULE, { scheduleId })
    );

    return Schedule.fromDto(response.data);
  };

  createSchedule = async (dto: CreateScheduleDto): Promise<Schedule> => {
    const response = await baseApi.post(SchedulerApiRoutes.CREATE_SCHEDULE, dto);

    return Schedule.fromDto(response.data);
  };

  updateSchedule = async (scheduleId: number, dto: UpdateScheduleDto): Promise<Schedule> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(SchedulerApiRoutes.UPDATE_SCHEDULE, { scheduleId }),
      dto
    );

    return Schedule.fromDto(response.data);
  };

  deleteSchedule = async (scheduleId: number): Promise<void> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(SchedulerApiRoutes.DELETE_SCHEDULE, { scheduleId })
    );
  };
}

export const scheduleApi = new ScheduleApi();
