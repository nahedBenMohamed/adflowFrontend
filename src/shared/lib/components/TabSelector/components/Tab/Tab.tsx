import { Link, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import type { CalculateActiveStrategy } from '../../../../types';

interface TabRootProps {
  $active: boolean;
  $disabled?: boolean;
}

const TabRoot = styled(Link)<TabRootProps>`
  position: relative;

  height: 30px;

  white-space: nowrap;

  font-size: 14px;
  font-weight: 400;
  color: var(--button-text-graphite-primary-text);
  transition: var(--transition-200);

  padding: 4px;
  border-radius: var(--border-radius-element);

  svg clip-path,
  svg rect {
    transition: var(--transition-200);
  }

  &::after {
    content: '';

    position: absolute;
    left: 0;
    bottom: -3px;

    width: 100%;
    height: 2px;

    background: transparent;
    border-radius: 2px 2px 0 0;
    transition: var(--transition-200);
  }

  ${p =>
    !p.$active &&
    css`
      &:hover {
        color: var(--graphite-graphite-840);

        background: var(--graphite-graphite-40);

        svg path,
        svg rect {
          stroke: var(--graphite-graphite-840);
        }
      }

      &:active {
        color: var(--graphite-graphite-840);

        background-color: transparent;

        svg path,
        svg rect {
          stroke: var(--button-text-green-default);
        }

        &::after {
          background: var(--button-text-green-default);
        }
      }
    `}

  ${p =>
    p.$active &&
    css`
      color: var(--graphite-graphite-840);

      background-color: transparent;

      svg path,
      svg rect {
        stroke: var(--button-text-green-default);
      }

      &::after {
        background: var(--button-text-green-default);
      }

      &:hover {
        color: var(--graphite-graphite-840);
      }
    `}

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;
      opacity: 0.65;
    `}
`;

export interface TabProps {
  to: string;
  name: string;
  calculateActiveStrategy?: CalculateActiveStrategy;
  includeRuleArray?: string[];
  excludeRuleArray?: string[];
  disabled?: boolean;
}

const Tab = (props: TabProps) => {
  const {
    to,
    calculateActiveStrategy = 'includes',
    includeRuleArray,
    excludeRuleArray,
    disabled,
  } = props;

  const { pathname } = useLocation();

  const calculateIsActive = (): boolean => {
    if (calculateActiveStrategy === 'always-active') return true;

    if (calculateActiveStrategy === 'always-inactive') return false;

    if (calculateActiveStrategy === 'includes') {
      if (includeRuleArray && includeRuleArray.length > 0) {
        return includeRuleArray.some(
          rule => pathname.includes(rule) && !excludeRuleArray?.includes(pathname)
        );
      }

      return to.includes(pathname);
    }

    if (calculateActiveStrategy === 'exact-without-query') return to.split('?')[0] === pathname;

    return to === pathname;
  };

  return (
    <TabRoot role="tab" to={to} $disabled={disabled} $active={calculateIsActive()}>
      {props.name}
    </TabRoot>
  );
};

export { Tab };
