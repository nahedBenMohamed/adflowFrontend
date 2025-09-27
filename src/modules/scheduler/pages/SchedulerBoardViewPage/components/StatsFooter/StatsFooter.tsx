import { HideScrollbarMixin, MediaBreakpoints, type Nullable, type Optional } from '@/shared';
import { Tooltip } from '@mantine/core';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import type { ScheduleAppointmentStatisticsDto } from '../../../../api';
import { ScheduleAppointmentStatisticsType, StatsIndicator } from '../../../../shared';

const Root = styled.footer<{ $loading?: boolean }>`
  position: fixed;
  bottom: 0;
  left: var(--sidebar-width);
  right: 0;

  min-width: calc(100% - var(--sidebar-width));
  height: var(--scheduler-statistics-height);

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;

  padding: 0 16px;
  overflow-x: auto;
  z-index: var(--header-z-index);
  border-top: 1px solid var(--graphite-graphite-80);
  background: var(--primary-statuses-white-0);
  box-shadow: 0px -4px 16px 0px rgba(0, 0, 0, 0.12);
  transition: var(--transition-200);

  ${p =>
    p.$loading &&
    css`
      cursor: wait;

      opacity: 0.7;
    `}

  ${HideScrollbarMixin}

  @media ${MediaBreakpoints.LG} {
    justify-content: flex-start;
    gap: 16px;

    padding: 0 12px;
  }
`;

interface Props {
  hiddenStatsTypes: ScheduleAppointmentStatisticsType[];
  statistics: Optional<ScheduleAppointmentStatisticsDto>;
  selectedFilter: Nullable<ScheduleAppointmentStatisticsType>;
  isLoading?: boolean;
  onSelectFilter: (type: Nullable<ScheduleAppointmentStatisticsType>) => void;
}

const StatsFooter = (props: Props) => {
  const { statistics, selectedFilter, isLoading, hiddenStatsTypes, onSelectFilter } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_board_view_page.stats_footer',
  });

  const handleGetIsActive = useCallback(
    (type: ScheduleAppointmentStatisticsType) => selectedFilter === type,
    [selectedFilter]
  );

  const handleSelectFilter = useCallback(
    (type: ScheduleAppointmentStatisticsType) => () => {
      if (selectedFilter === type) {
        onSelectFilter(null);

        return;
      }

      onSelectFilter(type);
    },
    [onSelectFilter, selectedFilter]
  );

  const getCount = useMemo<(type: ScheduleAppointmentStatisticsType) => Optional<number>>(
    () => type => {
      switch (type) {
        case ScheduleAppointmentStatisticsType.ASSIGNED:
          return statistics?.statuses.not_confirmed;

        case ScheduleAppointmentStatisticsType.CONFIRMED:
          return statistics?.statuses.confirmed;

        case ScheduleAppointmentStatisticsType.COMPLETED:
          return statistics?.statuses.completed;

        case ScheduleAppointmentStatisticsType.NOT_TOOK_PLACE:
          return statistics?.notTookPlace;

        case ScheduleAppointmentStatisticsType.NOT_SCHEDULED:
          return statistics?.notScheduled;

        case ScheduleAppointmentStatisticsType.NEWBIES:
          return statistics?.newbies;

        case ScheduleAppointmentStatisticsType.TOTAL:
          return statistics?.total;
      }
    },
    [statistics]
  );

  const shownStatisticsTypes = useMemo<ScheduleAppointmentStatisticsType[]>(
    () =>
      Array.from(Object.values(ScheduleAppointmentStatisticsType)).filter(
        v => !hiddenStatsTypes.includes(v)
      ),
    [hiddenStatsTypes]
  );

  if (shownStatisticsTypes.length === 0) return null;

  return (
    <Root $loading={isLoading}>
      <Tooltip.Group openDelay={600} closeDelay={300}>
        {shownStatisticsTypes.map(st => (
          <StatsIndicator
            key={st}
            label={t(`${st}.label`)}
            hint={t(`${st}.hint`)}
            count={getCount(st)}
            isActive={handleGetIsActive(st)}
            onClick={handleSelectFilter(st)}
          />
        ))}
      </Tooltip.Group>
    </Root>
  );
};

export { StatsFooter };
