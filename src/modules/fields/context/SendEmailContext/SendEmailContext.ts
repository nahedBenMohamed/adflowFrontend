import type { Nullable } from '@/shared';
import { createContext } from 'react';

export interface SendEmailContextValue {
  openSendEmailModal: (email: string) => void;
}

export const SendEmailContext = createContext<Nullable<SendEmailContextValue>>(null);
