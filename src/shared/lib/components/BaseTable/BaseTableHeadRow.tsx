import type { CSSProperties } from 'react';
import styled, { css } from 'styled-components';

export interface BaseTableHeadRowProps {
  $notSticky?: boolean;
  $withSidePlugs?: boolean;
  $top?: CSSProperties['top'];
  $paddingTop?: CSSProperties['paddingTop'];
  $paddingLeft?: CSSProperties['paddingLeft'];
  $paddingRight?: CSSProperties['paddingRight'];
  $backgroundColor?: CSSProperties['backgroundColor'];
}

export const BaseTableHeadRow = styled.div<BaseTableHeadRowProps>`
  position: ${p => (p.$notSticky ? 'relative' : 'sticky')};
  top: ${p => p.$top ?? 0};

  height: 32px;
  width: 100%;

  display: flex;
  align-items: center;
  gap: 16px;

  ${p => !p.$notSticky && `z-index: 1`};

  padding: 8px 12px 0 12px;
  padding-top: ${p => p.$paddingTop};
  padding-left: ${p => p.$paddingLeft};
  padding-right: ${p => p.$paddingRight};

  margin-bottom: 8px;
  border-bottom: 1px solid var(--graphite-graphite-80);
  background-color: ${p => p.$backgroundColor ?? 'var(--primary-statuses-white-0)'};

  ${p =>
    p.$withSidePlugs &&
    css`
      &::before,
      &::after {
        content: '';

        position: absolute;
        top: 0;

        height: calc(100% + 1px);
        width: 4px;

        background-color: ${p.$backgroundColor ?? 'var(--primary-statuses-white-0)'};

        z-index: 1;
      }

      &::before {
        left: -4px;
      }

      &::after {
        right: -4px;
      }
    `}
`;
