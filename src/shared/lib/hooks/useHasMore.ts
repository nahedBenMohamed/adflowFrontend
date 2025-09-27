import { useEffect, useState, type Ref } from 'react';

export const useHasMore = (textRef: Ref<HTMLElement>, deps: any[] = []): boolean => {
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (textRef && typeof textRef !== 'function' && textRef.current)
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setHasMore(textRef.current.scrollHeight > textRef.current.clientHeight);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, textRef]);

  return hasMore;
};
