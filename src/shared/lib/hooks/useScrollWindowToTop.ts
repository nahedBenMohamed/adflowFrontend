import { useLayoutEffect } from 'react';

export const useScrollWindowToTop = (): void => {
  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  }, []);
};
