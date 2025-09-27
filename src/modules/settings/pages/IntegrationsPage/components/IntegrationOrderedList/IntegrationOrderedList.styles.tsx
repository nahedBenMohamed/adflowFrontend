import styled from 'styled-components';

export const IntegrationOrderedList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const IntegrationOrderedListItem = styled.li`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  margin-left: 18px;

  code {
    font-weight: 500;
    border: 1px solid var(--graphite-graphite-80);
    font-family: var(--font-family-mono);
    white-space: nowrap;

    padding: 1px 4px;
    border-radius: var(--border-radius-element);
    background-color: var(--background-noun-20);
  }
`;
