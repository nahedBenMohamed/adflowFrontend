import styled from 'styled-components';

export const StockQuantityBlock = styled.div`
  flex: 1;

  font-size: 14px;
  text-align: left;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  padding: 3px 8px;
  border-radius: var(--border-radius-element);
  background-color: var(--graphite-graphite-40);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background-color: var(--graphite-graphite-80);
  }
`;
