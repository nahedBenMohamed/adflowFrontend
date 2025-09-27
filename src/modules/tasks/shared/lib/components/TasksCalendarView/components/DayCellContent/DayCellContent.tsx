import { TaskCalendarViewType } from '@/modules/tasks';
import type { DayCellContentArg } from '@fullcalendar/core';
import { memo } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
`;

const DateWrapper = styled.div<{ $today?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 1px 8px 2px;
  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  &:active {
    background: var(--graphite-graphite-80);
  }

  ${p => p.$today && `background: var(--primary-statuses-green-520)`};
`;

const Date = styled.span<{ $today?: boolean }>`
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-priory-text);

  ${p => p.$today && `color: var(--primary-statuses-white-0)`};
`;

interface Props {
  content: DayCellContentArg;
}

const DayCellContent = memo((props: Props) => {
  const { content } = props;

  if (
    content.view.type === TaskCalendarViewType.DAY ||
    content.view.type === TaskCalendarViewType.WEEK
  )
    return null;

  return (
    <Root>
      <DateWrapper $today={content.isToday}>
        <Date $today={content.isToday}>{content.dayNumberText}</Date>
      </DateWrapper>
    </Root>
  );
});

DayCellContent.displayName = 'DayCellContent';
export { DayCellContent };
