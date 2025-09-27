import styled from 'styled-components';

export const IntegrationInfoText = styled.p<{ $gray?: boolean }>`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${p =>
    p.$gray
      ? 'var(--button-text-graphite-primary-text)'
      : 'var(--button-text-graphite-priory-text);'};

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
