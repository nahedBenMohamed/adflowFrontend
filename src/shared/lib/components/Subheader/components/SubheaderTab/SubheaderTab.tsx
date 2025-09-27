import { MyTooltip } from '@/shared';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

interface RootProps {
  $active: boolean;
  $disabled?: boolean;
}

export const Root = styled(Link)<RootProps>`
  border: none;
  margin: 0;

  position: relative;

  height: 30px;

  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 14px;
  font-weight: 400;
  color: var(--button-text-graphite-primary-text);

  padding: 4px;
  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  svg clip-path,
  svg path,
  svg rect {
    transition: var(--transition-200);
  }

  &:hover {
    color: var(--graphite-graphite-840);

    ${p =>
      !p.$active &&
      css`
        border: none;

        background: var(--graphite-graphite-40);

        svg path,
        svg rect {
          fill: var(--graphite-graphite-840);
        }
      `}
  }

  &:active {
    border: none;

    color: var(--graphite-graphite-840);

    background-color: transparent;

    svg path,
    svg rect {
      fill: var(--button-text-green-default);
    }

    &::after {
      background: var(--button-text-green-default);
    }
  }

  &::after {
    content: '';

    position: absolute;
    left: 0;
    bottom: -5px;

    height: 2px;
    width: 100%;

    background: transparent;
    border-radius: 2px 2px 0 0;
    transition: var(--transition-200);
  }

  ${p =>
    p.$active &&
    css`
      border: none;

      color: var(--graphite-graphite-840);

      background-color: transparent;

      svg path,
      svg rect {
        fill: var(--button-text-green-default);
      }

      &::after {
        background: var(--button-text-green-default);
      }
    `}

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;

      opacity: 0.6;
    `}
`;

const Wrapper = styled.div`
  pointer-events: auto;
`;

interface Props extends ComponentPropsWithoutRef<typeof Link> {
  children: ReactNode;
  active: boolean;
  disabled?: boolean;
  tooltip?: string;
}

const SubheaderTab = (props: Props) => {
  const { children, active, disabled, tooltip, ...rest } = props;

  return (
    <MyTooltip withinPortal position="bottom" label={tooltip} disabled={!Boolean(tooltip)}>
      <Wrapper>
        <Root $active={active} $disabled={disabled} {...rest}>
          {children}
        </Root>
      </Wrapper>
    </MyTooltip>
  );
};

export { SubheaderTab };
