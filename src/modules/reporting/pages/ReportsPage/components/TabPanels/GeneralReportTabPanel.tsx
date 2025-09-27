import { Tabs } from '@mantine/core';
import {
  GeneralReportType,
  ReportsSection,
  type RenderTabs,
  type ReportTabPanelProps,
} from '../../../../shared';
import { GeneralReportTemplate } from '../../../../templates';

const generalReportTabs = [
  { value: ReportsSection.USERS, reportType: GeneralReportType.USER },
  { value: ReportsSection.RATING, reportType: GeneralReportType.RATING },
  { value: ReportsSection.GROUPS, reportType: GeneralReportType.DEPARTMENT },
] as RenderTabs<GeneralReportType>[];

interface Props extends ReportTabPanelProps {
  entityTypeId: number;
}

const GeneralReportTabPanel = (props: Props) => {
  return generalReportTabs.map(({ value, reportType }) => (
    <Tabs.Panel key={value} w="100%" value={value}>
      <GeneralReportTemplate {...props} reportType={reportType} />
    </Tabs.Panel>
  ));
};

export { GeneralReportTabPanel };
