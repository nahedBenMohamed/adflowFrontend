import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import { SalesPlan, SalesPlanProgress } from '../../shared';
import { ReportingApiRoutes } from '../ReportingApiRoutes';
import type { DatePeriodDto, SalesPlanDto } from '../dtos';

export class GoalSettingsApi {
  getUsersGoals = async ({
    entityTypeId,
    period,
  }: {
    entityTypeId: number;
    period: DatePeriodDto;
  }): Promise<SalesPlan[]> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(ReportingApiRoutes.GET_USERS_GOALS, {
        entityTypeId,
      }),
      {
        params: {
          startDate: period.startDate,
          endDate: period.endDate,
        },
      }
    );

    return SalesPlan.fromDtos(response.data);
  };

  getSalesPlans = async ({
    entityTypeId,
    period,
  }: {
    entityTypeId: number;
    period: DatePeriodDto;
  }): Promise<SalesPlanProgress[]> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(ReportingApiRoutes.GET_SALES_PLANS, {
        entityTypeId,
      }),
      {
        params: {
          startDate: period.startDate,
          endDate: period.endDate,
        },
      }
    );

    return SalesPlanProgress.fromDtos(response.data);
  };

  updateUserGoals = async ({
    entityTypeId,
    data,
  }: {
    entityTypeId: number;
    data: SalesPlanDto[];
  }): Promise<SalesPlan[]> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(ReportingApiRoutes.UPDATE_USERS_GOALS, {
        entityTypeId,
      }),
      data
    );

    return SalesPlan.fromDtos(response.data);
  };

  deleteUserGoals = async ({
    entityTypeId,
    userId,
    period,
  }: {
    entityTypeId: number;
    userId: number;
    period: DatePeriodDto;
  }): Promise<void> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(ReportingApiRoutes.DELETE_USER_GOALS, {
        entityTypeId,
        userId,
      }),
      {
        params: {
          startDate: period.startDate,
          endDate: period.endDate,
        },
      }
    );
  };

  deleteAllGoals = async ({
    entityTypeId,
    startDate,
  }: {
    entityTypeId: number;
    startDate: string;
  }): Promise<void> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(ReportingApiRoutes.DELETE_ALL_GOALS, {
        entityTypeId,
      }),
      {
        params: {
          startDate,
        },
      }
    );
  };
}

export const goalSettingsApi = new GoalSettingsApi();
