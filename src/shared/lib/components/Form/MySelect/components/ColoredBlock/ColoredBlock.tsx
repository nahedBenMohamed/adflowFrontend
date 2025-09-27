import type { CSSProperties } from 'react';
import styled, { css } from 'styled-components';

interface BlockProps {
  $color: string;
  $hoverable?: boolean;
  $fitContent?: boolean;
  $bgColor: CSSProperties['backgroundColor'];
}

export const ColoredBlock = styled.div<BlockProps>`
  min-height: 28px;
  width: 100%;
  ${p =>
    p.$fitContent &&
    css`
      width: fit-content;
      max-width: 100%;
    `}

  display: inline-flex;
  align-items: center;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${p => p.$color};

  padding: 2px 8px 3px;
  background: ${p => p.$bgColor};
  border-radius: var(--border-radius-element);

  ${p =>
    p.$hoverable &&
    css`
      &:hover {
        cursor: pointer;
      }
    `};
`;
