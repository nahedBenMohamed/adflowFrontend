import { generalSettingsStore } from '@/app';
import type {
  DatePickerProps,
  DatesRangeValue,
  DateValue,
  DayOfWeek,
  DayProps,
} from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { toJS } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TimeFromIcon } from '../../../../assets';
import { renderTodayWithIndicator } from '../../../helpers';
import { HideScrollbarMixin, TruncateMixin } from '../../../mixins';
import {
  InputModel,
  MediaBreakpoints,
  UtcDate,
  type SelectModel,
  type UtcDateValue,
} from '../../../models';
import type { Optional } from '../../../types';
import { ConvertTimeUtil } from '../../../utils';
import { ControlButton } from '../../Buttons/ControlButton/ControlButton';
import {
  MyTimePickerInput,
  type MyTimePickerInputProps,
} from '../../Form/MyTimePickerInput/MyTimePickerInput';
import { MyDropdown } from '../../MyDropdown/MyDropdown';
import { PickerButton, type PickerButtonVariant } from '../../PickerButton/PickerButton';
import { SpanWithEllipsis } from '../../SpanWithEllipsis/SpanWithEllipsis';
import {
  DatePickerSelectCalendarIcon,
  StyledDatePicker,
  type DatePickerSelectCalendarIconType,
} from '../components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 8px 12px;

  @media ${MediaBreakpoints.HEIGHT_SM} {
    max-height: 60dvh;
    overflow-y: auto;

    ${HideScrollbarMixin}
  }
`;

const TitleWrapper = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

const TimeBlockWrapper = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const TimeBlockLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  ${TruncateMixin}
`;

const TimeIconWrapper = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  padding-top: 12px;
  border-top: 1px solid var(--graphite-graphite-80);
