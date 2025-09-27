import styled from 'styled-components';

export const HeaderDelimiter = styled.hr<{ $subheader?: boolean }>`
  height: ${p => (p.$subheader ? 20 : 24)}px;

  flex-shrink: 0;

  border-left: 1px solid var(--graphite-graphite-80);
`;
