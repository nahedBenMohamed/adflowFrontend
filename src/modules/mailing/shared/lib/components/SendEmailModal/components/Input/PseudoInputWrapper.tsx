import styled from 'styled-components';

export const PseudoInputWrapper = styled.div<{ $invalid?: boolean }>`
  position: relative;

  width: 100%;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;

  padding-bottom: 3px;
  border-bottom: 1px solid
    ${p => (p.$invalid ? 'var(--button-text-red-hover)' : 'var(--graphite-graphite-120)')};
  transition: var(--transition-200);
`;
