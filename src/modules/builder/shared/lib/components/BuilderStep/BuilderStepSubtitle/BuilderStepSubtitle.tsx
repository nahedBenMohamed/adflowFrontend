import styled from 'styled-components';

export const BuilderStepSubtitle = styled.h4<{ $withIndent?: boolean }>`
  font-size: 22px;
  font-weight: 600;
  line-height: 26px;
  color: var(--button-text-graphite-priory-text);

  ${p => p.$withIndent && `padding-left: 24px`};
`;
