import type { Nullable } from '@/shared';
import { useContext } from 'react';
import { DuplicatesContext, type DuplicatesContextValue } from './DuplicatesContext';

export const useDuplicatesContext = (): Nullable<DuplicatesContextValue> =>
  useContext(DuplicatesContext);
