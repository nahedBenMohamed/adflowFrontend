import type { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';
import { CallLargeIcon, CallSmallIcon } from '../../../../assets';
import type { TelephonyButtonSize } from '../../../types';

const Root = styled.button<{ $size: TelephonyButtonSize }>`
  outline: none;

  width: ${p => (p.$size === 'large' ? 56 : 32)}px;
  height: ${p => (p.$size === 'large' ? 56 : 32)}px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  border-radius: 50%;
  background-color: var(--button-text-green-default);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background-color: var(--button-text-green-hover);
  }

  &:active {
    scale: 0.9;

    background-color: var(--button-text-green-active);
  }

  &:disabled {
    pointer-events: none;

    opacity: 0.65;
  }
`;

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: TelephonyButtonSize;
}

const CallButton = (props: Props) => {
  const { size = 'large', ...rest } = props;

  return (
    <Root type="button" {...rest} $size={size}>
      {size === 'large' ? <CallLargeIcon /> : <CallSmallIcon />}
    </Root>
  );
};

export { CallButton };
