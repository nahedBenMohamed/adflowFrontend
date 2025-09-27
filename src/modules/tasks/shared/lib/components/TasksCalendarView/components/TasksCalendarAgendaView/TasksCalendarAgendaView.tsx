import { TruncateMixin, UtcDate } from '@/shared';
import { createPlugin, sliceEvents } from '@fullcalendar/core';
import type { ViewProps } from '@fullcalendar/core/internal';
import styled from 'styled-components';
import { generateDatesRange, groupEventsByDate } from '../../../../helpers';
import { TaskEventAgendaView } from '../TaskEvent/TaskEventAgendaView';

const Root = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  overflow-y: auto;
  overflow-x: hidden;
`;

const DayWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  padding: 8px 24px;
  border-bottom: 1px solid var(--graphite-graphite-80);
`;

const DateWrapper = styled.div`
  width: 120px;
  min-width: 120px;

  display: flex;
  align-items: center;
  gap: 12px;
`;

const DayNumberWrapper = styled.div<{ $today?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 1px 8px 2px;
  border-radius: var(--border-radius-element);

  ${p => p.$today && `background: var(--primary-statuses-green-520)`};
`;

const DayNumber = styled.span<{ $today?: boolean }>`
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  text-align: center;
  color: var(--button-text-graphite-priory-text);

  font-variant-numeric: tabular-nums;

  ${p => p.$today && `color: var(--primary-statuses-white-0)`};
`;

const MonthAndWeekday = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  white-space: nowrap;
`;

const Content = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  ${TruncateMixin}
`;

const NoEventsContainer = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  line-height: 1;
  font-size: 32px;
  font-weight: 400;
  text-align: center;
  color: var(--button-text-graphite-priory-text);
`;

const TasksCalendarAgendaView = (props: ViewProps) => {
  const segments = sliceEvents(
    {
      ...props,
      nextDayThreshold: {
        days: 1,
        years: 0,
        months: 0,
        milliseconds: 0,
      },
    },
    true
  );

  const dates = generateDatesRange({
    startDate: props.dateProfile.currentRange.start,
    endDate: props.dateProfile.currentRange.end,
  });
  const eventsByDate = groupEventsByDate(segments);

  if (eventsByDate.size === 0) return <NoEventsContainer>{'📭'}</NoEventsContainer>;

  return (
    <Root>
      {dates.map(date => {
        const dateKey = UtcDate.fromDate(date).format('YYYY-MM-DD');
        const dayEvents = eventsByDate.get(dateKey);

        // Skip rendering this day if there are no events
        if (!dayEvents || dayEvents.length === 0) return null;

        const isToday = UtcDate.fromDate(date).isToday();

        return (
          <DayWrapper key={dateKey}>
            <DateWrapper>
              <DayNumberWrapper $today={isToday}>
                <DayNumber $today={isToday}>
                  {String(UtcDate.fromDate(date).day).padStart(2, '0')}
                </DayNumber>
              </DayNumberWrapper>

              <MonthAndWeekday>{UtcDate.fromDate(date).format('MMM, ddd')}</MonthAndWeekday>
            </DateWrapper>

            <Content>
              {dayEvents.map((e, idx) => (
                <TaskEventAgendaView
                  key={idx}
                  title={e.title}
                  task={e.extendedProps.task}
                  endDate={e.extendedProps.task.endDate}
                  startDate={e.extendedProps.task.startDate}
                />
              ))}
            </Content>
          </DayWrapper>
        );
      })}
    </Root>
  );
};

export const agendaPlugin = createPlugin({
  name: 'agendaPlugin',
  views: {
    agenda: {
      type: 'custom',
      duration: { months: 1 },
      component: TasksCalendarAgendaView,
    },
  },
});
