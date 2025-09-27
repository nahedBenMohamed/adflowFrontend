import { MiniLoader, MyTooltip } from '@/shared';
import type { ReactNode, Ref } from 'react';
import styled, { css } from 'styled-components';

interface RootProps {
  $size: Size;
  $active: boolean;
  $danger: boolean;
  $hasBorder: boolean;
  $hiddenlyDisabled: boolean;
}

const Root = styled.button<RootProps>`
  background: none;
  padding: 0;

  position: relative;

  ${p => {
    switch (p.$size) {
      case 'small':
        return css`
          width: 16px;
          height: 16px;
        `;

      case 'medium':
        return css`
          width: 32px;
          height: 32px;
        `;
    }
  }}

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid
    ${p => (p.$hasBorder ? 'var(--button-text-graphite-secondary-text)' : 'transparent')};
  border-radius: 50%;
  transition: var(--transition-200);

  svg path,
  svg circle {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path,
    svg circle {
      fill: ${p => (p.$danger ? 'var(--button-text-red-hover)' : 'var(--button-text-green-hover)')};
    }
  }

  &:active {
    svg path,
    svg circle {
      fill: ${p =>
        p.$danger ? 'var(--button-text-red-active)' : 'var(--button-text-green-active)'};
    }
  }

  &:disabled {
    pointer-events: none;

    opacity: 0.5;
  }

  ${p => p.$hiddenlyDisabled && `pointer-events: none`};

  ${p =>
    p.$active &&
    css`
      svg path,
      svg circle {
        fill: ${p.$danger ? 'var(--button-text-red-default)' : 'var(--button-text-green-default)'};
      }
    `}
`;

type Size = 'small' | 'medium';

interface Props {
  ref?: Ref<HTMLButtonElement>;
  children: ReactNode;
  label: string;
  active?: boolean;
  hasBorder?: boolean;
  loading?: boolean;
  disabled?: boolean;
  hiddenlyDisabled?: boolean;
  size?: Size;
  danger?: boolean;
  onClick?: (...args: any[]) => void;
}

const MessageControlButton = (props: Props) => {
  const {
    ref,
    children,
    label,
    active = false,
    hasBorder = true,
    loading = false,
    disabled = false,
    hiddenlyDisabled = false,
    size = 'medium',
    danger = false,
    onClick,
  } = props;

  return (
    <MyTooltip label={label} disabled={hiddenlyDisabled || disabled} position="bottom">
      <Root
        ref={ref}
        $size={size}
        $active={active}
        $danger={danger}
        $hasBorder={hasBorder}
        disabled={disabled}
        $hiddenlyDisabled={hiddenlyDisabled}
        onClick={onClick}
      >
        {loading ? <MiniLoader color="var(--button-text-graphite-primary-text)" /> : children}
      </Root>
    </MyTooltip>
  );
};

export { MessageControlButton };
