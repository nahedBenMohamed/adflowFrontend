import { useEffect, useRef, useState } from 'react';

export const usePhoneCallTimer = (timerActive: boolean): number => {
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    if (timerActive) {
      intervalRef.current = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerActive]);

  return timer;
};
