import { generalSettingsStore } from '@/app';
import type { FloatingPosition } from '@mantine/core';
import type { DatesRangeValue, DateValue, DayOfWeek } from '@mantine/dates';
import { useDidUpdate, useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { generateMyDatePickerRangeTitle, renderTodayWithIndicator } from '../../../helpers';
import { DatePeriodType, UtcDate, type UtcDateValue } from '../../../models';
import type { Nullable, Optional } from '../../../types';
import { MySelectTitle } from '../../Form/MySelect/components';
import { MyDropdown } from '../../MyDropdown/MyDropdown';
import { StyledDatePicker } from '../components';
import { DatePeriodSegmentedControl } from './components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  padding: 8px;
`;

interface Props {
  to?: UtcDateValue;
  from?: UtcDateValue;
  position?: FloatingPosition;
  withinPortal?: boolean;
  activeBgColor?: boolean;
  handleChangeFrom: (date: UtcDateValue) => void;
  handleChangeTo: (date: UtcDateValue) => void;
}

const MyDatePeriodPicker = (props: Props) => {
  const { to, from, position, withinPortal, activeBgColor, handleChangeFrom, handleChangeTo } =
    props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.common.filter_button.ui.date_period_picker',
  });

  const [datePeriodType, setDatePeriodType] = useState<string>(DatePeriodType.PERIOD);
  const [opened, { close: hide, open: show }] = useDisclosure(false);

  const [rangeValue, setRangeValue] = useState<[Nullable<Date>, Nullable<Date>]>(() => {
    if (datePeriodType !== DatePeriodType.PERIOD) return [null, null];

    return [from ? from.toDate() : null, to ? to.toDate() : null];
  });

  const [value, setValue] = useState<Nullable<Date>>(() => {
    if (datePeriodType === DatePeriodType.FROM) return from ? from.toDate() : null;

    if (datePeriodType === DatePeriodType.TO) return to ? to.toDate() : null;

    return null;
  });

  const handleChangeRange = (range: DatesRangeValue | DateValue | Date[]) => {
    if (!range || !(range instanceof Array) || range.length > 2) return;

    setRangeValue(range as DatesRangeValue);

    if (datePeriodType === DatePeriodType.PERIOD) {
      handleChangeFrom(UtcDate.fromNullableDate(range[0])?.startOfDay() ?? null);

      // if user have not selected TO date, we set it to the same day as FROM date, but with time set to the end of the day
      handleChangeTo(
        range[1]
          ? UtcDate.fromNullableDate(range[1])
          : (UtcDate.fromNullableDate(range[0])?.endOfDay() ?? null)
      );
    }
  };

  const handleChangeValue = (date: DatesRangeValue | Date[] | Nullable<Date>) => {
    if (date instanceof Array) return;

    setValue(date);

    if (datePeriodType === DatePeriodType.FROM)
      handleChangeFrom(UtcDate.fromNullableDate(date)?.startOfDay() ?? null);

    if (datePeriodType === DatePeriodType.TO)
      handleChangeTo(UtcDate.fromNullableDate(date)?.endOfDay() ?? null);
  };

  useDidUpdate(() => {
    setRangeValue([null, null]);
    setValue(null);

    handleChangeFrom(null);
    handleChangeTo(null);
  }, [datePeriodType]);

  const title = generateMyDatePickerRangeTitle([from ?? null, to ?? null]);

  return (
    <MyDropdown
      opened={opened}
      position={position}
      withinPortal={withinPortal}
      hide={hide}
      show={show}
      Button={
        <MySelectTitle
          active={opened}
          variant="outlined"
          greenBg={activeBgColor}
          showPlaceholder={!Boolean(title)}
        >
          {title ?? t('placeholders.select_period')}
        </MySelectTitle>
      }
    >
      <Root>
        <DatePeriodSegmentedControl onChange={setDatePeriodType} />

        {datePeriodType === DatePeriodType.PERIOD ? (
          <StyledDatePicker
            type="range"
            allowSingleDateInRange
            firstDayOfWeek={generalSettingsStore.startOfWeekAsNumber as Optional<DayOfWeek>}
            locale={generalSettingsStore.accountSettings?.language}
            value={rangeValue}
            onChange={handleChangeRange}
            renderDay={renderTodayWithIndicator}
          />
        ) : (
          <StyledDatePicker
            value={value}
            firstDayOfWeek={generalSettingsStore.startOfWeekAsNumber as Optional<DayOfWeek>}
            locale={generalSettingsStore.accountSettings?.language}
            onChange={handleChangeValue}
            renderDay={renderTodayWithIndicator}
          />
        )}
      </Root>
    </MyDropdown>
  );
};

export { MyDatePeriodPicker };
