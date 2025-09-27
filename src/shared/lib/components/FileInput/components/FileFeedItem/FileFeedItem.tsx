import { useDisclosure } from '@mantine/hooks';
import { memo, useCallback, useMemo, useState, type ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { VisibilityOffIcon } from '../../../../../assets';
import { ImagePreviewModal, MiniLoader, VideoPlayerModal } from '../../../../components';
import {
  getFileFeedItemIcon,
  isFileTypeImage,
  isFileTypePdf,
  isFileTypeVideo,
} from '../../../../helpers';
import { TruncateMixin } from '../../../../mixins';
import { FileModel, type FileInfo } from '../../../../models';
import type { Optional } from '../../../../types/Optional';
import { FileUtil } from '../../../../utils';
import {
  CLEAR_BUTTON_CLASS,
  ClearButton,
} from '../../../Form/MySelect/components/ClearButton/ClearButton';
import { PdfViewerModal } from '../../../PdfViewerModal/PdfViewerModal';
import { SpanWithEllipsis } from '../../../SpanWithEllipsis/SpanWithEllipsis';
import { FileSize } from '../FileSize/FileSize';

export const PreviewIconWrapper = styled.button`
  pointer-events: none;

  position: absolute;
  top: 0;

  height: 24px;
  width: 24px;

  z-index: -1;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  opacity: 0;
  border-radius: var(--border-radius-element);
  background-color: var(--button-text-graphite-primary-text);
  transition: var(--transition-200);

  svg path {
    width: 100%;
    height: 100%;

    fill: var(--primary-statuses-white-0);
  }

  &:hover {
    cursor: pointer;
  }
`;

interface RootProps {
  $canPreview: boolean;
  $noBackground?: boolean;
}

const Root = styled.div<RootProps>`
  width: 274px;

  display: flex;
  align-items: center;
  gap: 8px;

  padding: 8px;
  background-color: ${p => !p.$noBackground && `var(--graphite-graphite-20)`};
  border-radius: var(--border-radius-element);

  .${CLEAR_BUTTON_CLASS} {
    opacity: 0;
  }

  &:hover {
    .${CLEAR_BUTTON_CLASS} {
      opacity: 1;
    }

    ${p =>
      p.$canPreview &&
      css`
        ${PreviewIconWrapper} {
          pointer-events: auto;

          z-index: 1;

          opacity: 1;
        }
      `}
  }
`;

export const DocumentIconWrapper = styled.div`
  position: relative;

  height: 24px;
  width: 24px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

export const FileFeedItemContent = styled.div`
  position: relative;

  overflow: hidden;

  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 4px;

  ${TruncateMixin}
`;

export const FileFeedItemName = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

export const FileFeedItemDownloadButton = styled.button<{ $loading: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;

  overflow: hidden;

  &:hover {
    cursor: pointer;

    ${FileFeedItemName} {
      text-decoration: underline;
    }
  }

  ${p =>
    p.$loading &&
    css`
      cursor: default;

      opacity: 0.7;
    `}
`;

export const FileFeedItemSizeBlock = styled.div`
  height: 20px;

  display: flex;
  align-items: center;

  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-primary-text);
`;

interface Props {
  file: FileInfo | FileModel;
  canDelete?: boolean;
  hasNotBackground?: boolean;
  onDelete?: () => void;
}

const FileFeedItem = memo((props: Props) => {
  const { file, canDelete = true, hasNotBackground, onDelete } = props;

  let downloadUrl: Optional<string>;
  let fileName: Optional<string>;
  let fileSize: Optional<number>;
  let fileType: Optional<string>;

  if (file instanceof FileModel) {
    const { name, size } = file.file;

    fileName = name;
    fileSize = size;
    fileType = file.file.type;
  } else {
    fileName = file.fileName;
    fileSize = file.fileSize;
    downloadUrl = file.downloadUrl;
    fileType = file.fileType;
  }

  const [isLoading, setIsLoading] = useState(false);
  const [previewOpened, { open: openPreview, close: closePreview }] = useDisclosure(false);

  const handleDownload = useCallback(async (): Promise<void> => {
    if (!downloadUrl || !fileName) return;

    try {
      setIsLoading(true);
      await FileUtil.downloadFile({ url: downloadUrl, fileName });
    } catch (e) {
      console.error('Error while downloading file', e);
    } finally {
      setIsLoading(false);
    }
  }, [downloadUrl, fileName]);

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

  const FileNameBlock = useMemo<ReactNode>(
    () => (
      <FileFeedItemName>
        <SpanWithEllipsis text={fileName} />
      </FileFeedItemName>
    ),
    [fileName]
  );

  return (
    <>
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

      <Root $noBackground={hasNotBackground} $canPreview={canPreview}>
        <DocumentIconWrapper>
          {canPreview && (
            <PreviewIconWrapper onClick={openPreview}>
              <VisibilityOffIcon />
            </PreviewIconWrapper>
          )}

          {getFileFeedItemIcon(fileType)}
        </DocumentIconWrapper>

        <FileFeedItemContent>
          {downloadUrl ? (
            <FileFeedItemDownloadButton $loading={isLoading} onClick={handleDownload}>
              {isLoading && (
                <MiniLoader size="small" color="var(--button-text-graphite-secondary-text)" />
              )}

              {FileNameBlock}
            </FileFeedItemDownloadButton>
          ) : (
            FileNameBlock
          )}

          <FileFeedItemSizeBlock>
            <FileSize
              $minWidth={0}
              $size={fileSize}
              $color="var(--button-text-graphite-primary-text)"
            />
          </FileFeedItemSizeBlock>
        </FileFeedItemContent>

        {Boolean(canDelete && onDelete) && <ClearButton onClick={onDelete} />}
      </Root>
    </>
  );
});

FileFeedItem.displayName = 'FileFeedItem';
export { FileFeedItem };
