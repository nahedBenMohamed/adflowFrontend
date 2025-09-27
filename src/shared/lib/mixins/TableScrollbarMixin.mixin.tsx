import { css } from 'styled-components';

export const TableScrollbarMixin = css`
  overflow: auto;

  &::-webkit-scrollbar {
    height: 8px;
    width: 8px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-track {
    background-color: var(--graphite-graphite-20);
  }

  &::-webkit-scrollbar-thumb {
    background: #aab7d442;
    border-radius: var(--border-radius-block);
    border: 2px solid var(--graphite-graphite-20);
    transition: var(--transition-200);

    &:hover {
      background: #aab7d45f;
    }
  }
`;
