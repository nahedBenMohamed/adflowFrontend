import { MiniLoader } from '@/shared';
import type { ReactNode, Ref } from 'react';
import styled, { css } from 'styled-components';

const IconWrapper = styled.div<{ $borderColor?: string }>`
  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  border: 1px solid
    ${p => (p.$borderColor ? p.$borderColor : 'var(--button-text-graphite-secondary-text)')};
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }
`;

interface RootProps {
  $active: boolean;
  $disabled: boolean;
  $outlined: boolean;
  $borderColor?: string;
}

const Root = styled.button<RootProps>`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 8px 0;
  border: 1px solid
    ${p => (p.$borderColor ? p.$borderColor : 'var(--button-text-graphite-secondary-text)')};

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-secondary-text);

  border-radius: var(--border-radius-block);
  transition: var(--transition-200);

  ${p =>
    !p.$outlined &&
    css`
      padding: 0;
      border: none;
    `}

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;
      opacity: 0.6;
    `}

  &:hover {
    cursor: pointer;

    color: var(--button-text-green-hover);

    ${IconWrapper} {
      border-color: var(--button-text-green-hover);

      svg path {
        fill: var(--button-text-green-hover);
      }
    }
  }

  &:active {
    color: var(--button-text-green-active);

    ${IconWrapper} {
      border-color: var(--button-text-green-active);

      svg path {
        fill: var(--button-text-green-active);
      }
    }
  }

  ${p =>
    p.$active &&
    css`
      color: var(--button-text-green-active);

      ${IconWrapper} {
        border-color: var(--button-text-green-active);

        svg path {
          fill: var(--button-text-green-active);
        }
      }
    `}
`;

interface Props {
  ref?: Ref<HTMLButtonElement>;
  Icon: ReactNode;
  active?: boolean;
  loading?: boolean;
  disabled?: boolean;
  outlined?: boolean;
  children?: ReactNode;
  borderColor?: string;
  onClick?: () => void;
}

const ControlButton = (props: Props) => {
  const {
    ref,
    Icon,
    children,
    borderColor,
    active = false,
    loading = false,
    outlined = true,
    disabled = false,
    onClick,
  } = props;

  return (
    <Root
      ref={ref}
      type="button"
      $active={active}
      $disabled={disabled}
      $outlined={outlined}
      $borderColor={borderColor}
      onClick={onClick}
    >
      <IconWrapper $borderColor={borderColor}>
        {loading ? <MiniLoader color="var(--button-text-graphite-secondary-text)" /> : Icon}
      </IconWrapper>

      {children}
    </Root>
  );
};

export { ControlButton };
