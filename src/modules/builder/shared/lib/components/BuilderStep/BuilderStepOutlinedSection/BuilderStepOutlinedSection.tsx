import styled, { css } from 'styled-components';

export const BuilderStepOutlinedSection = styled.div<{ $loading?: boolean }>`
  display: flex;
  gap: 16px;

  padding: 16px;
  border: 1px solid var(--graphite-graphite-80);
  border-radius: var(--border-radius-block);
  transition: var(--transition-200);

  ${p =>
    p.$loading &&
    css`
      cursor: wait;

      opacity: 0.65;
    `}
`;
