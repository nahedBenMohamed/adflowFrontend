import type { Nullable } from '@/shared';
import { createContext, type Dispatch, type SetStateAction } from 'react';

export interface MultichatContextValue {
  opened: boolean;
  pageOpened: boolean;
  activeChatId: Nullable<number>;
  activeProviderId: Nullable<number>;
  setOpened: Dispatch<SetStateAction<boolean>>;
  setPageOpened: Dispatch<SetStateAction<boolean>>;
  setActiveChatId: Dispatch<SetStateAction<Nullable<number>>>;
  setActiveProviderId: Dispatch<SetStateAction<Nullable<number>>>;
  editMessageId: Nullable<number>;
  setEditMessageId: Dispatch<SetStateAction<Nullable<number>>>;
  replyToId: Nullable<number>;
  setReplyToId: Dispatch<SetStateAction<Nullable<number>>>;
}

export const MultichatContext = createContext<Nullable<MultichatContextValue>>(null);
