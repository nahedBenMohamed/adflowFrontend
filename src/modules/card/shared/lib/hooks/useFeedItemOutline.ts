import type { UtcDate } from '@/shared';
import { useEffect, useRef, useState } from 'react';
import { isFeedItemOutlined } from '../helpers';

export const useFeedItemOutline = (createdAt: UtcDate): boolean => {
  const [outlined, setOutlined] = useState(isFeedItemOutlined(createdAt));

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  if (outlined)
    timeoutRef.current = setTimeout(() => {
      setOutlined(false);
    }, 2000);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return outlined;
};
