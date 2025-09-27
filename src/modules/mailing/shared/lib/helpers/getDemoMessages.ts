import { envUtil, UtcDate } from '@/shared';
import type { TFunction } from 'i18next';
import type { MailMessage } from '../..';

export const getDemoMessages = ({
  currentUserName,
  t,
}: {
  currentUserName: string;
  t: TFunction;
}): MailMessage[] => [
  {
    id: -1,
    cc: [],
    isSeen: true,
    mailboxId: -1,
    replyTo: null,
    threadId: '-1',
    entityInfo: null,
    date: UtcDate.now(),
    hasAttachment: false,
    sentTo: [currentUserName],
    sentFrom: `${envUtil.appName}`,
    subject: t('demo_message_title', { company: envUtil.appName }),
    snippet: t('demo_message_snippet', { company: envUtil.appName }),
    payloads: [
      {
        id: -1,
        size: 0,
        sortOrder: 0,
        filename: null,
        mimeType: 'text/html',
        content: `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${t('demo_message_title', { company: envUtil.appName })}</title>
          </head>
          <body>
            <p style="margin-bottom: 24px;">${t('dear_customer')}</p>

            <p style="margin-bottom: 24px;">
            ${t('demo_message_intro', { company: envUtil.appName })}
            </p>

            <p style="margin-bottom: 8px;">${t('email_functionality')}</p>
              ${t('email_functionality_ul')}
            <br />
        
            <p style="margin-bottom: 24px;">
              ${t('reach_out')}
              <a href="mailto: ${envUtil.appDemoEmail}">${envUtil.appDemoEmail}</a>
            </p>
        
            <p>${t('sincerely_amwork', { company: envUtil.appName })}</p>

            <a href=${envUtil.appUrl} target="_blank" rel="noopener noreferrer">${envUtil.appUrl}</a>
          </body>
        </html>
        `,
      },
    ],
  },
];
