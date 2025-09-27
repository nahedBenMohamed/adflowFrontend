import { SpanWithEllipsis, TruncateMixin } from '@/shared';
import { memo, type HTMLAttributeAnchorTarget } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

interface RootProps {
  $inactive?: boolean;
  $disabled?: boolean;
}

const Root = styled(Link)<RootProps>`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--primary-blue);
  transition: var(--transition-200);

  &:hover {
    color: var(--button-text-blue-hover);
  }

  &:active {
    color: var(--button-text-blue-active);
  }

  ${p =>
    p.$inactive &&
    css`
      color: var(--button-text-graphite-secondary-text);

      &:hover {
        color: var(--button-text-graphite-secondary-text);
      }

      &:active {
        color: var(--button-text-graphite-primary-text);
      }
    `}

  ${p => p.$disabled && `pointer-events: none`};

  ${TruncateMixin}
`;

interface Props {
  to: string;
  name: string;
  target?: HTMLAttributeAnchorTarget;
  inactive?: boolean;
  disabled?: boolean;
}

const NameCell = memo((props: Props) => {
  const { to, name, target, inactive, disabled } = props;

  return (
    <Root target={target} to={to} $inactive={inactive} $disabled={disabled}>
      <SpanWithEllipsis medium text={name} />
    </Root>
  );
});

NameCell.displayName = 'NameCell';
export { NameCell };
