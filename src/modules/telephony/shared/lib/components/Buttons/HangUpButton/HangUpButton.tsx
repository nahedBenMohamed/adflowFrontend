import styled from 'styled-components';
import { HangLargeIcon, HangSmallIcon } from '../../../../assets';
import type { TelephonyFunctionalButtonProps } from '../../../models';
import type { TelephonyButtonSize } from '../../../types';
import { TelephonyFunctionalButton } from '../TelephonyFunctionalButton/TelephonyFunctionalButton';

const Root = styled.button<{ $size: TelephonyButtonSize }>`
  outline: none;

  width: ${p => (p.$size === 'large' ? 40 : 32)}px;
  height: ${p => (p.$size === 'large' ? 40 : 32)}px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  border-radius: 50%;
  background-color: var(--button-text-red-default);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background-color: var(--button-text-red-hover);
  }

  &:active {
    scale: 0.9;

    background-color: var(--button-text-red-active);
  }
`;

const HangUpButton = (props: Omit<TelephonyFunctionalButtonProps, 'icons' | 'CustomButton'>) => {
  const { size = 'large', label, ...rest } = props;

  return (
    <TelephonyFunctionalButton
      size={size}
      label={label}
      CustomButton={
        <Root {...rest} $size={size}>
          {size === 'large' ? <HangLargeIcon /> : <HangSmallIcon />}
        </Root>
      }
    />
  );
};

export { HangUpButton };
