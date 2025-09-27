import { css } from 'styled-components';

export const DropdownScrollbarMixin = css`
  padding: 6px 0;
  overflow-y: auto;
  overflow-x: hidden;

  ::-webkit-scrollbar {
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
