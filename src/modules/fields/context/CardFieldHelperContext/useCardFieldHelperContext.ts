import type { Nullable } from '@/shared';
import { useContext } from 'react';
import { CardFieldHelperContext, type CardFieldHelperContextValue } from './CardFieldHelperContext';

export const useCardFieldHelperContext = (): Nullable<CardFieldHelperContextValue> =>
  useContext(CardFieldHelperContext);
