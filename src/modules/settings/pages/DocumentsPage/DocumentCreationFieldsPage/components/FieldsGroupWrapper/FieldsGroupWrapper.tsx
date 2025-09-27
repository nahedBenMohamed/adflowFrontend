import type { CSSProperties } from 'react';
import styled, { css } from 'styled-components';

interface FieldsGroupWrapperProps {
  $gap?: CSSProperties['gap'];
  $hideDelimiter?: boolean;
}

export const FieldsGroupWrapper = styled.div<FieldsGroupWrapperProps>`
  display: flex;
  flex-direction: column;
  gap: ${p => p.$gap ?? '8px'};

  ${p =>
    !p.$hideDelimiter &&
    css`
      &:not(:first-child) {
        padding-top: 12px;
        border-top: 1px solid var(--graphite-graphite-80);
      }
    `}
`;
