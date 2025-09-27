import type { ChatProvider } from '@/modules/multichat';
import type { Nullable } from '@/shared';
import { createContext } from 'react';

export interface CardFieldHelperContextValue {
  entityId?: number;
  entityName?: string;
  isListView?: boolean;
  stageId?: Nullable<number>;
  providers?: ChatProvider[];
  reloadFeed?: () => void;
  invalidateEntityInCache?: () => void;
}

export const CardFieldHelperContext = createContext<Nullable<CardFieldHelperContextValue>>(null);
