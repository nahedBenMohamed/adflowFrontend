import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import {
  EntitiesReport,
  PipelineReport,
  SalesPlanReportModel,
  SellersRating,
  TasksReport,
  TopSellers,
  type SalesPipelineFilter,
} from '../../shared';
import { ReportingApiRoutes } from '../ReportingApiRoutes';
import type { ReportFilter } from '../dtos';

export const TOP_SELLERS_LIMIT = 20;

class DashboardApi {
  getSalesPlanReport = async ({
    entityTypeId,
    filter,
  }: {
    entityTypeId: number;
    filter: ReportFilter;
  }): Promise<SalesPlanReportModel> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(ReportingApiRoutes.GET_SALES_PLAN_REPORT, {
        entityTypeId,
      }),
      filter
    );

    return SalesPlanReportModel.fromDto(response.data);
  };

  getTopSellers = async ({
    entityTypeId,
    filter,
  }: {
    entityTypeId: number;
    filter: ReportFilter;
  }): Promise<TopSellers> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(ReportingApiRoutes.GET_TOP_SELLERS, {
        entityTypeId,
      }),
      filter
    );

    return TopSellers.fromDto(response.data);
  };

  getRating = async ({
    entityTypeId,
    filter,
    offset,
  }: {
    entityTypeId: number;
    filter: ReportFilter;
    offset: number;
  }): Promise<SellersRating> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(ReportingApiRoutes.GET_RATING, {
        entityTypeId,
      }),
      filter,
      {
        params: {
          limit: TOP_SELLERS_LIMIT,
          offset,
        },
      }
    );

    return SellersRating.fromDto(response.data);
  };

  getEntitySummaryReport = async ({
    entityTypeId,
    filter,
  }: {
    entityTypeId: number;
    filter: ReportFilter;
  }): Promise<EntitiesReport> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(ReportingApiRoutes.GET_ENTITY_SUMMARY_REPORT, {
        entityTypeId,
      }),
      filter
    );

    return EntitiesReport.fromDto(response.data);
  };

  getTasksSummaryReport = async ({
    entityTypeId,
    filter,
  }: {
    entityTypeId: number;
    filter: ReportFilter;
  }): Promise<TasksReport> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(ReportingApiRoutes.GET_TASKS_SUMMARY_REPORT, {
        entityTypeId,
      }),
      filter
    );

    return TasksReport.fromDto(response.data);
  };

  getActivitiesSummaryReport = async ({
    entityTypeId,
    filter,
  }: {
    entityTypeId: number;
    filter: ReportFilter;
  }): Promise<TasksReport> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(ReportingApiRoutes.GET_ACTIVITIES_SUMMARY_REPORT, {
        entityTypeId,
      }),
      filter
    );

    return TasksReport.fromDto(response.data);
  };

  getPipelineReport = async ({
    etId,
    filter,
  }: {
    etId: number;
    filter: SalesPipelineFilter;
  }): Promise<PipelineReport> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(ReportingApiRoutes.GET_PIPELINE_REPORT, {
        entityTypeId: etId,
      }),
      filter
    );

    return PipelineReport.fromDto(response.data);
  };
}

export const dashboardApi = new DashboardApi();
