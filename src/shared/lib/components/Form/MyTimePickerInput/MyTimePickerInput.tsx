import { useDropdownWidth } from '@/shared';
import { TimeInput, type TimeInputProps } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import styled, { css } from 'styled-components';
import type { InputModel, TimePickerSelectMenuPopoverProps } from '../../../models';
import type { Nullable } from '../../../types';
import { TimePickerSelectMenu } from './components';

interface RootProps {
  $invalid: boolean;
  $fullWidth?: boolean;
}

const Root = styled(TimeInput)<RootProps>`
  .mantine-TimeInput-input {
    height: 28px;
    min-height: 28px;
    width: fit-content;

    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    text-align: center;
    color: var(--button-text-graphite-priory-text);

    padding: 0 8px;
    border: 1px solid var(--graphite-graphite-120);
    transition: var(--transition-200);

    // for alignment in Safari shadow DOM
    ::-webkit-datetime-edit-fields-wrapper {
      padding-top: 2px;
    }

    &:hover,
    &:focus {
      cursor: pointer;

      border-color: var(--button-text-graphite-secondary-text);
    }

    ${p =>
      p.$invalid &&
      css`
        border-color: var(--button-text-red-hover);

        &:hover,
        &:focus {
          border-color: var(--button-text-red-hover);
        }
      `}

    ${p =>
      p.$fullWidth &&
      css`
        width: 100%;

        text-align: left;
      `}
  }
`;

export interface MyTimePickerInputProps {
  model: InputModel;
  disabled?: boolean;
  autoFocus?: boolean;
  fullWidth?: boolean;
  pickerDropdownProps?: Omit<TimePickerSelectMenuPopoverProps, 'opened' | 'hide'>;
  handleChange?: (value: string) => void;
}

const MyTimePickerInput = observer((props: MyTimePickerInputProps) => {
  const { model, pickerDropdownProps, disabled, fullWidth, autoFocus, handleChange } = props;

  const [dropdownWidth, ref] = useDropdownWidth<HTMLInputElement>();

  const [value, setValue] = useState<string>(() => model.value);

  const [opened, { close, open }] = useDisclosure(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setValue(model.value);
  }, [model.value]);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement> | string) => {
      const newValue = typeof e === 'string' ? e : e.target.value;

      setValue(newValue);
      model.setValue(newValue);

      handleChange?.(newValue);
    },
    [model, handleChange]
  );

  const invalid = !model.isValid() || model.isErrorShown;

  const commonRootProps = useMemo(
    () =>
      ({
        value,
        disabled,
        $invalid: invalid,
        $fullWidth: fullWidth,
        onChange,
      }) satisfies TimeInputProps & RootProps,
    [value, disabled, invalid, fullWidth, onChange]
  );

  useEffect(() => {
    if (autoFocus && !(typeof ref === 'function') && ref?.current)
      setTimeout(() => ref.current?.focus());
  }, [autoFocus, ref]);

  const popoverProps = useMemo<Nullable<TimePickerSelectMenuPopoverProps>>(
    () =>
      pickerDropdownProps
        ? {
            ...pickerDropdownProps,
            ...(fullWidth ? { rootWidth: '100%', width: dropdownWidth } : {}),
            opened,
            hide: close,
          }
        : null,
    [pickerDropdownProps, opened, close, fullWidth, dropdownWidth]
  );

  if (!popoverProps) return <Root ref={ref} {...commonRootProps} />;

  return (
    <TimePickerSelectMenu
      value={value}
      popoverProps={popoverProps}
      Target={<Root ref={ref} {...commonRootProps} onClick={open} />}
      onClick={open}
      onChange={onChange}
    />
  );
});

MyTimePickerInput.displayName = 'MyTimePickerInput';
export { MyTimePickerInput };
