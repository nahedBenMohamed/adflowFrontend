import type { PossibleReportType } from './PossibleReportType';
import type { ReportTabPanelProps } from './ReportTabPanelProps';

export interface ReportTemplateProps<T extends PossibleReportType> extends ReportTabPanelProps {
  reportType: T;
}
