import { useEffect, useMemo, useState } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
}

export const useConditionalWindowScroll = (enabled?: boolean): ScrollPosition => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    const scrollHandler = () => {
      setX(window.scrollX);
      setY(window.scrollY);
    };

    if (enabled) {
      window.addEventListener('scroll', scrollHandler);
    } else {
      window.removeEventListener('scroll', scrollHandler);
    }

    return () => window.removeEventListener('scroll', scrollHandler);
  }, [enabled]);

  return useMemo<ScrollPosition>(() => ({ x, y }), [x, y]);
};
