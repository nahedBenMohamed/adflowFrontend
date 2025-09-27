import { MyTooltip } from '@/shared';
import type { ReactNode, Ref } from 'react';
import styled, { css } from 'styled-components';

interface RootProps {
  $active: boolean;
  $disabled?: boolean;
}

const Root = styled.button<RootProps>`
  background: none;
  padding: 0;

  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  border-radius: 50%;
  border: 1px solid var(--graphite-graphite-80);
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    border-color: var(--graphite-graphite-40);
    background-color: var(--graphite-graphite-40);
  }

  &:active {
    border-color: var(--graphite-graphite-80);
    background-color: var(--graphite-graphite-80);
  }

  &:disabled {
    opacity: 0.5;

    pointer-events: none;
  }

  ${p =>
    p.$active &&
    css`
      border-color: var(--button-text-green-active);

      svg path {
        fill: var(--graphite-graphite-840);
      }

      &:hover {
        background-color: transparent;
        border-color: var(--button-text-green-active);
      }

      &:active {
        background-color: transparent;
        border-color: var(--button-text-green-active);
      }
    `};
`;

interface Props {
  ref?: Ref<HTMLButtonElement>;
  active: boolean;
  children: ReactNode;
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const HeaderRoundButton = (props: Props) => {
  const { ref, active, children, label, disabled, onClick } = props;

  return (
    <MyTooltip withinPortal label={label} position="bottom" disabled={active}>
      <Root ref={ref} type="button" $active={active} $disabled={disabled} onClick={onClick}>
        {children}
      </Root>
    </MyTooltip>
  );
};

export { HeaderRoundButton };
