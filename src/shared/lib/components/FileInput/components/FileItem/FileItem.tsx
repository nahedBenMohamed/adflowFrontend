import { FileUtil, ImagePreviewModal, isFileTypeImage } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { memo, useCallback, useMemo, useState, type CSSProperties } from 'react';
import styled, { css } from 'styled-components';
import { DeleteButton, DownloadButton, VideoPlayerModal } from '../../../../components';
import { extractFileExtensionFromType, isFileTypePdf, isFileTypeVideo } from '../../../../helpers';
import { TruncateMixin } from '../../../../mixins';
import { FileModel, type FileInfo, type UtcDate } from '../../../../models';
import type { Nullable, Optional } from '../../../../types';
import { PdfViewerModal } from '../../../PdfViewerModal/PdfViewerModal';
import { SpanWithEllipsis } from '../../../SpanWithEllipsis/SpanWithEllipsis';
import { FileIcon } from '../FileIcon/FileIcon';
import { FileSize } from '../FileSize/FileSize';

const Root = styled.div`
  display: grid;
  grid-template-columns: 45% 15% 20% auto;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  color: var(--button-text-graphite-priory-text);

  padding: 4px 5px;
  border-radius: var(--border-radius-element);

  &:nth-child(2n) {
    background-color: var(--graphite-graphite-20);
  }
`;

interface NameWrapperProps {
  $hoverable: boolean;
  $minWidth?: CSSProperties['minWidth'];
}

const NameWrapper = styled.div<NameWrapperProps>`
  min-width: ${p => p.$minWidth ?? '160px'};

  display: flex;
  align-items: center;
  gap: 4px;

  ${p =>
    p.$hoverable &&
    css`
      &:hover {
        cursor: pointer;
      }
    `}
`;

const Date = styled.div<{ $minWidth?: CSSProperties['minWidth'] }>`
  min-width: ${p => p.$minWidth ?? '70px'};

  ${TruncateMixin}
`;

const FileSizeWrapper = styled.div`
  min-width: 92px;

  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
`;

const Extension = styled.span`
  text-transform: uppercase;

  ${TruncateMixin}
`;

const Controls = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  gap: 4px;
`;

interface Props {
  file: FileInfo | FileModel;
  collapsing?: boolean;
  onDelete: Nullable<() => void>;
}

const FileItem = memo((props: Props) => {
  let downloadUrl: Optional<string>;
  let fileName: Optional<string>;
  let fileSize: Optional<number>;
  let fileType: Optional<string>;
  let createdAt: Optional<UtcDate>;

  const { file, collapsing, onDelete } = props;

  if (file instanceof FileModel) {
    const { name, size, type } = file.file;

    fileName = name;
    fileSize = size;
    fileType = type;
  } else {
    fileName = file.fileName;
    fileSize = file.fileSize;
    downloadUrl = file.downloadUrl;
    fileType = file.fileType;
    createdAt = file.createdAt;
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

  const extension = useMemo<string>(() => extractFileExtensionFromType(fileType), [fileType]);

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

      <Root>
        <NameWrapper
          $hoverable={canPreview}
          $minWidth={collapsing ? 0 : undefined}
          onClick={canPreview ? openPreview : undefined}
        >
          <FileIcon type={fileType} onClick={isLoading ? () => {} : handleDownload} />
          <SpanWithEllipsis text={fileName} />
        </NameWrapper>

        {createdAt && (
          <Date $minWidth={collapsing ? 0 : undefined} title={createdAt.displayLong()}>
            {createdAt.displayLong()}
          </Date>
        )}

        <FileSizeWrapper>
          <FileSize $size={fileSize} />
          <Extension title={extension}>{extension}</Extension>
        </FileSizeWrapper>

        <Controls>
          <DownloadButton loading={isLoading} onClick={handleDownload} />

          {onDelete && <DeleteButton onClick={onDelete} />}
        </Controls>
      </Root>
    </>
  );
});

FileItem.displayName = 'FileItem';
export { FileItem };
