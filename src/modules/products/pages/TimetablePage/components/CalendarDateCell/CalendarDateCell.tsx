import type { SlotLabelContentArg } from '@fullcalendar/core';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CalendarGridView } from '../../../../shared';

const DateCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
  color: var(--button-text-graphite-priory-text);

  padding: 0 8px 8px 8px;
`;

const DateDayNumber = styled.div<{ $today: boolean }>`
  width: 26px;
  height: 26px;

  font-size: 16px;
  font-weight: 700;
  line-height: 26px;
  color: ${p =>
    p.$today ? 'var(--primary-statuses-white-0)' : 'var(--button-text-graphite-priory-text)'};

  border-radius: 50%;
  background: ${p => (p.$today ? 'var(--primary-statuses-green-520)' : 'transparent')};
`;

interface Props {
  slot: SlotLabelContentArg;
}

const DAYS = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];

const todayDate = new Date();
todayDate.setHours(0, 0, 0, 0);

const CalendarDateCell = memo((props: Props) => {
  const { slot } = props;

  const days_translation =
    slot.view.type === CalendarGridView.HORIZONTAL_MONTH ? 'days.short' : 'days.long';

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.components.common.calendar',
  });

  return (
    <DateCell>
      <DateDayNumber $today={slot.date.getTime() === todayDate.getTime()}>
        {slot.date.getDate()}
      </DateDayNumber>

      <div>{t(`${days_translation}.${DAYS[slot.date.getDay()]}`)}</div>
    </DateCell>
  );
});

CalendarDateCell.displayName = 'CalendarDateCell';
export { CalendarDateCell };
