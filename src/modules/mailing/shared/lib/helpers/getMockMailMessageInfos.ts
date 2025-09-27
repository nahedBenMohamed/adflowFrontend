import { UtcDate, UuidUtil, envUtil } from '@/shared';
import type { TFunction } from 'i18next';
import type { MailMessageInfo } from '../..';

export const getMockMailMessageInfos = (t: TFunction): MailMessageInfo[] => [
  {
    id: 1,
    folders: [],
    isSeen: true,
    mailboxId: 1,
    sentTo: 'User',
    date: UtcDate.now(),
    hasAttachment: false,
    threadId: UuidUtil.generate(),
    sentFrom: `${envUtil.appName}`,
    snippet: t('demo_message_snippet'),
    subject: t('demo_message_subject', { company: envUtil.appName }),
  },
];
