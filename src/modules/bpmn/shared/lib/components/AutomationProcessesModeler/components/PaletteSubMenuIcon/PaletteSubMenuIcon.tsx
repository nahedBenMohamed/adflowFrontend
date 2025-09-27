import type { CSSProperties } from 'react';
import styled from 'styled-components';

export const PaletteSubMenuIcon = styled.div<{ $color?: CSSProperties['color'] }>`
  width: 20px;
  height: 20px;

  flex-shrink: 0;

  &::before {
    font-size: 20px;
    line-height: 20px;
    color: ${p => p.$color ?? 'var(--button-text-graphite-priory-text)'};
  }
`;
