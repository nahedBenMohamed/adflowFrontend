import { useCallback, useRef, useState } from 'react';

interface ErrorMessageIdleResult {
  error?: string;
  idle: () => void;
}

export const useErrorMessageIdle = (msg: string, timeoutMs = 3000): ErrorMessageIdleResult => {
  const [error, setError] = useState<string>();

  const timeoutId = useRef<ReturnType<typeof setTimeout>>(null);

  const idle = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    setError(msg);

    timeoutId.current = setTimeout(() => {
      setError(undefined);
    }, timeoutMs);
  }, [msg, timeoutMs]);

  return {
    error,
    idle,
  };
};
