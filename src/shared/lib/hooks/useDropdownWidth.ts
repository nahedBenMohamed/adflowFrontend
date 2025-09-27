import { useResizeObserver } from '@mantine/hooks';
import { Ref, useLayoutEffect, useState } from 'react';
import { useWindowSize } from 'usehooks-ts';

export const useDropdownWidth = <Element extends HTMLElement = HTMLDivElement>(): [
  number,
  Ref<Element>,
] => {
  const [dropdownWidth, setDropdownWidth] = useState<number>(0);
  const [ref, rect] = useResizeObserver<Element>();
  const size = useWindowSize();

  useLayoutEffect(() => {
    if (ref.current) setDropdownWidth(ref.current.offsetWidth);
  }, [size, ref, rect.width]);

  return [dropdownWidth, ref];
};
