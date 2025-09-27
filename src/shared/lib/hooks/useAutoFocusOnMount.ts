import { useEffect, useRef, type RefObject } from 'react';

const AUTO_FOCUS_TIMEOUT = 200;

export const useAutoFocusOnMount = (enabled = true): RefObject<HTMLInputElement | null> => {
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (inputRef.current && enabled) inputRef.current.focus();
    }, AUTO_FOCUS_TIMEOUT);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [enabled]);

  return inputRef;
};
