import { MailingApiRoutes, type MailMessagePayload } from '@/modules/mailing';
import {
  DocumentIconWrapper,
  envUtil,
  FileFeedItemContent,
  FileFeedItemDownloadButton,
  FileFeedItemName,
  FileFeedItemSizeBlock,
  FileSize,
  getFileFeedItemIcon,
  ImagePreviewModal,
  isFileTypeImage,
  isFileTypePdf,
  isFileTypeVideo,
  MiniLoader,
  type Nullable,
  PdfViewerModal,
  PreviewIconWrapper,
  SpanWithEllipsis,
  UrlTemplateUtil,
  VideoPlayerModal,
  VisibilityOffIcon,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

const Root = styled.div<{ $canPreview: boolean }>`
  width: 274px;

  display: flex;
  align-items: center;
  gap: 8px;

  padding: 8px;
  border-radius: var(--border-radius-element);
  background-color: var(--graphite-graphite-20);

  ${p =>
    p.$canPreview &&
    css`
      &:hover {
        ${PreviewIconWrapper} {
          pointer-events: auto;

          z-index: 1;

          opacity: 1;
        }
      }
    `}
`;

interface Props {
  mailboxId: number;
  messageId: number;
  fileLink: MailMessagePayload;
  handleDownloadFile: ({
    payloadId,
    fileName,
  }: {
    payloadId: number;
    fileName: string;
  }) => Promise<void>;
}

const MailFileFeedItem = (props: Props) => {
  const { fileLink, mailboxId, messageId, handleDownloadFile } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed.files_block',
  });

  const [isDownloading, setIsDownloading] = useState(false);

  const [previewOpened, { open: openPreview, close: closePreview }] = useDisclosure(false);

  const downloadUrl = UrlTemplateUtil.toPath(MailingApiRoutes.DOWNLOAD_FILE_FROM_MESSAGE, {
    mailboxId,
    messageId,
    payloadId: fileLink.id,
  });

  const { isPdf, isVideo, isImage, canPreview } = useMemo(() => {
    const isPdf = isFileTypePdf(fileLink.mimeType);
    const isVideo = isFileTypeVideo(fileLink.mimeType);
    const isImage = isFileTypeImage(fileLink.mimeType);

    return {
      isPdf,
      isVideo,
      isImage,
      canPreview: isPdf || isVideo || isImage,
    };
  }, [fileLink.mimeType]);

  const handleDownload = async ({
    payloadId,
    fileName,
  }: {
    payloadId: number;
    fileName: Nullable<string>;
  }): Promise<void> => {
    try {
      setIsDownloading(true);

      await handleDownloadFile({
        payloadId,
        fileName: fileName ?? t('downloaded_file', { companyName: envUtil.appName }),
      });
    } catch (e) {
      throw new Error(`Error while downloading attachment: ${e}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Root $canPreview={canPreview}>
        <DocumentIconWrapper>
          {canPreview && (
            <PreviewIconWrapper onClick={openPreview}>
              <VisibilityOffIcon />
            </PreviewIconWrapper>
          )}

          {getFileFeedItemIcon(fileLink.mimeType)}
        </DocumentIconWrapper>

        <FileFeedItemContent>
          <FileFeedItemDownloadButton
            $loading={isDownloading}
            onClick={() => handleDownload({ payloadId: fileLink.id, fileName: fileLink.filename })}
          >
            {isDownloading && (
              <MiniLoader size="small" color="var(--button-text-graphite-secondary-text)" />
            )}

            <FileFeedItemName>
              <SpanWithEllipsis text={fileLink.filename || t('unknown_file')} />
            </FileFeedItemName>
          </FileFeedItemDownloadButton>

          <FileFeedItemSizeBlock>
            {fileLink.size && (
              <FileSize
                $minWidth={0}
                $size={fileLink.size}
                $color="var(--button-text-graphite-primary-text)"
              />
            )}
          </FileFeedItemSizeBlock>
        </FileFeedItemContent>
      </Root>

      {downloadUrl && previewOpened && (
        <>
          {isPdf && (
            <PdfViewerModal
              fileName={fileLink.filename ?? t('unknown_file')}
              fileUrl={downloadUrl}
              opened={previewOpened}
              onClose={closePreview}
            />
          )}

          {isVideo && (
            <VideoPlayerModal
              fileName={fileLink.filename ?? t('unknown_file')}
              fileUrl={downloadUrl}
              opened={previewOpened}
              onClose={closePreview}
            />
          )}

          {isImage && (
            <ImagePreviewModal
              fileName={fileLink.filename ?? t('unknown_file')}
              fileUrl={downloadUrl}
              opened={previewOpened}
              onClose={closePreview}
            />
          )}
        </>
      )}
    </>
  );
};

export { MailFileFeedItem };
