import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react';
import styled from 'styled-components';
import { DropdownScrollbarMixin } from '../../../../../mixins';
import { UtcDate, type Option, type TimePickerSelectMenuPopoverProps } from '../../../../../models';
import { TimePickerUtil } from '../../../../../utils';
import { MyPopover } from '../../../../MyPopover/MyPopover';

const Root = styled.ul`
  height: 148px;

  display: flex;
  flex-direction: column;
  gap: 2px;

  ${DropdownScrollbarMixin}

  padding: 2px;
`;

const TimeOption = styled.li<{ $active: boolean }>`
  padding: 8px 16px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background-color: ${p => (p.$active ? '#e6fbda' : '#f3fded')};
  }

  &:active {
    background-color: #e6fbda;
  }

  ${p => p.$active && `background-color: #e6fbda`};
`;

interface Props {
  value: string;
  Target: ReactNode;
  popoverProps: TimePickerSelectMenuPopoverProps;
  onChange: (value: string) => void;
  onClick?: () => void;
}

const DATA_ACTIVE = 'data-active';

const TimePickerSelectMenu = (props: Props) => {
  const { value, Target, popoverProps, onChange } = props;

  const { step, businessHours, opened, hide } = popoverProps;

  const hoursColumnRef = useRef<HTMLUListElement>(null);

  const dateNowInMinutes = useMemo<number>(
    () => TimePickerUtil.calculateTotalMinutesInTimeString(UtcDate.now().format('HH:mm')),
    []
  );

  const timeOptions = useMemo(
    () => TimePickerUtil.generateTimeOptions({ step, businessHours }),
    [step, businessHours]
  );

  useEffect(() => {
    if (opened) {
      // to scroll to active hour when popover is opened and
      // other tasks are done
      setTimeout(() => {
        if (hoursColumnRef.current) {
          const activeHour = hoursColumnRef.current.querySelector(`[${DATA_ACTIVE}="true"]`);

          if (activeHour) activeHour.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
      });
    }
  }, [opened]);

  const hasActive = useMemo<boolean>(
    () => Boolean(value) && timeOptions.some(o => o.value === value),
    [timeOptions, value]
  );
  const activeOption = useMemo<Option<string>>(() => {
    // if we have selected option and we found it in options -> scroll to it
    if (hasActive) {
      const active = timeOptions.find(o => o.value === value);

      if (active) return active;
    }

    // if we have selected option but it has different step -> scroll to first option with same hour
    if (value) {
      const selectedHour = value.split(':')[0];

      const firstWithSameHour = timeOptions.find(o => o.value.split(':')[0] === selectedHour);

      if (firstWithSameHour) return firstWithSameHour;
    }

    // if we don't, return closest option to dateNow, we will scroll to it if no active option
    // is provided for better UX
    const closest = timeOptions.reduce((prev, curr) => {
      const prevInMinutes = TimePickerUtil.calculateTotalMinutesInTimeString(prev.value);
      const currInMinutes = TimePickerUtil.calculateTotalMinutesInTimeString(curr.value);

      const prevDiff = Math.abs(prevInMinutes - dateNowInMinutes);
      const currDiff = Math.abs(currInMinutes - dateNowInMinutes);

      return prevDiff < currDiff ? prev : curr;
    });

    return closest;
  }, [timeOptions, dateNowInMinutes, hasActive, value]);

  const getSelectHandler = useCallback(
    (value: string) => () => {
      onChange(value);

      hide?.();
    },
    [onChange, hide]
  );

  return (
    <MyPopover Target={Target} {...popoverProps}>
      <Root ref={hoursColumnRef}>
        {timeOptions.map(o => {
          const active = o.value === activeOption.value;

          return (
            <TimeOption
              key={o.value}
              $active={active}
              {...{ [DATA_ACTIVE]: active }}
              onClick={getSelectHandler(o.value)}
            >
              {o.label}
            </TimeOption>
          );
        })}
      </Root>
    </MyPopover>
  );
};

export { TimePickerSelectMenu };
