import { useDisclosure } from '@mantine/hooks';
import { memo, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  DeleteButton,
  DownloadButton,
  ImagePreviewModal,
  VideoPlayerModal,
} from '../../../../components';
import {
  getBlockFileItemIcon,
  isFileTypeImage,
  isFileTypePdf,
  isFileTypeVideo,
} from '../../../../helpers';
import { TruncateMixin } from '../../../../mixins';
import { FileModel, type FileInfo } from '../../../../models';
import type { Optional } from '../../../../types/Optional';
import { FileUtil } from '../../../../utils';
import { PdfViewerModal } from '../../../PdfViewerModal/PdfViewerModal';
import { SpanWithEllipsis } from '../../../SpanWithEllipsis/SpanWithEllipsis';
import { FileSize } from '../FileSize/FileSize';

const Root = styled.div<{ $withIcon: boolean }>`
  width: ${p => (p.$withIcon ? '227px' : '187px')};

  display: flex;
  align-items: center;
  gap: 8px;

  padding: 4px 8px;
  border: 1px solid var(--graphite-graphite-80);
  background-color: var(--primary-statuses-white-0);
  border-radius: var(--border-radius-element);
`;

const Content = styled.div`
  position: relative;

  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 2px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

const DocumentIconWrapper = styled.div`
  height: 32px;
  width: 32px;

  flex-shrink: 0;
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

interface Props {
  file: FileInfo | FileModel;
  canDelete?: boolean;
  withIcon?: boolean;
  onDelete?: () => void;
}

const BlockFileItem = memo((props: Props) => {
  const { file, canDelete = true, withIcon = false, onDelete } = props;

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
      canPreview: Boolean((isPdf || isVideo || isImage) && downloadUrl),
    };
  }, [fileType, downloadUrl]);

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

      <Root $withIcon={withIcon}>
        {withIcon && <DocumentIconWrapper>{getBlockFileItemIcon(fileType)}</DocumentIconWrapper>}

        <Content>
          <SpanWithEllipsis
            text={fileName}
            hoverable={canPreview}
            onClick={canPreview ? openPreview : undefined}
          />

          <BottomSection>
            <FileSize $size={fileSize} />
            <Controls>
              {downloadUrl && (
                <DownloadButton size="small" loading={isLoading} onClick={handleDownload} />
              )}
              {canDelete && onDelete && <DeleteButton size="small" onClick={onDelete} />}
            </Controls>
          </BottomSection>
        </Content>
      </Root>
    </>
  );
});

BlockFileItem.displayName = 'BlockFileItem';
export { BlockFileItem };
