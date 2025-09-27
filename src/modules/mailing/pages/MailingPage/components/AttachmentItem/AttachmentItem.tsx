import {
  DownloadButton,
  formatBytes,
  ImagePreviewModal,
  isFileTypeImage,
  isFileTypePdf,
  isFileTypeVideo,
  type Nullable,
  PdfViewerModal,
  SpanWithEllipsis,
  TruncateMixin,
  UrlTemplateUtil,
  VideoPlayerModal,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { MailingApiRoutes } from '../../../../api';

const Root = styled.div<{ $canPreview: boolean }>`
  position: relative;

  width: 210px;
  height: 56px;

  display: flex;
  flex-direction: column;
  gap: 4px;

  padding: 4px 8px;
  border: 1px solid var(--graphite-graphite-80);
  border-radius: var(--border-radius-element);
  background-color: var(--primary-statuses-white-0);

  span {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: var(--button-text-graphite-priory-text);
  }

  ${TruncateMixin}

  ${p =>
    p.$canPreview &&
    css`
      &:hover {
        cursor: pointer;
      }
    `}
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Size = styled.p`
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

interface Props {
  id: number;
  fileName: string;
  fileType: string;
  messageId: number;
  mailboxId: number;
  size: Nullable<number>;
  onDownload: ({
    payloadId,
    fileName,
  }: {
    payloadId: number;
    fileName: Nullable<string>;
  }) => Promise<void>;
}

const AttachmentItem = (props: Props) => {
  const { id, fileName, messageId, mailboxId, fileType, size, onDownload } = props;

  const [isDownloading, setIsDownloading] = useState(false);
  const [previewOpened, { open: openPreview, close: closePreview }] = useDisclosure(false);

  const downloadUrl = UrlTemplateUtil.toPath(MailingApiRoutes.DOWNLOAD_FILE_FROM_MESSAGE, {
    mailboxId,
    messageId,
    payloadId: id,
  });

  const { isPdf, isVideo, isImage, canPreview } = useMemo(() => {
    const isPdf = isFileTypePdf(fileType);
    const isVideo = isFileTypeVideo(fileType);
    const isImage = isFileTypeImage(fileType);

    return {
      isPdf,
      isVideo,
      isImage,
      canPreview: isPdf || isVideo || isImage,
    };
  }, [fileType]);

  const handleDownload = async (): Promise<void> => {
    try {
      setIsDownloading(true);

      await onDownload({ payloadId: id, fileName });
    } catch (e) {
      throw new Error(`Error while downloading attachment: ${e}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Root key={id} $canPreview={canPreview} onClick={canPreview ? openPreview : undefined}>
        <SpanWithEllipsis text={fileName} />

        <BottomSection>
          {size && <Size>{formatBytes({ bytes: size, decimals: 0 })}</Size>}

          <DownloadButton loading={isDownloading} onClick={handleDownload} />
        </BottomSection>
      </Root>

      {downloadUrl && previewOpened && (
        <>
          {isPdf && (
            <PdfViewerModal
              fileName={fileName}
              fileUrl={downloadUrl}
              opened={previewOpened}
              onClose={closePreview}
            />
          )}

          {isVideo && (
            <VideoPlayerModal
              fileName={fileName}
              fileUrl={downloadUrl}
              opened={previewOpened}
              onClose={closePreview}
            />
          )}

          {isImage && (
            <ImagePreviewModal
              fileName={fileName}
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

export { AttachmentItem };
