import { baseApi } from '@/app';
import type { Nullable } from '@/shared';
import {
  CallHistoryReport,
  ComparativeReport,
  CustomerReport,
  GeneralReport,
  ProductsReport,
  ProjectEntitiesReport,
  ProjectTaskUserReport,
  ScheduleReport,
  TelephonyReport,
} from '../../shared';
import { ReportingApiRoutes } from '../ReportingApiRoutes';
import type {
  CallHistoryReportFilterDto,
  ComparativeReportFilterDto,
  CustomerReportFilterDto,
  GeneralReportFilterDto,
  ProductsReportFilterDto,
  ProjectEntitiesReportFilterDto,
  ProjectTaskUserReportFilterDto,
  ScheduleReportFilterDto,
  TelephonyReportFilterDto,
} from '../dtos';

export const CALL_HISTORY_REPORT_LIMIT = 20;
export const CUSTOMER_REPORT_LIMIT = 30;

class ReportApi {
  getGeneralReport = async (filter: GeneralReportFilterDto): Promise<GeneralReport> => {
    const response = await baseApi.post(ReportingApiRoutes.GET_GENERAL_REPORT, filter);

    return GeneralReport.fromDto(response.data);
  };

  getComparativeReport = async (filter: ComparativeReportFilterDto): Promise<ComparativeReport> => {
    const response = await baseApi.post(ReportingApiRoutes.GET_COMPARATIVE_REPORT, filter);

    return ComparativeReport.fromDto(response.data);
  };

  getTelephonyReport = async (filter: TelephonyReportFilterDto): Promise<TelephonyReport> => {
    const response = await baseApi.post(ReportingApiRoutes.GET_TELEPHONY_REPORT, filter);

    return TelephonyReport.fromDto(response.data);
  };

  getCallHistoryReport = async ({
    filter,
    offset = null,
  }: {
    filter: CallHistoryReportFilterDto;
    offset: Nullable<number>;
  }): Promise<CallHistoryReport> => {
    const response = await baseApi.post(ReportingApiRoutes.GET_CALL_HISTORY, filter, {
      params: {
        offset,
        limit: CALL_HISTORY_REPORT_LIMIT,
      },
    });

    return CallHistoryReport.fromDto(response.data);
  };

  getProjectTaskUserReport = async (
    filter: ProjectTaskUserReportFilterDto
  ): Promise<ProjectTaskUserReport> => {
    const response = await baseApi.post(ReportingApiRoutes.GET_PROJECT_TASK_USER_REPORT, filter);

    return ProjectTaskUserReport.fromDto(response.data);
  };

  getProjectEntitiesReport = async (
    filter: ProjectEntitiesReportFilterDto
  ): Promise<ProjectEntitiesReport> => {
    const response = await baseApi.post(ReportingApiRoutes.GET_PROJECT_ENTITIES_REPORT, filter);

    return ProjectEntitiesReport.fromDto(response.data);
  };

  getScheduleReport = async (filter: ScheduleReportFilterDto): Promise<ScheduleReport> => {
    const response = await baseApi.post(ReportingApiRoutes.GET_SCHEDULE_REPORT, filter);

    return ScheduleReport.fromDto(response.data);
  };

  getCustomerReport = async ({
    filter,
    offset = null,
  }: {
    filter: CustomerReportFilterDto;
    offset: Nullable<number>;
  }): Promise<CustomerReport> => {
    const response = await baseApi.post(ReportingApiRoutes.GET_CUSTOMER_REPORT, filter, {
      params: {
        offset,
        limit: CUSTOMER_REPORT_LIMIT,
      },
    });

    return CustomerReport.fromDto(response.data);
  };

  getProductsGeneralReport = async (filter: ProductsReportFilterDto): Promise<ProductsReport> => {
    const response = await baseApi.post(ReportingApiRoutes.GET_PRODUCTS_GENERAL_REPORT, filter);

    return ProductsReport.fromDto(response.data);
  };
}

export const reportApi = new ReportApi();
