import { SchedulePerformerType, useGetSchedules } from '@/modules/scheduler';
import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ReportsSection,
  reportSectionToScheduleReportTypeMap,
  type RenderTabs,
  type ScheduleReportType,
} from '../../../../../../../../shared';
import { CollapsibleGroup } from '../CollapsibleGroup/CollapsibleGroup';
import { StyledTab } from '../StyledTab/StyledTab';

interface Props {
  entityTypeId: number;
  scheduleReportSections: ReportsSection[];
  setScheduleReportTabs: Dispatch<SetStateAction<RenderTabs<ScheduleReportType>[]>>;
}

const generateCompositeValue = ({
  reportSection,
  scheduleId,
}: {
  reportSection: ReportsSection | string;
  scheduleId: number;
}): string => `${reportSection}_${scheduleId}`;

const DynamicScheduleTabList = (props: Props) => {
  const { entityTypeId, scheduleReportSections, setScheduleReportTabs } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.reports_page.components.reports_navigation_sidebar',
  });

  const { data: schedules } = useGetSchedules({
    entityTypeId,
  });

  useEffect(() => {
    if (!schedules) return;

    const tabs: RenderTabs<ScheduleReportType>[] = [];

    schedules.forEach(s =>
      reportSectionToScheduleReportTypeMap.forEach(d => {
        // we should not show performer tab for schedule with department performers
        if (
          s.performersType === SchedulePerformerType.DEPARTMENT &&
          d.value === ReportsSection.SCHEDULE_PERFORMER
        )
          return;

        tabs.push({
          value: generateCompositeValue({ reportSection: d.value, scheduleId: s.id }),
          reportType: d.reportType,
        });
      })
    );

    setScheduleReportTabs(prev => {
      const oldTabs = prev.filter(t => !tabs.map(t => t.value).includes(t.value));

      return [...oldTabs, ...tabs];
    });
  }, [schedules, setScheduleReportTabs]);

  return (
    schedules &&
    schedules.map(s => (
      <CollapsibleGroup key={s.id} title={s.name}>
        {scheduleReportSections.map(section => {
          // we should not show performer tab for schedule with department performers
          if (
            s.performersType === SchedulePerformerType.DEPARTMENT &&
            section === ReportsSection.SCHEDULE_PERFORMER
          )
            return null;

          return (
            <StyledTab
              key={section}
              value={generateCompositeValue({ reportSection: section, scheduleId: s.id })}
            >
              {t(section)}
            </StyledTab>
          );
        })}
      </CollapsibleGroup>
    ))
  );
};

export { DynamicScheduleTabList };
