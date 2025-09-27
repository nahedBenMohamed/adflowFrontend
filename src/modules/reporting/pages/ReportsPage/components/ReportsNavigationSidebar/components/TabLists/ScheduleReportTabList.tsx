import { SchedulePerformerType, type Schedule } from '@/modules/scheduler';
import type { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { ReportsSection, type RenderTabs, type ScheduleReportType } from '../../../../../../shared';
import { CollapsibleGroup, DynamicScheduleTabList, StyledTab } from './components';

const scheduleReportSections = [
  ReportsSection.SCHEDULE_CLIENT,
  ReportsSection.SCHEDULE_DEPARTMENT,
  ReportsSection.SCHEDULE_OWNER,
  ReportsSection.SCHEDULE_PERFORMER,
];

interface Props {
  schedule?: Schedule;
  entityTypeId?: number;
  setScheduleReportTabs: Dispatch<SetStateAction<RenderTabs<ScheduleReportType>[]>>;
}

const ScheduleReportTabList = (props: Props) => {
  const { entityTypeId, schedule, setScheduleReportTabs } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.reports_page.components.reports_navigation_sidebar',
  });

  if (schedule) {
    // we should not show performer tab for schedule with department performers
    const sections =
      schedule.performersType === SchedulePerformerType.DEPARTMENT
        ? scheduleReportSections.filter(s => s !== ReportsSection.SCHEDULE_PERFORMER)
        : scheduleReportSections;

    return (
      <CollapsibleGroup title={t('schedule')}>
        {sections.map(s => (
          <StyledTab key={s} value={s}>
            {t(s)}
          </StyledTab>
        ))}
      </CollapsibleGroup>
    );
  }

  if (!entityTypeId)
    throw new Error(`Failed to render DynamicScheduleTabList: entityTypeId is not defined`);

  return (
    <DynamicScheduleTabList
      entityTypeId={entityTypeId}
      scheduleReportSections={scheduleReportSections}
      setScheduleReportTabs={setScheduleReportTabs}
    />
  );
};

export { ScheduleReportTabList };
