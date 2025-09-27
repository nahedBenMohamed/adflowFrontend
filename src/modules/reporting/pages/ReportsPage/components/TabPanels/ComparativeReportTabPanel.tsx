import { Tabs } from '@mantine/core';
import {
  ComparativeReportType,
  ReportsSection,
  type RenderTabs,
  type ReportTabPanelProps,
} from '../../../../shared';
import { ComparativeReportTemplate } from '../../../../templates';

const comparativeReportTabs = [
  { value: ReportsSection.DAYS, reportType: ComparativeReportType.DAY },
  { value: ReportsSection.WEEKS, reportType: ComparativeReportType.WEEK },
  { value: ReportsSection.MONTHS, reportType: ComparativeReportType.MONTH },
  { value: ReportsSection.QUARTERS, reportType: ComparativeReportType.QUARTER },
  { value: ReportsSection.YEARS, reportType: ComparativeReportType.YEAR },
] as RenderTabs<ComparativeReportType>[];

interface Props extends ReportTabPanelProps {
  entityTypeId: number;
}

const ComparativeReportTabPanel = (props: Props) => {
  return comparativeReportTabs.map(({ value, reportType }) => (
    <Tabs.Panel key={value} w="100%" value={value}>
      <ComparativeReportTemplate {...props} reportType={reportType} />
    </Tabs.Panel>
  ));
};

export { ComparativeReportTabPanel };
