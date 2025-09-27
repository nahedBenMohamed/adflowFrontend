import { queryClient } from '@/index';
import { MAILING_QUERY_KEYS } from '../../MailingQueryKeys';

export const invalidateMailboxesSignaturesInCache = () =>
  queryClient.invalidateQueries({
    queryKey: MAILING_QUERY_KEYS.mailboxesSignatures(),
  });
