import { useQuery } from '@tanstack/react-query';
import { MAILING_QUERY_KEYS } from '../../MailingQueryKeys';
import { mailboxSignatureSettingsApi } from '../MailboxSignatureSettingsApi';

export const useGetMailboxesSignatures = () =>
  useQuery({
    queryKey: MAILING_QUERY_KEYS.mailboxesSignatures(),
    queryFn: mailboxSignatureSettingsApi.getSignatures,
  });
