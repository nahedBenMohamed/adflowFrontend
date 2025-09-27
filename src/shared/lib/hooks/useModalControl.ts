import { useDisclosure } from '@mantine/hooks';
import { useMemo } from 'react';

export class ModalControl {
  opened: boolean;
  open: () => void;
  close: () => void;

  constructor({ opened, open, close }: ModalControl) {
    this.opened = opened;
    this.open = open;
    this.close = close;
  }
}

export const useModalControl = (initialState: boolean): ModalControl => {
  const [isActive, { close, open }] = useDisclosure(initialState);

  return useMemo(
    () => new ModalControl({ opened: isActive, open, close }),
    [isActive, open, close]
  );
};
