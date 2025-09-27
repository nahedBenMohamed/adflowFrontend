import { renderTodayWithIndicator } from '@/shared';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import type { MyDatePickerRangeType } from '../../../models';
import { MyDropdown } from '../../MyDropdown/MyDropdown';
import { MyDatePicker, type MyDatePickerProps } from '../MyDatePicker/MyDatePicker';
import {
  MyDatePickerRange,
  type MyDatePickerRangeProps,
} from '../MyDatePickerRange/MyDatePickerRange';

const Root = styled.div`
  padding: 8px;
`;

type DatePickerValue<T extends MyDatePickerRangeType = 'default'> = T extends 'range'
  ? MyDatePickerRangeProps
  : MyDatePickerProps;

export interface MyDatePickerDropdownProps<T extends MyDatePickerRangeType = 'default'> {
  Button: ReactNode;
  opened: boolean;
  dateProps: DatePickerValue<T>;
  type: MyDatePickerRangeType | T;
  withinPortal?: boolean;
  hide: () => void;
  show: () => void;
}

const MyDatePickerDropdown = <T extends MyDatePickerRangeType = 'default'>(
  props: MyDatePickerDropdownProps<T>
) => {
  const { opened, Button, type, dateProps, withinPortal, hide, show } = props;

  return (
    <MyDropdown
      Button={Button}
      opened={opened}
      position="bottom-start"
      withinPortal={withinPortal}
      hide={hide}
      show={show}
    >
      <Root>
        {type === 'default' ? (
          <MyDatePicker
            renderDay={renderTodayWithIndicator}
            {...(dateProps as MyDatePickerProps)}
          />
        ) : (
          <MyDatePickerRange
            renderDay={renderTodayWithIndicator}
            {...(dateProps as MyDatePickerRangeProps)}
          />
        )}
      </Root>
    </MyDropdown>
  );
};

export { MyDatePickerDropdown };
