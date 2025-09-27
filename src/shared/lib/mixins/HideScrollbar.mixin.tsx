import { css } from 'styled-components';

export const HideScrollbarMixin = css`
  // to hide scrollbar in Firefox
  scrollbar-width: none;
  overflow: -moz-scrollbars-none;

  // to hide scrollbar in IE and Edge
  -ms-overflow-style: none;

  // to hide scrollbar in Chrome and Safari
  &::-webkit-scrollbar {
    display: none;
  }

  // to hide scrollbar in Chrome and Safari
  &::-webkit-scrollbar {
    display: none;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: transparent;
  }

  &::-webkit-scrollbar-corner {
    background-color: transparent;
  }

  &::-webkit-scrollbar-button {
    display: none;
  }
`;
