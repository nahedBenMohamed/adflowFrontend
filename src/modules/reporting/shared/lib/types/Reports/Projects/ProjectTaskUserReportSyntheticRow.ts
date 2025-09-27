import type { ProjectTaskUserReportRow, ProjectTaskUserReportTotalRow } from '../../../models';
import type { ReportSyntheticRow } from '../ReportSyntheticRow';

export type ProjectTaskUserReportSyntheticRow = ReportSyntheticRow<
  ProjectTaskUserReportRow | ProjectTaskUserReportTotalRow
>;
