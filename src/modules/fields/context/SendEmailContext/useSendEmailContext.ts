import type { Nullable } from '@/shared';
import { useContext } from 'react';
import { SendEmailContext, type SendEmailContextValue } from './SendEmailContext';

export const useSendEmailContext = (): Nullable<SendEmailContextValue> =>
  useContext(SendEmailContext);
