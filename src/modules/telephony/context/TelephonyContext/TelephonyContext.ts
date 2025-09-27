import type { Nullable } from '@/shared';
import { createContext, type Dispatch } from 'react';

export interface TelephonyContextValue {
  opened: boolean;
  folded: boolean;
  modalTransitionable: boolean;
  setOpened: Dispatch<React.SetStateAction<boolean>>;
  setFolded: Dispatch<React.SetStateAction<boolean>>;
  setModalTransitionable: Dispatch<React.SetStateAction<boolean>>;
}

export const TelephonyContext = createContext<Nullable<TelephonyContextValue>>(null);
