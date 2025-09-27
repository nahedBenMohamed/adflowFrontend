import { PanelResizeHandle } from 'react-resizable-panels';
import styled from 'styled-components';

export const StyledResizeHandler = styled(PanelResizeHandle)`
  border-left: 1px solid var(--graphite-graphite-80);

  position: relative;

  transition: border-color var(--transition-200);

  &:active {
    border-color: var(--graphite-graphite-200);
  }

  // we use this pseudo-elements to make it easier to click on the resize handler
  &::after {
    content: '';

    position: absolute;
    top: 0;
    left: 0;

    height: 100%;
    width: 2px;
  }

  &::before {
    content: '';

    position: absolute;
    top: 0;
    left: -3px;

    height: 100%;
    width: 2px;
  }
`;
