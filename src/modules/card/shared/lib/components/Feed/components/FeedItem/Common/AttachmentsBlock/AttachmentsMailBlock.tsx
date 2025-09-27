import type { MailMessagePayload } from '@/modules/mailing';
import { MiniLoader, envUtil } from '@/shared';
import { useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { MailFileFeedItem } from '../MailFileFeedItem/MailFileFeedItem';

const Root = styled.div<{ $margin?: CSSProperties['margin'] }>`
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${p => p.$margin && `margin: ${p.$margin}`}
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AttachmentsTitle = styled.span<{ $clickable?: boolean }>`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-secondary-text);
  transition: var(--transition-200);

  ${p =>
    p.$clickable &&
    css`
      color: var(--button-text-green-default);

      &:hover {
        cursor: pointer;

        color: var(--button-text-green-active);
      }

      &:active {
        color: var(--button-text-green-hover);
      }
    `}
`;

const AttachmentListWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

interface Props {
  mailboxId: number;
  messageId: number;
  fileLinks: MailMessagePayload[];
  margin?: CSSProperties['margin'];
  handleDownloadFile: ({
    payloadId,
    fileName,
  }: {
    payloadId: number;
    fileName: string;
  }) => Promise<void>;
}

const AttachmentsMailBlock = (props: Props) => {
  const { fileLinks, mailboxId, messageId, margin, handleDownloadFile } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed.files_block',
  });

  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const handleDownloadAll = async (): Promise<void> => {
    try {
      setIsDownloadingAll(true);

      await Promise.all(
        fileLinks.map<Promise<void>>(fl =>
          handleDownloadFile({
            payloadId: fl.id,
            fileName: fl.filename || t('downloaded_file', { companyName: envUtil.appName }),
          })
        )
      );
    } catch (e) {
      console.error(`Error while downloading all attachments: ${e}`);
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const attachmentsCount = fileLinks.length;

  return (
    <Root $margin={margin}>
      <Header>
        <AttachmentsTitle>
          {attachmentsCount} {attachmentsCount === 1 ? t('attachment') : t('attachments')}
        </AttachmentsTitle>

        {attachmentsCount > 1 && (
          <>
            <AttachmentsTitle>-</AttachmentsTitle>

            {isDownloadingAll ? (
              <MiniLoader size="small" color="var(--primary-statuses-green-520)" />
            ) : (
              <AttachmentsTitle $clickable onClick={handleDownloadAll}>
                {t('download_all')}
              </AttachmentsTitle>
            )}
          </>
        )}
      </Header>

      <AttachmentListWrapper>
        {fileLinks.map(fl => (
          <MailFileFeedItem
            key={fl.id}
            mailboxId={mailboxId}
            messageId={messageId}
            fileLink={fl}
            handleDownloadFile={handleDownloadFile}
          />
        ))}
      </AttachmentListWrapper>
    </Root>
  );
};

export { AttachmentsMailBlock };
