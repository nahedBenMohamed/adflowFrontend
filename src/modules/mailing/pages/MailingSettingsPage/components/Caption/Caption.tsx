import styled from 'styled-components';

export const Caption = styled.div<{ $gray?: boolean }>`
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  color: ${p =>
    p.$gray
      ? 'var(--button-text-graphite-primary-text)'
      : 'var(--button-text-graphite-priory-text)'};
`;
