import { useCallback, useRef, type ChangeEventHandler } from 'react';
import styled, { css } from 'styled-components';

interface ThumbProps {
  $active: boolean;
  $size: MySwitchSize;
}

const THUMB_SIZE_SMALL = '10px';
const THUMB_SIZE_MEDIUM = '14px';
const OFFSET = '3px';

const Thumb = styled.div<ThumbProps>`
  position: absolute;
  top: 3px;
  left: ${p => (p.$active ? `calc(100% - ${THUMB_SIZE_SMALL} - ${OFFSET})` : OFFSET)};

  ${p =>
    p.$size === 'medium' &&
    css`
      left: ${p.$active ? `calc(100% - ${THUMB_SIZE_MEDIUM} - ${OFFSET})` : OFFSET};
    `}

  width: ${p => (p.$size === 'medium' ? THUMB_SIZE_MEDIUM : THUMB_SIZE_SMALL)};
  height: ${p => (p.$size === 'medium' ? THUMB_SIZE_MEDIUM : THUMB_SIZE_SMALL)};

  border-radius: 50%;
  background: var(--primary-statuses-white-0);
  box-shadow: 0px 1px 2px rgba(68, 86, 108, 0.5);
  transition: var(--transition-200);
`;

interface TrackProps {
  $active: boolean;
  $size: MySwitchSize;
  $variant: MySwitchVariant;
  $invalid?: boolean;
  $disabled?: boolean;
}

const Track = styled.div<TrackProps>`
  position: relative;

  width: 27px;
  height: 16px;

  border-radius: 8px;
  background-color: var(--graphite-graphite-80);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background-color: var(--graphite-graphite-40);
  }

  &:active {
    ${Thumb} {
      transform: scale(1.1);
    }
  }

  ${p =>
    p.$active &&
    p.$variant === 'standard' &&
    css`
      background-color: var(--button-text-green-default);

      &:hover {
        background-color: var(--button-text-green-hover);
      }

      &:active {
        background-color: var(--button-text-green-active);
      }
    `}

  ${p =>
    p.$active &&
    p.$variant === 'mono' &&
    css`
      background-color: var(--graphite-graphite-80);

      &:hover {
        background-color: var(--graphite-graphite-40);
      }

      &:active {
        background-color: var(--graphite-graphite-40);
      }
    `}

  ${p =>
    p.$size === 'medium' &&
    css`
      width: 36px;
      height: 20px;

      border-radius: 10px;
    `}

    ${p => p.$invalid && `background-color: var(--neutral-red-100)`};

  ${p => p.$disabled && `background-color: var(--graphite-graphite-20)`};
`;

const HiddenInput = styled.input`
  display: none;
`;

export type MySwitchSize = 'small' | 'medium';
type MySwitchVariant = 'mono' | 'standard';

interface Props {
  checked: boolean;
  inputId?: string;
  size?: MySwitchSize;
  variant?: MySwitchVariant;
  invalid?: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}

const MySwitch = (props: Props) => {
  const {
    checked,
    inputId,
    size = 'small',
    variant = 'standard',
    invalid,
    disabled,
    onChange,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => {
      const value = e.currentTarget.checked;

      onChange?.(value);
    },
    [onChange]
  );

  const handleClick = useCallback(() => inputRef.current?.click(), []);

  return (
    <>
      <Track
        $invalid={invalid}
        $active={checked}
        $size={size}
        $variant={variant}
        onClick={handleClick}
      >
        <Thumb $size={size} $active={checked} />
      </Track>

      <HiddenInput
        id={inputId}
        ref={inputRef}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
      />
    </>
  );
};

export { MySwitch };
