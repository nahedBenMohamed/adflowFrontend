import styled, { css } from 'styled-components';

export const ScrollButton = styled.button<{ $reverse?: boolean }>`
  width: 30px;
  height: 31px;

  padding: 0 0 5px 0;
  background: var(--primary-statuses-white-0);
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:first-child {
    border-radius: var(--border-radius-block) 0 0 var(--border-radius-block);
  }

  &:last-child {
    border-radius: 0 var(--border-radius-block) var(--border-radius-block) 0;
  }

  &:disabled {
    svg {
      opacity: 0.4;

      path {
        fill: var(--button-text-graphite-secondary-text);
      }
    }
  }

  &:not(:disabled) {
    &:hover {
      cursor: pointer;

      svg path {
        fill: var(--button-text-graphite-primary-text);
      }
    }

    &:active {
      background-color: var(--graphite-graphite-20);

      svg path {
        fill: var(--button-text-green-active);
      }
    }
  }

  ${p =>
    p.$reverse &&
    css`
      svg {
        transform: rotate(180deg);
      }
    `}
`;
