import { DefaultLoader, EmptyTableBlock } from '@/shared';
import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useGetInfiniteScheduleAppointments } from '../../../../../../../api';
import type { GetScheduleAppointmentsQueryParams, Schedule } from '../../../../../models';
import { AppointmentPlannedVisit } from './components';

const DefaultLoaderWrapper = styled.div`
  width: 100%;
  height: 320px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Root = styled.div<{ $openedFromCard?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${p => p.$openedFromCard && `padding: 0 16px 16px`};
`;

const AppointmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

interface Props {
  entityId: number;
  schedule: Schedule;
  dateNow: string;
  queryParams?: GetScheduleAppointmentsQueryParams;
  openedFromCard?: boolean;
}

const AppointmentPlannedVisits = (props: Props) => {
  const { entityId, schedule, queryParams, dateNow, openedFromCard } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page.ui.add_appointment_modal',
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetInfiniteScheduleAppointments({
      // should match AppointmentsTabsListHeader query params, which it passes in AddAppointmentModal
      // to add appointment from planned visits tab
      entityId,
      startDate: dateNow,
      scheduleId: schedule.id,
    });

  const observer = useRef<IntersectionObserver>(null);

  const lastAppointmentRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetchingNextPage) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0]?.isIntersecting && hasNextPage) fetchNextPage();
      });

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  return (
    <Root $openedFromCard={openedFromCard}>
      {data?.pages?.[0]?.appointments?.length ? (
        data.pages.map((page, pageIndex) => (
          <AppointmentsList key={pageIndex}>
            {page.appointments.map((a, idx) => {
              const isLastVisit =
                pageIndex === data.pages.length - 1 && idx === page.appointments.length - 1;

              return (
                <AppointmentPlannedVisit
                  key={a.id}
                  ref={isLastVisit ? lastAppointmentRef : null}
                  appointment={a}
                  schedule={schedule}
                  queryParams={queryParams}
                  openedFromCard={openedFromCard}
                />
              );
            })}
          </AppointmentsList>
        ))
      ) : isLoading ? (
        <DefaultLoaderWrapper>
          <DefaultLoader />
        </DefaultLoaderWrapper>
      ) : (
        <EmptyTableBlock $height="320px">{t('no_planned_visits')}</EmptyTableBlock>
      )}
    </Root>
  );
};

export { AppointmentPlannedVisits };
