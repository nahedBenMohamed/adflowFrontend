import {
  useCallback,
  type ChangeEventHandler,
  type InputHTMLAttributes,
  type MouseEventHandler,
} from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { CheckmarkIcon, MinusIcon } from '../../../../assets';
import type { MyCheckboxVariant } from '../../../models';

interface RootProps {
  $gray?: boolean;
  $bigger?: boolean;
  $checked?: boolean;
  $invalid?: boolean;
  $disabled?: boolean;
  $hiddenlyDisabled?: boolean;
  $variant?: MyCheckboxVariant;
}

const Root = styled.div<RootProps>`
  position: relative;

  width: ${p => (p.$bigger ? 20 : 16)}px;
  height: ${p => (p.$bigger ? 20 : 16)}px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  border-radius: var(--border-radius-element);
  border: 1px solid
    ${p =>
      p.$checked
        ? p.$gray
          ? 'var(--button-text-graphite-secondary-text)'
          : 'var(--button-text-green-default)'
        : 'var(--button-text-graphite-secondary-text)'};
  background-color: ${p =>
    p.$checked
      ? p.$gray
        ? 'var(--button-text-graphite-secondary-text)'
        : 'var(--button-text-green-default)'
      : 'var(--graphite-graphite-20)'};
  transition: var(--transition-200);

  svg {
    opacity: ${p => (p.$checked ? 1 : 0)};
    transform: ${p => (p.$checked ? 'scale(1)' : 'scale(0.5) rotate(-45deg)')};
    transition: var(--transition-200);

    ${p =>
      p.$bigger &&
      css`
        width: 14px;
        height: auto;
      `}
  }

  &:hover {
    cursor: pointer;

    background-color: ${p => p.$checked && !p.$gray && 'var(--button-text-green-hover)'};
    border-color: ${p => !p.$checked && 'var(--button-text-green-hover)'};
  }

  &:active {
    border-color: ${p => !p.$gray && 'var(--button-text-green-active)'};
  }

  ${p =>
    p.$variant === 'mark' &&
    css`
      border-radius: 50%;
      border-color: ${p.$checked && 'var(--button-text-green-default)'};
      background-color: ${p.$checked && 'var(--button-text-green-default)'};

      &:hover {
        border-color: var(--button-text-green-default);
        background-color: ${p.$checked && 'var(--button-text-green-default)'};
      }

      &:active {
        background-color: ${p.$checked && 'var(--button-text-green-default)'};
      }
    `}

  ${p =>
    p.$invalid &&
    css`
      border-color: var(--button-text-red-default);

      &:hover {
        border-color: var(--button-text-red-hover);
      }

      &:active {
        border-color: var(--button-text-red-active);
      }
    `}

  ${p =>
    p.$disabled &&
    css`
      opacity: 0.5;

      * {
        pointer-events: none;
      }
    `}
  
  ${p => p.$hiddenlyDisabled && `pointer-events: none`};
`;

const HiddenInput = styled.input<{ $bigger?: boolean }>`
  // to align with the div
  position: absolute;
  top: -1px;
  left: -1px;

  height: ${p => (p.$bigger ? 20 : 16)}px;
  width: ${p => (p.$bigger ? 20 : 16)}px;

  opacity: 0;

  &:hover {
    cursor: pointer;
  }
`;

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  gray?: boolean;
  disabled?: boolean;
  hiddenlyDisabled?: boolean;
  stopPropagation?: boolean;
  invalid?: boolean;
  indeterminate?: boolean;
  variant?: MyCheckboxVariant;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const emptyCallback = () => {};

const MyCheckbox = (props: Props) => {
  const {
    checked,
    gray,
    disabled,
    hiddenlyDisabled,
    stopPropagation,
    invalid,
    indeterminate,
    variant = 'primary',
    onChange,
    ...rest
  } = props;

  const { t } = useTranslation();

  const handleClick = useCallback<MouseEventHandler<HTMLDivElement>>(
    e => {
      if (stopPropagation) e.stopPropagation();
    },
    [stopPropagation]
  );

  return (
    <Root
      $gray={gray}
      role="checkbox"
      $invalid={invalid}
      $variant={variant}
      $disabled={disabled}
      aria-readonly={disabled}
      $bigger={variant === 'bigger'}
      $checked={checked || indeterminate}
      $hiddenlyDisabled={hiddenlyDisabled}
      title={disabled ? t('field_readonly') : undefined}
      onClick={disabled ? emptyCallback : handleClick}
    >
      {indeterminate ? <MinusIcon /> : <CheckmarkIcon />}

      <HiddenInput
        {...rest}
        type="checkbox"
        role="checkbox"
        checked={checked}
        $bigger={variant === 'bigger'}
        onChange={onChange}
      />
    </Root>
  );
};

export { MyCheckbox };
