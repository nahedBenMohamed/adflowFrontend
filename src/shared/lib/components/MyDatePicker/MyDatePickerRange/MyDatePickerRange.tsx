import { generalSettingsStore } from '@/app';
import type { Optional } from '@/shared';
import type { DatesRangeValue, DateValue, DayOfWeek } from '@mantine/dates';
import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import { checkDatesRangesOverlap } from '../../../helpers';
import { UtcDate, type MyDatePickerCommonProps, type UtcDatesRangeValue } from '../../../models';
import { StyledDatePicker } from '../components';

export interface MyDatePickerRangeProps extends MyDatePickerCommonProps {
  values: UtcDatesRangeValue;
  allowSingleDateInRange?: boolean;
  disabledDatesRanges?: UtcDatesRangeValue[];
  onChange: (value: UtcDatesRangeValue) => void;
}

const MyDatePickerRange = observer((props: MyDatePickerRangeProps) => {
  const {
    values: [fromDate, toDate],
    disabledDatesRanges,
    onChange,
    ...rest
  } = props;

  const [rangeDateValue, setRangeDateValue] = useState<DatesRangeValue>(() => [
    fromDate ? fromDate.toDate() : null,
    toDate ? toDate.toDate() : null,
  ]);

  const handleChange = useCallback(
    (range: DatesRangeValue | DateValue | Date[]) => {
      if (!range || !(range instanceof Array)) return;

      const start = range[0];
      const end = range[1];

      let isOverlap = false;

      if (disabledDatesRanges) {
        for (const [disabledFromDate, disabledToDate] of disabledDatesRanges) {
          if (
            disabledFromDate &&
            disabledToDate &&
            checkDatesRangesOverlap({
              firstRangeStart: start ? start.getTime() : Number.NEGATIVE_INFINITY,
              firstRangeEnd: end ? end.getTime() : Number.POSITIVE_INFINITY,
              secondRangeStart: disabledFromDate.toDate().getTime(),
              secondRangeEnd: disabledToDate.toDate().getTime(),
            })
          ) {
            isOverlap = true;

            break;
          }
        }
      }

      if (isOverlap) {
        const startDate = start ? UtcDate.fromDate(start).startOfDay() : null;

        setRangeDateValue([startDate ? startDate.toDate() : null, null]);

        onChange([startDate, null]);
      } else {
        const startDate = start ? UtcDate.fromDate(start).startOfDay() : null;
        const endDate = end ? UtcDate.fromDate(end).endOfDay() : null;

        setRangeDateValue([
          startDate ? startDate.toDate() : null,
          endDate ? endDate.toDate() : null,
        ]);

        onChange([startDate, endDate]);
      }
    },
    [disabledDatesRanges, onChange]
  );

  return (
    <StyledDatePicker
      type="range"
      {...rest}
      value={rangeDateValue}
      firstDayOfWeek={generalSettingsStore.startOfWeekAsNumber as Optional<DayOfWeek>}
      locale={generalSettingsStore.accountSettings?.language}
      getDayProps={date => {
        if (!disabledDatesRanges) return {};

        let isDisabled = disabledDatesRanges.some(([disabledFromDate, disabledToDate]) =>
          // check if date inside disabled range
          disabledFromDate && disabledToDate
            ? date >= disabledFromDate.toDate() && date <= disabledToDate.toDate()
            : false
        );

        return isDisabled
          ? {
              disabled: true,
              style: { opacity: 0.65, backgroundColor: 'var(--graphite-graphite-80)' },
            }
          : {};
      }}
      onChange={handleChange}
    />
  );
});

MyDatePickerRange.displayName = 'MyDatePickerRange';
export { MyDatePickerRange };
