import { UtcDate } from '@/shared';
import type { DayHeaderContentArg } from '@fullcalendar/core';
import { memo } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  height: 72px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2px;

  padding: 2px;
  background: var(--primary-statuses-white-0);
`;

const WeekName = styled.span`
  width: 100%;

  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  text-align: center;
  color: var(--button-text-graphite-primary-text);
`;

const DateWrapper = styled.div<{ $today?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 1px 8px 2px 8px;
  border-radius: var(--border-radius-element);
  background: transparent;

  ${p => p.$today && `background: var(--primary-statuses-green-520)`};
`;

const Date = styled.span<{ $today?: boolean }>`
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  text-align: center;
  color: var(--button-text-graphite-priory-text);

  ${p => p.$today && `color: var(--primary-statuses-white-0)`};
`;

interface Props {
  content: DayHeaderContentArg;
}

const DayHeaderWeekView = memo((props: Props) => {
  const { content } = props;

  const date = UtcDate.fromDate(content.date).day;

  return (
    <Root>
      <WeekName>{content.text}</WeekName>

      <DateWrapper $today={content.isToday}>
        <Date $today={content.isToday}>{date}</Date>
      </DateWrapper>
    </Root>
  );
});

DayHeaderWeekView.displayName = 'DayHeaderWeekView';
export { DayHeaderWeekView };
