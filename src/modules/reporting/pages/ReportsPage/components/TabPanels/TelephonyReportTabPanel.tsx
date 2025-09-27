import { Tabs } from '@mantine/core';
import {
  CallHistoryReportType,
  ReportsSection,
  TelephonyReportType,
  type RenderTabs,
  type ReportTabPanelProps,
} from '../../../../shared';
import { CallHistoryReportTemplate, TelephonyReportTemplate } from '../../../../templates';

const telephonyReportTabs = [
  { value: ReportsSection.TELEPHONY_USERS, reportType: TelephonyReportType.TELEPHONY_USERS },
  { value: ReportsSection.TELEPHONY_GROUPS, reportType: TelephonyReportType.TELEPHONY_GROUPS },
  { value: ReportsSection.CALL_HISTORY, reportType: CallHistoryReportType.HISTORY },
] as RenderTabs<TelephonyReportType | CallHistoryReportType>[];

interface Props extends ReportTabPanelProps {
  entityTypeId: number;
}

const TelephonyReportTabPanel = (props: Props) => {
  return telephonyReportTabs.map(({ value, reportType }) => (
    <Tabs.Panel key={value} w="100%" value={value}>
      {value === ReportsSection.CALL_HISTORY ? (
        <CallHistoryReportTemplate {...props} reportType={reportType as CallHistoryReportType} />
      ) : (
        <TelephonyReportTemplate {...props} reportType={reportType as TelephonyReportType} />
      )}
    </Tabs.Panel>
  ));
};

export { TelephonyReportTabPanel };
