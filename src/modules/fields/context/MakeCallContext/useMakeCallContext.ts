import type { Nullable } from '@/shared';
import { useContext } from 'react';
import { MakeCallContext, type MakeCallContextValue } from './MakeCallContext';

export const useMakeCallContext = (): Nullable<MakeCallContextValue> => useContext(MakeCallContext);
