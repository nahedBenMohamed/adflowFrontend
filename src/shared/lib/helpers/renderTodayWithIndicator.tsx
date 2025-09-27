import { type ReactNode } from 'react';
import { MyIndicator } from '../components';

export const renderTodayWithIndicator = (date: Date): ReactNode => {
  const currentDate = new Date();

  // set the time components of both date objects to zero
  currentDate.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  // compare the dates based on day, month, and year
  if (currentDate.getTime() === date.getTime())
    return (
      <MyIndicator color="var(--button-text-red-active)" size={6} offset={-5}>
        <div>{date.getDate()}</div>
      </MyIndicator>
    );
};
