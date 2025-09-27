import { PanelResizeHandle } from 'react-resizable-panels';
import styled from 'styled-components';

export const ProductsOrderResizeHandler = styled(PanelResizeHandle)`
  height: 12px;

  flex-shrink: 0;

  background-color: transparent;
  border-radius: var(--border-radius-element);
  border: 4px solid var(--graphite-graphite-20);
  transition: var(--transition-200);

  &:hover {
    background-color: var(--graphite-graphite-40);
  }

  &[data-resize-handle-active='pointer'] {
    background-color: var(--graphite-graphite-80);
  }
`;
