import styled, { type CSSProperties } from 'styled-components';

export const PopupHeaderIcon = styled.div<{ $color?: CSSProperties['color'] }>`
  width: 32px;
  height: 32px;

  flex-shrink: 0;

  &::before {
    font-size: 32px;
    line-height: 32px;
    color: ${p => p.$color};
  }
`;
