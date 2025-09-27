import styled, { css } from 'styled-components';

export const BuilderStepCheckboxItemWrapper = styled.label<{
  $disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
  transition: opacity var(--transition-200);

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;

      opacity: 0.5;
    `}
`;
