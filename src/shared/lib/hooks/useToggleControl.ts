import { useDisclosure } from '@mantine/hooks';
import { useMemo } from 'react';

export class ToggleControl {
  active: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;

  constructor({ active, toggle, close, open }: ToggleControl) {
    this.active = active;
    this.toggle = toggle;
    this.close = close;
    this.open = open;
  }
}

export const useToggleControl = (initialState: boolean): ToggleControl => {
  const [active, { toggle, close, open }] = useDisclosure(initialState);

  return useMemo(
    () => new ToggleControl({ active, toggle, close, open }),
    [active, toggle, close, open]
  );
};
