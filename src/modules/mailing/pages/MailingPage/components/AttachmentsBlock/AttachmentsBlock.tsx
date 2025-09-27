import { MiniLoader } from '@/shared';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import type { MailMessagePayload } from '../../../../shared';
import { AttachmentList } from '../AttachmentList/AttachmentList';

const AttachmentTitleWrapper = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  gap: 4px;
`;

const AttachmentsTitle = styled.span<{ $clickable?: boolean }>`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: ${p =>
    p.$clickable ? 'var(--primary-blue)' : 'var(--button-text-graphite-secondary-text)'};

  ${p =>
    p.$clickable &&
    css`
      transition: var(--transition-200);

      &:hover {
        cursor: pointer;

        text-decoration: underline;
        color: var(--button-text-blue-hover);
      }
    `}
`;

const MiniLoaderWrapper = styled.div`
  position: relative;
`;

interface Props {
  attachments: MailMessagePayload[];
  mailboxId: number;
  messageId: number;
  handleDownloadFile: ({
    payloadId,
    fileName,
  }: {
    payloadId: number;
    fileName: string;
  }) => Promise<void>;
}

const AttachmentsBlock = (props: Props) => {
  const { attachments, mailboxId, messageId, handleDownloadFile } = props;

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.pages.mailing_page.components.attachments_block',
  });

  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const handleDownloadAll = async (): Promise<void> => {
    try {
      setIsDownloadingAll(true);

      await Promise.all(
        attachments.map(a =>
          handleDownloadFile({
            payloadId: a.id,
            fileName: a.filename ? a.filename : 'Downloaded file',
          })
        )
      );
    } catch (e) {
      console.error(`Error while downloading all attachments: ${e}`);
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const attachmentsCount = attachments.length;

  return (
    <>
      <AttachmentTitleWrapper>
        <AttachmentsTitle>
          {attachmentsCount} {attachmentsCount === 1 ? t('attachment') : t('attachments')}
        </AttachmentsTitle>

        {attachmentsCount > 1 && (
          <>
            <AttachmentsTitle>-</AttachmentsTitle>

            {isDownloadingAll ? (
              <MiniLoaderWrapper>
                <MiniLoader color="var(--primary-blue)" size="small" />
              </MiniLoaderWrapper>
            ) : (
              <AttachmentsTitle $clickable onClick={handleDownloadAll}>
                {t('download_all')}
              </AttachmentsTitle>
            )}
          </>
        )}
      </AttachmentTitleWrapper>

      <AttachmentList
        attachments={attachments}
        mailboxId={mailboxId}
        messageId={messageId}
        handleDownload={handleDownloadFile}
      />
    </>
  );
};

export { AttachmentsBlock };
