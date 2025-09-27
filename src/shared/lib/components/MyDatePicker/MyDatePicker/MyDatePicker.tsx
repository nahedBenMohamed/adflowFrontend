import { generalSettingsStore } from '@/app';
import type { DatesRangeValue, DateValue, DayOfWeek } from '@mantine/dates';
import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import { UtcDate, type MyDatePickerCommonProps, type UtcDateValue } from '../../../models';
import type { Optional } from '../../../types';
import { StyledDatePicker } from '../components';

import 'dayjs/locale/en';
import 'dayjs/locale/fr';
import 'dayjs/locale/ru';

export interface MyDatePickerProps extends MyDatePickerCommonProps {
  value: UtcDateValue;
  onChange: (value: UtcDateValue) => void;
}

const MyDatePicker = observer((props: MyDatePickerProps) => {
  const { value, onChange, ...rest } = props;

  const [dateValue, setDateValue] = useState<DateValue>(() => value?.toDate() ?? null);

  const handleChange = useCallback(
    (value: DateValue | DatesRangeValue | Date[]) => {
      if (value instanceof Array) return;

      setDateValue(value);

      onChange(UtcDate.fromNullableDate(value));
    },
    [onChange]
  );

  return (
    <StyledDatePicker
      type="default"
      defaultDate={value?.toDate()}
      value={dateValue}
      firstDayOfWeek={generalSettingsStore.startOfWeekAsNumber as Optional<DayOfWeek>}
      locale={generalSettingsStore.accountSettings?.language}
      onChange={handleChange}
      {...rest}
    />
  );
});

MyDatePicker.displayName = 'MyDatePicker';
export { MyDatePicker };
