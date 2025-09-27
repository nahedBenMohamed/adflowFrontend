import { memo, type HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { TruncateMixin } from '../../mixins';

interface RootProps {
  $inactive: boolean;
  $bold?: boolean;
  $medium?: boolean;
  $hoverable?: boolean;
  $disabled?: boolean;
}

const Root = styled.span<RootProps>`
  font-weight: ${p => p.$bold && 600};
  font-weight: ${p => p.$medium && 500};
  color: ${p => p.$inactive && 'var(--button-text-graphite-secondary-text)'};

  ${TruncateMixin}

  ${p =>
    p.$hoverable &&
    css`
      &:hover {
        cursor: pointer;
      }
    `}

    ${p =>
    p.$disabled &&
    css`
      pointer-events: none;

      color: var(--button-text-graphite-secondary-text);
    `}
`;

interface Props extends HTMLAttributes<HTMLSpanElement> {
  text: string;
  bold?: boolean;
  medium?: boolean;
  inactive?: boolean;
  showTitle?: boolean;
  hoverable?: boolean;
  disabled?: boolean;
}

const SpanWithEllipsis = memo((props: Props) => {
  const {
    text,
    bold,
    medium,
    inactive = false,
    showTitle = true,
    hoverable,
    disabled,
    ...rest
  } = props;

  return (
    <Root
      $bold={bold}
      $medium={medium}
      $inactive={inactive}
      $disabled={disabled}
      $hoverable={hoverable}
      title={showTitle ? text : undefined}
      {...rest}
    >
      {text}
    </Root>
  );
});

SpanWithEllipsis.displayName = 'SpanWithEllipsis';
export { SpanWithEllipsis };
