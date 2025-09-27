import type { Nullable } from '@/shared';
import { Tabs } from '@mantine/core';
import type { RenderTabs, ReportTabPanelProps, ScheduleReportType } from '../../../../shared';
import { ScheduleReportTemplate } from '../../../../templates';

interface Props extends ReportTabPanelProps {
  scheduleReportTabs: RenderTabs<ScheduleReportType>[];
  scheduleEntityTypeId: Nullable<number>;
  scheduleId?: number;
}

const ScheduleReportTabPanel = (props: Props) => {
  const { scheduleReportTabs, scheduleId, ...rest } = props;

  return scheduleReportTabs.map(({ value, reportType }) => {
    const parsedIdFromValue = value.split('_')[1];
    const id = parsedIdFromValue ? Number(parsedIdFromValue) : scheduleId;

    if (!id)
      throw new Error(
        `Failed to render ScheduleReportTabPanel, scheduleId is not specified not in scheduleReportTabs value nor in scheduleId prop`
      );

    return (
      <Tabs.Panel key={value} w="100%" value={value}>
        <ScheduleReportTemplate {...rest} scheduleId={id} reportType={reportType} />
      </Tabs.Panel>
    );
  });
};

export { ScheduleReportTabPanel };
