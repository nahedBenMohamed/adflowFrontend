import { ChangePeriodControls, UtcDate } from '@/shared';
import type { DayHeaderContentArg } from '@fullcalendar/core';
import { memo } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  width: 100%;
  height: 72px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;

  padding: 0 24px 0 0;
  background: var(--primary-statuses-white-0);
`;

const Content = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
`;

const Text = styled.span`
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  content: DayHeaderContentArg;
  onChangeNextDate: () => void;
  onChangePrevDate: () => void;
}

const DayHeaderDayView = memo((props: Props) => {
  const { content, onChangeNextDate, onChangePrevDate } = props;

  const date = UtcDate.fromDate(content.date).format('D MMMM');

  return (
    <Root>
      <Content>
        <Text>
          {date} / {content.text}
        </Text>
      </Content>

      <ChangePeriodControls onClickPrev={onChangePrevDate} onClickNext={onChangeNextDate} />
    </Root>
  );
});

DayHeaderDayView.displayName = 'DayHeaderDayView';
export { DayHeaderDayView };
