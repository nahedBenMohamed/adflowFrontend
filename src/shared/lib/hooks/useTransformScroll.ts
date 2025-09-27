import { useEffect, type RefObject } from 'react';
import { type Nullable } from '../types';

export const useTransformScroll = (
  ref: RefObject<HTMLElement | null> | Nullable<HTMLElement>,
  disabled?: boolean
): void => {
  useEffect(() => {
    const transformScroll = (e: WheelEvent) => {
      if (!ref) return;

      e.preventDefault();

      const element = ref instanceof HTMLElement ? ref : ref.current;

      if (element) element.scrollLeft += e.deltaY + e.deltaX;
    };

    if (!ref) return;

    const element = ref instanceof HTMLElement ? ref : ref.current;

    if (element) {
      if (disabled) {
        element.removeEventListener('wheel', transformScroll);
      } else {
        element.addEventListener('wheel', transformScroll);

        return () => element.removeEventListener('wheel', transformScroll);
      }
    }
  }, [disabled, ref]);
};
