import type { Nullable } from '../types';

export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timer: Nullable<ReturnType<typeof setTimeout>> = null;

  return function (...args: any[]) {
    const context = window;

    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      timer = null;
      func.apply(context, args);
    }, delay);
  };
};
