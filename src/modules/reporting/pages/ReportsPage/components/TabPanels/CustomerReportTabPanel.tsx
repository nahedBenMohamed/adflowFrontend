import { Tabs } from '@mantine/core';
import {
  CustomerReportType,
  ReportsSection,
  type RenderTabs,
  type ReportTabPanelProps,
} from '../../../../shared';
import { CustomerReportTemplate } from '../../../../templates';

const customerReportTabs: RenderTabs<CustomerReportType>[] = [
  { value: ReportsSection.CUSTOMER_CONTACT, reportType: CustomerReportType.CUSTOMER_CONTACT },
  { value: ReportsSection.CUSTOMER_COMPANY, reportType: CustomerReportType.CUSTOMER_COMPANY },
  {
    value: ReportsSection.CUSTOMER_CONTACT_COMPANY,
    reportType: CustomerReportType.CUSTOMER_CONTACT_COMPANY,
  },
];

interface Props extends ReportTabPanelProps {
  entityTypeId: number;
}

const CustomerReportTabPanel = (props: Props) => {
  return customerReportTabs.map(({ value, reportType }) => (
    <Tabs.Panel key={value} w="100%" value={value}>
      <CustomerReportTemplate {...props} reportType={reportType} />
    </Tabs.Panel>
  ));
};

export { CustomerReportTabPanel };
