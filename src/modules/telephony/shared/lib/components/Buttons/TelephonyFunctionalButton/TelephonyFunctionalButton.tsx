import { NoSelectMixin } from '@/shared';
import styled, { css } from 'styled-components';
import type { TelephonyFunctionalButtonProps } from '../../../models';
import type { TelephonyButtonSize } from '../../../types';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const Label = styled.p<{ $disabled?: boolean }>`
  font-size: 10px;
  font-weight: 400;
  line-height: 14px;
  color: var(--button-text-graphite-primary-text);

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;

      opacity: 0.65;

      ${NoSelectMixin}
    `}
`;

interface StyledButtonProps {
  size: TelephonyButtonSize;
  active?: boolean;
}

const StyledButton = styled.button<StyledButtonProps>`
  outline: none;

  width: ${p => (p.size === 'large' ? '40px' : '32px')};
  height: ${p => (p.size === 'large' ? '40px' : '32px')};

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  border-radius: 50%;
  background-color: transparent;
  border: 1px solid
    ${p =>
      p.size === 'large'
        ? 'var(--button-text-graphite-primary-text)'
        : 'var(--primary-statuses-white-0)'};
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;
  }

  &:active {
    scale: 0.9;
  }

  &:disabled {
    pointer-events: none;

    opacity: 0.65;
  }

  ${p =>
    p.active &&
    css`
      border: 1px solid var(--primary-blue);

      svg path {
        fill: var(--primary-blue);
      }
    `}
`;

const TelephonyFunctionalButton = (props: TelephonyFunctionalButtonProps) => {
  const { icons, size = 'large', label, CustomButton, disabled, ...rest } = props;

  const Button = icons ? (
    <StyledButton type="button" {...rest} size={size} disabled={disabled}>
      {size === 'large' ? icons.large : icons.small}
    </StyledButton>
  ) : (
    CustomButton
  );

  return size === 'large' ? (
    <Root>
      {Button}

      {label && <Label $disabled={disabled}>{label}</Label>}
    </Root>
  ) : (
    Button
  );
};

export { TelephonyFunctionalButton };
