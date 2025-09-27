import styled from 'styled-components';

export const SubmitIntervalButton = styled.button`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-secondary-text);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: var(--button-text-graphite-primary-text);
  }

  &:active {
    color: var(--button-text-graphite-primary-text);
  }

  &:disabled {
    opacity: 0.6;

    pointer-events: none;
  }
`;
