import styled from 'styled-components';

export const RadioWrapper = styled.label<{ $grayLabel?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${p =>
    p.$grayLabel
      ? 'var(--button-text-graphite-primary-text)'
      : 'var(--button-text-graphite-priory-text)'};
`;
