import { useCallback, useRef } from 'react';

const usePersistFn = <T extends (...args: any[]) => any>(callback: T): T => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    ((...args) => {
      return callbackRef.current(...args);
    }) as T,
    []
  );
};

export { usePersistFn };
