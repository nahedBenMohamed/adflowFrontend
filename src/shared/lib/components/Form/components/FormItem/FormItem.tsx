import type { CSSProperties, ForwardedRef, ReactNode, Ref } from 'react';
import styled, { css } from 'styled-components';
import { NoSelectMixin } from '../../../../mixins';

interface RootProps {
  $disabled?: boolean;
  $readonly?: boolean;
  $minHeight?: string;
  $gridColumn?: string;
  $gap?: CSSProperties['gap'];
  $width?: CSSProperties['width'];
  $readonlyButLinksClickable?: boolean;
}

const Root = styled.div<RootProps>`
  width: ${p => p.$width};
  min-height: ${p => p.$minHeight};

  display: flex;
  flex-direction: column;
  gap: ${p => p.$gap ?? '16px'};

  ${p => p.$gridColumn && `grid-column: ${p.$gridColumn}`};

  ${p =>
    p.$disabled &&
    css`
      cursor: not-allowed;

      opacity: 0.65;

      * {
        pointer-events: none;
      }
    `}

  ${p =>
    (p.$readonly || p.$readonlyButLinksClickable) &&
    css`
      cursor: default;

      opacity: 0.8;

      * {
        pointer-events: none;
      }

      ${p.$readonlyButLinksClickable &&
      css`
        a {
          pointer-events: all;
        }
      `}

      ${NoSelectMixin}
    `}
`;

interface Props {
  ref?: Ref<HTMLDivElement | HTMLLabelElement>;
  gridColumn?: string;
  disabled?: boolean;
  readonly?: boolean;
  readonlyButLinksClickable?: boolean;
  label?: boolean;
  minHeight?: string;
  children: ReactNode;
  gap?: CSSProperties['gap'];
  width?: CSSProperties['width'];
}

const FormItem = (props: Props) => {
  const {
    ref,
    gridColumn,
    disabled,
    readonly,
    readonlyButLinksClickable,
    label,
    minHeight,
    children,
    gap,
    width,
  } = props;

  return (
    <Root
      ref={ref as ForwardedRef<HTMLDivElement>}
      $gap={gap}
      $width={width}
      $disabled={disabled}
      $readonly={readonly}
      $minHeight={minHeight}
      $gridColumn={gridColumn}
      as={label ? 'label' : 'div'}
      $readonlyButLinksClickable={readonlyButLinksClickable}
    >
      {children}
    </Root>
  );
};

export { FormItem };
