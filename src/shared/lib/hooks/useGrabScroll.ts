import { useResizeObserver } from '@mantine/hooks';
import { Ref, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useSwipeable, type SwipeableHandlers } from 'react-swipeable';
import { useWindowSize } from 'usehooks-ts';

interface UseGrabScrollResult {
  tracked: boolean;
  initialScrollX: number;
  handlers: SwipeableHandlers;
  containerRef: Ref<HTMLDivElement>;
  setTracked: Dispatch<SetStateAction<boolean>>;
}

export const useGrabScroll = (isAllowedGrabbing: boolean): UseGrabScrollResult => {
  const [containerRef, rect] = useResizeObserver<HTMLDivElement>();

  const { width } = useWindowSize();

  const [initialScrollX, setInitialScrollX] = useState(0);
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setInitialScrollX(window.scrollX);

    const safetyOffset = 50;

    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setTracked(containerRef.current.offsetWidth + safetyOffset > width);
  }, [containerRef, rect.width, width]);

  const handlers = useSwipeable({
    trackTouch: false,
    trackMouse: tracked,
    onSwiping: eData => {
      if (!isAllowedGrabbing) return;

      const e = eData.event as MouseEvent;

      e.preventDefault();

      window.scrollTo({
        left: initialScrollX - eData.deltaX,
      });
    },
    onTouchStartOrOnMouseDown: () => setInitialScrollX(window.scrollX),
  });

  return {
    tracked,
    handlers,
    containerRef,
    initialScrollX,
    setTracked,
  };
};
