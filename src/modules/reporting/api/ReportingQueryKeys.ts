import type { SalesPipelineFilter } from '../shared';
import type {
  CallHistoryReportFilterDto,
  ComparativeReportFilterDto,
  CustomerReportFilterDto,
  GeneralReportFilterDto,
  ProductsReportFilterDto,
  ProjectEntitiesReportFilterDto,
  ProjectTaskUserReportFilterDto,
  ReportFilter,
  ScheduleReportFilterDto,
  TelephonyReportFilterDto,
} from './dtos';

interface EntityTypeAndFilterArgsDashboard {
  etId: number;
  filter: ReportFilter | SalesPipelineFilter;
}

const queryKeys = {
  reporting: ['reporting'],
  generalReport(filter: GeneralReportFilterDto) {
    return [...this.reporting, 'general', filter];
  },
  comparativeReport(filter: ComparativeReportFilterDto) {
    return [...this.reporting, 'comparative', filter];
  },
  telephonyReport(filter: TelephonyReportFilterDto) {
    return [...this.reporting, 'telephony', filter];
  },
  callHistoryReport({ offset, filter }: { offset: number; filter: CallHistoryReportFilterDto }) {
    return [...this.reporting, 'call-history', offset, filter];
  },
  projectTaskUserReport(filter: ProjectTaskUserReportFilterDto) {
    return [...this.reporting, 'project-task-user', filter];
  },
  projectEntitiesReport(filter: ProjectEntitiesReportFilterDto) {
    return [...this.reporting, 'project-entities', filter];
  },
  scheduleReport(filter: ScheduleReportFilterDto) {
    return [...this.reporting, 'schedule', filter];
  },
  customerReport({ offset, filter }: { offset: number; filter: CustomerReportFilterDto }) {
    return [...this.reporting, 'customer', offset, filter];
  },
  dashboard() {
    return [...this.reporting, 'dashboard'];
  },
  pipelineReport({ etId, filter }: EntityTypeAndFilterArgsDashboard) {
    return [...this.dashboard(), 'pipeline-report', etId, filter];
  },
  salePlanReport({ etId, filter }: EntityTypeAndFilterArgsDashboard) {
    return [...this.dashboard(), 'sales-plan-report', etId, filter];
  },
  topSellers({ etId, filter }: EntityTypeAndFilterArgsDashboard) {
    return [...this.dashboard(), 'top-sellers', etId, filter];
  },
  rating({ etId, filter }: EntityTypeAndFilterArgsDashboard) {
    return [...this.dashboard(), 'rating', etId, filter];
  },
  entitySummaryReport({ etId, filter }: EntityTypeAndFilterArgsDashboard) {
    return [...this.dashboard(), 'entity-summary-report', etId, filter];
  },
  tasksSummaryReport({ etId, filter }: EntityTypeAndFilterArgsDashboard) {
    return [...this.dashboard(), 'tasks-summary-report', etId, filter];
  },
  activitiesSummaryReport({ etId, filter }: EntityTypeAndFilterArgsDashboard) {
    return [...this.dashboard(), 'activities-summary-report', etId, filter];
  },
  projectEntities({ entityTypeId, boardId }: { entityTypeId: number; boardId: number }) {
    return [...this.reporting, 'project-entities', entityTypeId, boardId];
  },
  productsGeneralReport(filter: ProductsReportFilterDto) {
    return [...this.reporting, 'products-general', filter];
  },
};

export const REPORTING_QUERY_KEYS = Object.freeze(queryKeys);
