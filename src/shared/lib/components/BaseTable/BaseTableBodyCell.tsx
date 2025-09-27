import type { CSSProperties } from 'react';
import styled from 'styled-components';

interface BaseTableBodyCellProps {
  $width?: number;
  $flex?: CSSProperties['flex'];
}

export const BaseTableBodyCell = styled.div<BaseTableBodyCellProps>`
  position: relative;

  ${p => p.$width && `width: ${p.$width}px`};

  display: flex;
  flex: ${p => p.$flex};

  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  overflow: hidden;
  white-space: nowrap;
`;
