import { observer } from 'mobx-react-lite';
import { useCallback, type CSSProperties, type MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { generateMyDatePickerRangeTitle, generateMyDatePickerTitle } from '../../../helpers';
import type {
  MyDatePickerRangeType,
  MySelectTitleRootVariant,
  SelectModel,
  UtcDateValue,
  UtcDatesRangeValue,
} from '../../../models';
import type { Optional } from '../../../types';
import { MySelectTitle } from '../../Form/MySelect/components';
import type { MyDatePickerProps } from '../MyDatePicker/MyDatePicker';
import {
  MyDatePickerDropdown,
  type MyDatePickerDropdownProps,
} from '../MyDatePickerDropdown/MyDatePickerDropdown';
import type { MyDatePickerRangeProps } from '../MyDatePickerRange/MyDatePickerRange';
import { DatePickerSelectCalendarIcon } from '../components';

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface Props<T extends MyDatePickerRangeType>
  extends Omit<MyDatePickerDropdownProps, 'dateProps' | 'Button'> {
  model: SelectModel;
  variant?: MySelectTitleRootVariant;
  titleWidth?: CSSProperties['width'];
  placeholder?: string;
  clearable?: boolean;
  withinPortal?: boolean;
  titleMinWidth?: CSSProperties['minWidth'];
  handleChange?: T extends 'default'
    ? (value: UtcDateValue) => void
    : (value: UtcDatesRangeValue) => void;
}

const MyDatePickerSelect = observer(<T extends MyDatePickerRangeType>(props: Props<T>) => {
  const {
    model,
    variant,
    placeholder,
    type,
    titleWidth,
    opened,
    clearable,
    withinPortal,
    titleMinWidth,
    hide,
    show,
    handleChange,
    ...rest
  } = props;

  const { t } = useTranslation();

  const handleClear = useCallback<MouseEventHandler<HTMLButtonElement>>(
    e => {
      e.stopPropagation();

      model.setValue(type === 'default' ? null : [null, null]);

      if (type === 'default') {
        (handleChange as Optional<(value: UtcDateValue) => void>)?.(null);
      } else {
        (handleChange as Optional<(value: UtcDatesRangeValue) => void>)?.([null, null]);
      }

      show();
    },
    [model, type, handleChange, show]
  );

  const dateProps =
    type === 'default'
      ? ({
          value: model.value as UtcDateValue,
          onChange: date => {
            model.setValue(date);

            (handleChange as Optional<(value: UtcDateValue) => void>)?.(date);

            hide();
          },
        } as MyDatePickerProps)
      : ({
          allowSingleDateInRange: true,
          values: model.value as UtcDatesRangeValue,
          onChange: date => {
            model.setValue(date);

            (handleChange as Optional<(value: UtcDatesRangeValue) => void>)?.(date);
          },
        } as MyDatePickerRangeProps);

  const title =
    type === 'default'
      ? generateMyDatePickerTitle(model.value as UtcDateValue)
      : generateMyDatePickerRangeTitle(model.value as UtcDatesRangeValue);

  const defaultPlaceholder = placeholder
    ? placeholder
    : type === 'default'
      ? t('select_date')
      : t('select_period');

  return (
    <MyDatePickerDropdown
      {...rest}
      type={type}
      opened={opened}
      dateProps={dateProps}
      withinPortal={withinPortal}
      Button={
        <TitleWrapper>
          <MySelectTitle
            active={opened}
            variant={variant}
            width={titleWidth}
            minWidth={titleMinWidth}
            invalid={!model.isValid}
            showPlaceholder={!title}
            selectedValue={Boolean(title)}
            Icon={<DatePickerSelectCalendarIcon />}
            onClear={clearable ? handleClear : undefined}
          >
            {title ?? defaultPlaceholder}
          </MySelectTitle>
        </TitleWrapper>
      }
      hide={hide}
      show={show}
    />
  );
});

MyDatePickerSelect.displayName = 'MyDatePickerSelect';
export { MyDatePickerSelect };
