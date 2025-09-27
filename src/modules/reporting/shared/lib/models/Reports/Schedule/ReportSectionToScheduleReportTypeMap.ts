import type { RenderTabs } from '../RenderTabs';
import { ReportsSection } from '../ReportsSection';
import { ScheduleReportType } from './ScheduleReportType';

export const reportSectionToScheduleReportTypeMap: RenderTabs<ScheduleReportType>[] = [
  { value: ReportsSection.SCHEDULE_CLIENT, reportType: ScheduleReportType.CLIENT },
  { value: ReportsSection.SCHEDULE_DEPARTMENT, reportType: ScheduleReportType.DEPARTMENT },
  { value: ReportsSection.SCHEDULE_OWNER, reportType: ScheduleReportType.OWNER },
  { value: ReportsSection.SCHEDULE_PERFORMER, reportType: ScheduleReportType.PERFORMER },
];