`;

const ControlsRightBlockWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

interface Props {
  model: SelectModel;
  onlyIcon?: boolean;
  disabled?: boolean;
  dropdownTitle?: string;
  iconOutlined?: boolean;
  withinPortal?: boolean;
  variant?: PickerButtonVariant;
  disableDatesAfter?: UtcDateValue;
  disableDatesBefore?: UtcDateValue;
  iconType?: DatePickerSelectCalendarIconType;
  hideClear?: boolean;
  handleChange?: (date: UtcDateValue) => void;
}

const disabledDayProps: Partial<DayProps> = {
  disabled: true,
  style: { opacity: 0.65, backgroundColor: 'var(--graphite-graphite-40)' },
};

const MyDatePickerWithTime = observer((props: Props) => {
  const {
    model,
    onlyIcon,
    disabled,
    dropdownTitle,
    iconOutlined = false,
    withinPortal,
    variant = 'secondary',
    disableDatesAfter,
    disableDatesBefore,
    iconType = 'start',
    hideClear,
    handleChange,
  } = props;

  const { t } = useTranslation();

  const [opened, { close, open }] = useDisclosure();

  const timeModel = useLocalObservable(() => InputModel.create());

  // this is fallback for case when user left without saving (pressing one of the controls buttons)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialValue = useMemo<UtcDateValue>(() => model.value, []);

  const [dateValue, setDateValue] = useState<DateValue>(
    () => (model.value as UtcDateValue)?.toDate() ?? null
  );

  useEffect(() => {
    const selectedDate = model.value as UtcDateValue;

    if (selectedDate) {
      timeModel.setValue(`${selectedDate.getHoursString()}:${selectedDate.getMinutesString()}`);

      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setDateValue(selectedDate.toDate());
    }
  }, [model.value, timeModel]);

  const onChangeDate = useCallback(
    (value: DateValue | DatesRangeValue | Date[]) => {
      if (value instanceof Array) return;

      const { hours, minutes } =
        ConvertTimeUtil.parseHoursAndMinutesFromHHmm(timeModel.value) ?? {};

      let parsedValue = value ? UtcDate.fromDate(value) : null;

      if (parsedValue) {
        if (typeof hours === 'number') parsedValue = parsedValue.setHours(hours);

        if (typeof minutes === 'number') parsedValue = parsedValue.setMinutes(minutes);
      }

      setDateValue(parsedValue ? parsedValue.toDate() : null);
      model.setValue(parsedValue);
    },
    [model, timeModel.value]
  );

  const onChangeTime = useCallback(
    (time: string) => {
      const { hours, minutes } = ConvertTimeUtil.parseHoursAndMinutesFromHHmm(time) ?? {};

      let newDate = toJS(model.value) as UtcDateValue;

      if (!newDate) newDate = UtcDate.startOfCurrentDay();

      if (typeof hours === 'number') newDate = newDate.setHours(hours);

      if (typeof minutes === 'number') newDate = newDate.setMinutes(minutes);

      if (newDate.hours === 0 && newDate.minutes === 0) newDate = newDate.startOfDay();

      model.setValue(newDate);
      setDateValue(newDate.toDate());
    },
    [model]
  );

  const handleSetNow = useCallback(() => {
    const dateNow = UtcDate.now();

    model.setValue(dateNow);
    setDateValue(dateNow.toDate());

    handleChange?.(dateNow);

    close();
  }, [model, handleChange, close]);

  const handleClear = useCallback(() => {
    model.setValue(null);
    setDateValue(null);
    timeModel.setValue('');

    handleChange?.(null);

    close();
  }, [model, timeModel, handleChange, close]);

  const handleSave = useCallback(() => {
    const parsedDate = UtcDate.fromNullableDate(dateValue);

    if (parsedDate) {
      model.setValue(parsedDate);
      handleChange?.(parsedDate);
    }

    close();
  }, [model, dateValue, close, handleChange]);

  const handleCloseWithoutSaving = useCallback(() => {
    model.setValue(initialValue);

    setDateValue(null);
    timeModel.setValue('');

    close();
  }, [model, initialValue, timeModel, close]);

  const getDayPropsHandler = useCallback<() => DatePickerProps['getDayProps']>(
    () => (date: Date) => {
      if (disableDatesBefore) {
        const currentDate = UtcDate.fromDate(date);

        if (currentDate.isBefore(disableDatesBefore.startOfDay())) return disabledDayProps;
      }

      if (disableDatesAfter) {
        const currentDate = UtcDate.fromDate(date);

        if (currentDate.isAfter(disableDatesAfter.endOfDay())) return disabledDayProps;
      }

      return {};
    },
    [disableDatesBefore, disableDatesAfter]
  );

  const pickerDropdownProps = useMemo<MyTimePickerInputProps['pickerDropdownProps']>(
    () => ({
      step: 15,
      inModal: true,
      returnFocus: true,
    }),
    []
  );

  const title = (model.value as UtcDateValue)?.toString();

  return (
    <MyDropdown
      position="bottom-start"
      withinPortal={withinPortal}
      Button={
        <PickerButton
          active={opened}
          variant={variant}
          width="fit-content"
          disabled={disabled}
          showValue={!onlyIcon}
          iconOutlined={iconOutlined}
          selectedValue={Boolean(title)}
          value={title ?? t('select_date')}
          Icon={<DatePickerSelectCalendarIcon type={iconType} />}
        />
      }
      opened={opened}
      show={open}
      hide={handleCloseWithoutSaving}
    >
      <Root>
        {dropdownTitle && (
          <TitleWrapper>
            <SpanWithEllipsis text={dropdownTitle} />
          </TitleWrapper>
        )}

        <TimeBlockWrapper>
          <TimeBlockLabelWrapper>
            <TimeIconWrapper>
              <TimeFromIcon />
            </TimeIconWrapper>

            <SpanWithEllipsis text={`${t('exact_time')}:`} />
          </TimeBlockLabelWrapper>

          <MyTimePickerInput
            autoFocus
            model={timeModel}
            pickerDropdownProps={pickerDropdownProps}
            handleChange={onChangeTime}
          />
        </TimeBlockWrapper>

        <StyledDatePicker
          type="default"
          value={dateValue}
          onChange={onChangeDate}
          getDayProps={getDayPropsHandler()}
          firstDayOfWeek={generalSettingsStore.startOfWeekAsNumber as Optional<DayOfWeek>}
          locale={generalSettingsStore.accountSettings?.language}
          renderDay={renderTodayWithIndicator}
        />

        <ControlsWrapper>
          <ControlButton variant="outlined" onClick={handleSetNow}>
            {t('now')}
          </ControlButton>

          <ControlsRightBlockWrapper>
            {!hideClear && (
              <ControlButton variant="cancel" onClick={handleClear}>
                {t('buttons.clear')}
              </ControlButton>
            )}

            <ControlButton variant="save" onClick={handleSave}>
              {t('buttons.save')}
            </ControlButton>
          </ControlsRightBlockWrapper>
        </ControlsWrapper>
      </Root>
    </MyDropdown>
  );
});

MyDatePickerWithTime.displayName = 'MyDatePickerWithTime';
export { MyDatePickerWithTime };
