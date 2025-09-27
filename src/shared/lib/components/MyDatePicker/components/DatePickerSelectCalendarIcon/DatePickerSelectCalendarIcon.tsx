import { memo } from 'react';
import styled from 'styled-components';
import { CalendarEndDateIcon, CalendarIcon } from '../../../../../assets';

const Root = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export type DatePickerSelectCalendarIconType = 'start' | 'end';

interface Props {
  type?: DatePickerSelectCalendarIconType;
}

const DatePickerSelectCalendarIcon = memo((props: Props) => {
  const { type = 'start' } = props;

  return <Root>{type === 'start' ? <CalendarIcon /> : <CalendarEndDateIcon />}</Root>;
});

DatePickerSelectCalendarIcon.displayName = 'DatePickerSelectCalendarIcon';
export { DatePickerSelectCalendarIcon };
