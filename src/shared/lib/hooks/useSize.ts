import { useEffect, useState, type RefObject } from 'react';

interface Size {
  width: number;
  height: number;
}

const useSize = (ref: RefObject<HTMLElement | null>): Size => {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (let entry of entries) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    };

    const resizeObserver = new ResizeObserver(entries => handleResize(entries));
    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return size;
};

export { useSize };
