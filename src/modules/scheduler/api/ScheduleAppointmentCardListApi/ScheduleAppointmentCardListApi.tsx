import { baseApi } from '@/app';
import {
  DEFAULT_ENTITY_LIST_ITEMS_LIMIT,
  EntityListItem,
  type EntityListMeta,
} from '@/modules/section';
import type { GetScheduleAppointmentsQueryParams } from '../../shared';
import { SchedulerApiRoutes } from '../SchedulerApiRoutes';

class ScheduleAppointmentCardListApi {
  getScheduleAppointmentCardList = async (
    queryParams: GetScheduleAppointmentsQueryParams
  ): Promise<EntityListItem[]> => {
    const response = await baseApi.get(SchedulerApiRoutes.GET_SCHEDULE_APPOINTMENT_CARD_LIST, {
      params: { ...queryParams, limit: DEFAULT_ENTITY_LIST_ITEMS_LIMIT },
    });

    return EntityListItem.fromDtos(response.data);
  };

  getScheduleAppointmentCardListMeta = async (
    queryParams: GetScheduleAppointmentsQueryParams
  ): Promise<EntityListMeta> => {
    const response = await baseApi.get(SchedulerApiRoutes.GET_SCHEDULE_APPOINTMENT_CARD_LIST_META, {
      params: queryParams,
    });

    return response.data;
  };
}

export const scheduleAppointmentCardListApi = new ScheduleAppointmentCardListApi();
