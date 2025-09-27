import styled from 'styled-components';

export const Block = styled.div<{ $noShadow?: boolean }>`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
  box-shadow: ${p => (p.$noShadow ? 'none' : '0px 0px 2px #eef4fe, 0px 1px 2px #d0daeb')};
`;
