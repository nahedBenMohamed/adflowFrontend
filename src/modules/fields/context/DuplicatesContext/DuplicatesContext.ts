import type { Nullable } from '@/shared';
import { createContext } from 'react';

export interface DuplicatesContextValue {
  searchDuplicates: boolean;
  entityTypeId: number;
  excludeEntitiesIds: number[];
  changeEntityCb: (duplicateId: number) => void;
}

export const DuplicatesContext = createContext<Nullable<DuplicatesContextValue>>(null);
