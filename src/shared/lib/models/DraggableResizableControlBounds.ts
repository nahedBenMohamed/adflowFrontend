import type { CSSProperties } from 'react';

export interface DraggableResizableControlPosition {
  y: CSSProperties['top'];
  x: CSSProperties['left'];
}

export interface DraggableResizableControlSize {
  width: string;
  height: string;
}

export interface DraggableResizableControlBounds {
  size: DraggableResizableControlSize;
  position: DraggableResizableControlPosition;
}
