import { HideScrollbarMixin, MyIndicator, truncateNumber, useTransformScroll } from '@/shared';
import { Tabs } from '@mantine/core';
import { memo, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { ScheduleAppointmentModalTabs } from '../../../../models';

const Root = styled.div<{ $openedFromCard?: boolean }>`
  position: sticky;
  top: 0;

  width: 100%;
  height: var(--subheader-height);

  display: flex;

  z-index: 10;

  overflow: auto hidden;

  background-color: var(--primary-statuses-white-0);
  border-bottom: 1px solid var(--graphite-graphite-80);
  padding: 4px 16px 0 ${p => (p.$openedFromCard ? 12 : 28)}px;

  ${HideScrollbarMixin}
`;

const TabsList = styled(Tabs.List)`
  border: none;

  height: 30px;
  width: fit-content;

  z-index: 10;

  gap: 16px;
  display: flex;
  flex-wrap: nowrap;
  flex-shrink: 0;
`;

const StyledTab = styled(Tabs.Tab)<{ $withIndicator?: boolean }>`
  border: none;
  margin: 0;

  position: relative;

  height: 30px;

  .mantine-Tabs-tabLabel {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .mantine-Indicator-indicator {
    top: 1px;
    right: -10px;
  }

  font-size: 14px;
  font-weight: 400;
  color: var(--button-text-graphite-primary-text);

  padding: 4px 4px 6px;
  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  &::after {
    content: '';

    position: absolute;
    left: 0;
    bottom: -5px;

    height: 2px;
    width: 100%;

    background: transparent;
    border-radius: 2px 2px 0 0;
    transition: var(--transition-200);
  }

  &:hover {
    border: none;

    color: var(--graphite-graphite-840);

    background: var(--graphite-graphite-40);
  }

  &:active {
    border: none;

    color: var(--graphite-graphite-840);

    background-color: transparent;

    &::after {
      background: var(--button-text-green-default);
    }
  }

  &[data-active] {
    border: none;

    color: var(--graphite-graphite-840);

    background-color: transparent;

    &::after {
      background: var(--button-text-green-default);
    }
  }

  &:focus {
    outline: none;

    border: none;

    color: var(--graphite-graphite-840);

    background-color: transparent;

    &::after {
      background: var(--button-text-green-default);
    }
  }

  ${p => p.$withIndicator && `padding: 4px 18px 6px 4px`};
`;

export const AppointmentsCount = styled.span<{ $small: boolean }>`
  font-weight: 400;
  font-size: 10px;
  line-height: 14px;
  color: var(--primary-statuses-white-0);

  ${p =>
    p.$small &&
    css`
      font-size: 8px;
      line-height: 12px;
    `}
`;

const ControlsWrapper = styled.div`
  width: max-content;

  margin: 0 16px 0 auto;
`;

interface Props {
  Controls: ReactNode;
  showPlannedAndHistoryTabs: boolean;
  openedFromCard?: boolean;
  plannedAppointmentsCount?: number;
  previousAppointmentsCount?: number;
}

const AppointmentsTabsListHeaderComponent = memo((props: Props) => {
  const {
    Controls,
    showPlannedAndHistoryTabs,
    openedFromCard,
    plannedAppointmentsCount,
    previousAppointmentsCount,
  } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page.ui.add_appointment_modal',
  });

  const ref = useRef<HTMLDivElement>(null);

  useTransformScroll(ref);

  const isPlannedAppointmentsCountLong = Boolean(
    plannedAppointmentsCount && plannedAppointmentsCount > 99
  );
  const isPreviousAppointmentsCountLong = Boolean(
    previousAppointmentsCount && previousAppointmentsCount > 99
  );

  return (
    <Root ref={ref} $openedFromCard={openedFromCard}>
      {/* Tabs located in a strategic order, change carefully */}
      <TabsList>
        <StyledTab value={ScheduleAppointmentModalTabs.GENERAL_INFORMATION}>
          {t('general_information')}
        </StyledTab>

        {showPlannedAndHistoryTabs && (
          <>
            <StyledTab value={ScheduleAppointmentModalTabs.VISITS_HISTORY} $withIndicator>
              <MyIndicator
                size={16}
                disabled={!previousAppointmentsCount}
                offset={isPreviousAppointmentsCountLong ? 2 : 3}
                label={
                  <AppointmentsCount $small={isPreviousAppointmentsCountLong}>
                    {truncateNumber({ num: previousAppointmentsCount ?? 0, precision: 4 })}
                  </AppointmentsCount>
                }
              >
                {t('visits_history')}
              </MyIndicator>
            </StyledTab>

            <StyledTab
              value={ScheduleAppointmentModalTabs.PLANNED_VISITS}
              $withIndicator={Boolean(plannedAppointmentsCount)}
            >
              <MyIndicator
                size={16}
                disabled={!plannedAppointmentsCount}
                offset={isPlannedAppointmentsCountLong ? 2 : 3}
                label={
                  <AppointmentsCount $small={isPlannedAppointmentsCountLong}>
                    {truncateNumber({ num: plannedAppointmentsCount ?? 0, precision: 4 })}
                  </AppointmentsCount>
                }
              >
                {t('planned_visits')}
              </MyIndicator>
            </StyledTab>
          </>
        )}
      </TabsList>

      <ControlsWrapper>{Controls}</ControlsWrapper>
    </Root>
  );
});

AppointmentsTabsListHeaderComponent.displayName = 'AppointmentsTabsListHeaderComponent';
export { AppointmentsTabsListHeaderComponent };
