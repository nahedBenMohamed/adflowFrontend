import type { Nullable } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { MailMessagePayload } from '../../../../shared';
import { AttachmentItem } from '../AttachmentItem/AttachmentItem';

const Root = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

interface Props {
  attachments: MailMessagePayload[];
  mailboxId: number;
  messageId: number;
  handleDownload: ({
    payloadId,
    fileName,
  }: {
    payloadId: number;
    fileName: string;
  }) => Promise<void>;
}

const AttachmentList = (props: Props) => {
  const { attachments, mailboxId, messageId, handleDownload } = props;

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing',
  });

  const onDownload = async ({
    payloadId,
    fileName,
  }: {
    payloadId: number;
    fileName: Nullable<string>;
  }): Promise<void> => await handleDownload({ payloadId, fileName: fileName || t('unknown_file') });

  return (
    <Root>
      {attachments.map(a => {
        if (!a.filename)
          throw new Error('Attachment must have a filename to be displayed as a block');

        return (
          <AttachmentItem
            key={a.id}
            id={a.id}
            size={a.size}
            mailboxId={mailboxId}
            messageId={messageId}
            fileType={a.mimeType}
            fileName={a.filename}
            onDownload={onDownload}
          />
        );
      })}
    </Root>
  );
};

export { AttachmentList };
