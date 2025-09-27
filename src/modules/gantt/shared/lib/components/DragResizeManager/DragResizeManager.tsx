import { usePersistFn, type Nullable } from '@/shared';
import { observer } from 'mobx-react-lite';
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';
import { AutoScroller } from '../../../../store';
import { BAR_HEIGHT, BarClickEvent } from '../../models';

interface RootProps {
  $type: DragResizeType;
  $disabled?: boolean;
}

const MIN_WIDTH = 10;

const Root = styled.div<RootProps>`
  position: absolute;
  top: -1px;

  width: 12px;
  height: ${BAR_HEIGHT}px;
  min-width: ${MIN_WIDTH}px;

  z-index: 5;

  &:hover {
    cursor: col-resize;
  }

  ${p =>
    (p.$type === 'left' || p.$type === 'right') &&
    css`
      display: flex;
      justify-content: center;
      align-items: center;

      border-radius: 2px;
      border: 1px solid var(--graphite-graphite-200);
      background: var(--graphite-graphite-40);
    `}

  ${p => {
    switch (p.$type) {
      case 'left':
        return `left: -10px`;

      case 'right':
        return `right: -10px`;

      case 'move':
        return css`
          position: relative;

          width: 100%;
          height: 100%;

          &:hover {
            cursor: grab;
          }
        `;
    }
  }}

  ${p =>
    p.$disabled &&
    css`
      && {
        cursor: not-allowed;
      }
    `}
`;

interface PortalRootProps {
  $type: DragResizeType;
  $disabled?: boolean;
}

const PortalRoot = styled.div<PortalRootProps>`
  position: fixed;
  inset: 0;

  z-index: 9999;

  &:hover {
    cursor: ${p => (p.$disabled ? 'not-allowed' : p.$type === 'move' ? 'grabbing' : 'col-resize')};
  }
`;

type DragResizeType = 'left' | 'right' | 'move';

interface Props {
  defaultSize: {
    width: number;
    x: number;
  };
  type: DragResizeType;
  grid?: number;
  disabled?: boolean;
  children?: ReactNode;
  scroller?: Nullable<HTMLElement>;
  autoScroll?: boolean;
  clickStart?: boolean;
  onResize: ({ width, x }: { width: number; x: number }) => void;
  onBeforeResize?: () => void;
  onAutoScroll?: (delta: number) => void;
  hasReachedEdge?: (position: 'left' | 'right') => boolean;
  onResizeEnd?: ({ width, x }: { width: number; x: number }) => void;
}

const snapGrid = ({ distance, grid }: { distance: number; grid: number }): number =>
  Math.ceil(distance / grid) * grid;

const DragResizeManager = observer((props: Props) => {
  const {
    defaultSize: { x: defaultX, width: defaultWidth },
    type,
    grid,
    disabled = false,
    children,
    scroller,
    autoScroll: enableAutoScroll = true,
    clickStart = false,
    onResize,
    onBeforeResize,
    onAutoScroll,
    hasReachedEdge = () => false,
    onResizeEnd,
  } = props;

  const positionRef = useRef({
    clientX: 0,
    width: defaultWidth,
    x: defaultX,
  });

  const moveRef = useRef({
    clientX: 0,
  });

  const [resizing, setResizing] = useState(false);

  const handleAutoScroll = usePersistFn((delta: number) => {
    updateSize();

    onAutoScroll?.(delta);
  });

  const autoScroller = useMemo(
    () => new AutoScroller({ scroller, onAutoScroll: handleAutoScroll, hasReachedEdge }),
    [scroller, handleAutoScroll, hasReachedEdge]
  );

  const updateSize = usePersistFn(() => {
    if (disabled) return;

    const distance =
      moveRef.current.clientX - positionRef.current.clientX + autoScroller.autoScrollPos;

    switch (type) {
      case 'left': {
        let width = positionRef.current.width - distance;

        width = Math.max(width, MIN_WIDTH);

        if (grid) width = snapGrid({ distance: width, grid });

        const pos = width - positionRef.current.width;
        const x = positionRef.current.x - pos;

        onResize({ width, x });

        break;
      }

      case 'right': {
        let width = positionRef.current.width + distance;

        width = Math.max(width, MIN_WIDTH);

        if (grid) width = snapGrid({ distance: width, grid });

        const { x } = positionRef.current;
        onResize({ width, x });

        break;
      }

      case 'move': {
        const { width } = positionRef.current;

        let rightDistance = distance;

        if (grid) rightDistance = snapGrid({ distance, grid });

        const x = positionRef.current.x + rightDistance;

        onResize({ width, x });

        break;
      }
    }
  });

  const handleMouseMove = usePersistFn((e: MouseEvent) => {
    if (disabled) return;

    if (!resizing) {
      setResizing(true);

      if (!clickStart) onBeforeResize?.();
    }

    moveRef.current.clientX = e.clientX;

    updateSize();
  });

  const handleMouseUp = usePersistFn(() => {
    if (disabled) return;

    autoScroller.stop();

    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);

    if (resizing) {
      setResizing(false);

      onResizeEnd &&
        onResizeEnd({
          x: positionRef.current.x,
          width: positionRef.current.width,
        });
    }
  });

  const handleMouseDown = useCallback<MouseEventHandler<HTMLDivElement>>(
    e => {
      if (disabled) return;

      e.stopPropagation();

      if (enableAutoScroll && scroller) autoScroller.start();

      if (clickStart) {
        onBeforeResize?.();

        setResizing(true);
      }

      positionRef.current.clientX = e.clientX;
      positionRef.current.x = defaultX;
      positionRef.current.width = defaultWidth;

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      // we stopped propagation of click native event here, because its propagation
      // breaks dragging functionality
      // instead, we emit custom event here to close popover menus
      document.dispatchEvent(new BarClickEvent());
    },
    [
      scroller,
      defaultX,
      disabled,
      clickStart,
      autoScroller,
      defaultWidth,
      enableAutoScroll,
      handleMouseUp,
      onBeforeResize,
      handleMouseMove,
    ]
  );

  return (
    <Root $type={type} $disabled={disabled} onMouseDown={handleMouseDown}>
      {resizing && createPortal(<PortalRoot $type={type} $disabled={disabled} />, document.body)}

      {children}
    </Root>
  );
});

DragResizeManager.displayName = 'DragResizeManager';
export { DragResizeManager };
