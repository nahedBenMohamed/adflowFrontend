import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useTransformScroll } from './useTransformScroll';

interface UseFadedHorizontalScrollProps {
  ref: RefObject<HTMLDivElement | null>;
  showLeftFade: boolean;
  showRightFade: boolean;
}

export const useFadedHorizontalScroll = (): UseFadedHorizontalScrollProps => {
  const ref = useRef<HTMLDivElement>(null);

  const [showLeftFade, setShowLeftFade] = useState<boolean>(false);
  const [showRightFade, setShowRightFade] = useState<boolean>(false);

  const handleScroll = useCallback(() => {
    const rootEl = ref.current;

    if (!rootEl) return;

    const { scrollLeft, scrollWidth, clientWidth } = rootEl;

    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setShowLeftFade(scrollLeft > 0);
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setShowRightFade(scrollLeft + clientWidth < scrollWidth);
  }, []);

  useEffect(() => {
    const rootEl = ref.current;

    if (!rootEl) return;

    rootEl.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => rootEl.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useTransformScroll(ref);

  return { ref, showLeftFade, showRightFade };
};
