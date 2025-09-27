import type { DraggableResizableControlBounds, DraggableResizableControlPosition } from '@/shared';
import { getNumberFromPx } from './getNumberFromPx';

const windowInnerHeight = window.innerHeight;

const defaultModalSize = {
  width: '912px',
  height: '606px',
};

const edgeOffset = 16;

const defaultModalPosition: DraggableResizableControlPosition = {
  x: window.innerWidth - getNumberFromPx(defaultModalSize.width) - edgeOffset,
  y: windowInnerHeight - getNumberFromPx(defaultModalSize.height) - edgeOffset,
};

export const getDefaultModalBounds = (): DraggableResizableControlBounds => {
  return {
    size: defaultModalSize,
    position: defaultModalPosition,
  };
};
