import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';
import { MiniLoader } from '../../Loaders/MiniLoader/MiniLoader';
import { MyTooltip } from '../../MyTooltip/MyTooltip/MyTooltip';

const ButtonWrapper = styled.button`
  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  border-radius: 50%;
  background: var(--button-text-green-default);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background: var(--button-text-green-hover);
  }

  &:active {
    background: var(--button-text-green-active);
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;

export interface RoundButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  Icon: ReactNode;
  loading?: boolean;
  label?: string;
}

const RoundButton = (props: RoundButtonProps) => {
  const { Icon, label, loading, disabled, ...rest } = props;

  return (
    <MyTooltip withinPortal label={label} disabled={disabled}>
      <ButtonWrapper type="button" disabled={disabled} {...rest}>
        {loading ? <MiniLoader /> : Icon}
      </ButtonWrapper>
    </MyTooltip>
  );
};

export { RoundButton };
