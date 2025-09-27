import type { DayHeaderContentArg } from '@fullcalendar/core';
import { memo } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  width: 100%;

  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  text-align: center;
  color: var(--button-text-graphite-primary-text);
`;

interface Props {
  content: DayHeaderContentArg;
}

const DayHeaderMonthView = memo((props: Props) => {
  const { content } = props;

  return <Root>{content.text}</Root>;
});

DayHeaderMonthView.displayName = 'DayHeaderMonthView';
export { DayHeaderMonthView };
