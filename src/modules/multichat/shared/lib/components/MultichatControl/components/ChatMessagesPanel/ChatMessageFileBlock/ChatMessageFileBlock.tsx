import {
  DeleteButton,
  DownloadButton,
  FileSize,
  FileUtil,
  MediaBreakpoints,
  MiniLoader,
  PdfViewerModal,
  Player,
  PlayerSkeleton,
  SkeletonAnimationMixin,
  TruncateMixin,
  VideoPlayerModal,
  envUtil,
  isFileTypePdf,
  isFileTypeVideo,
  useGetMediaBlobObjectUrl,
  type FileInfo,
  type PlayerDownloadProps,
} from '@/shared';
import { useDisclosure, useInViewport } from '@mantine/hooks';
import getBlobDuration from 'get-blob-duration';
import { useCallback, useMemo, useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css, keyframes } from 'styled-components';
import { DocumentIcon, DownloadIcon, ImageIcon } from '../../../../../../assets';
import type { ChatMessageFile } from '../../../../../models';

const scaleIn = keyframes`
  0% {
    opacity: 0;
    scale: 0;
  }

  100% {
    opacity: 1;
    scale: 1;
  }
`;

const DownloadIconWrapper = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;

  width: 24px;
  height: 24px;

  z-index: -1;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const DocumentTypeIconWrapper = styled.div`
  width: 24px;
  height: 24px;

  animation: ${scaleIn} var(--transition-200);
`;

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .workspace__DeleteButton--Root {
    margin-left: auto;

    opacity: 0;
    scale: 0;
    transition: var(--transition-200);
  }
`;

interface FileIconHelperProps {
  $canDelete: boolean;
  $downloading: boolean;
  $canDownload: boolean;
}

const FileIconHelper = styled.div<FileIconHelperProps>`
  position: relative;

  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  border-radius: 50%;
  background-color: var(--primary-blue);

  ${p =>
    p.$canDownload &&
    css`
      &:hover {
        cursor: pointer;

        ${DocumentTypeIconWrapper} {
          display: none;
        }

        ${DownloadIconWrapper} {
          z-index: 1;

          animation: ${scaleIn} var(--transition-200);
        }
      }
    `}

  ${p =>
    p.$canDelete &&
    css`
      &:hover .workspace__DeleteButton--Root {
        opacity: 1;
        scale: 1;
      }
    `}

    ${p =>
    p.$downloading &&
    css`
      ${DocumentTypeIconWrapper} {
        display: none;
      }

      ${DownloadIconWrapper} {
        z-index: 1;

        opacity: 1;
        scale: 1;
      }
    `}
`;

const Content = styled.div<{ $hoverable: boolean }>`
  display: flex;
  flex-direction: column;

  font-size: 14px;
  line-height: 20px;

  ${TruncateMixin}

  ${p =>
    p.$hoverable &&
    css`
      &:hover {
        cursor: pointer;
      }
    `}
`;

const FileName = styled.p`
  font-weight: 500;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

const ImageDownloadButtonWrapper = styled.div<{ $visible?: boolean }>`
  position: absolute;
  top: 6px;
  right: 6px;

  width: 26px;
  height: 26px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  border-radius: 50%;
  background-color: var(--primary-statuses-white-0);
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;

  scale: ${p => (p.$visible ? 1 : 0)};
  opacity: ${p => (p.$visible ? 1 : 0)};
  transition: var(--transition-200);
`;

const ImageWrapper = styled.div`
  position: relative;

  display: flex;

  overflow: hidden;
  border-radius: var(--border-radius-element);

  &:hover {
    ${ImageDownloadButtonWrapper} {
      scale: 1;
      opacity: 1;
    }
  }
`;

const ImageSkeleton = styled.div<{ $width?: CSSProperties['width'] }>`
  height: 400px;
  width: ${p => p.$width};

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin};

  @media ${MediaBreakpoints.SM} {
    height: 200px;
    max-width: 100%;
  }
`;

const Image = styled.img<{ $width?: CSSProperties['width'] }>`
  height: auto;
  min-width: 64px;
  max-width: ${p => p.$width};

  @media ${MediaBreakpoints.SM} {
    max-width: 100%;
  }
`;

interface Props {
  file: FileInfo | ChatMessageFile;
  downloadable?: boolean;
  alwaysLoadMedia?: boolean;
  mediaFileWidth?: CSSProperties['width'];
  onDelete?: () => void;
}

const ChatMessageFileBlock = (props: Props) => {
  const {
    file,
    downloadable = false,
    alwaysLoadMedia = false,
    mediaFileWidth = '100%',
    onDelete,
  } = props;

  const { t } = useTranslation();

  const [fileDownloading, setFileDownloading] = useState(false);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [previewOpened, { open: openPreview, close: closePreview }] = useDisclosure(false);

  const { ref, inViewport } = useInViewport();

  const isMedia = useMemo<boolean>(
    () => file.fileType.includes('image') || file.fileType.includes('video'),
    [file.fileType]
  );

  const isDisplayableMedia = useMemo<boolean>(
    () => file.fileType.includes('image') || file.fileType.includes('audio'),
    [file.fileType]
  );

  const { data: mediaObjectUrl, isError: mediaError } = useGetMediaBlobObjectUrl({
    downloadUrl: file.downloadUrl,
    enabled: alwaysLoadMedia ? isDisplayableMedia : inViewport && isDisplayableMedia,
  });

  const canDelete = Boolean(onDelete);

  const handleDownload = useCallback(async (): Promise<void> => {
    try {
      setFileDownloading(true);

      await FileUtil.downloadFile({ url: file.downloadUrl, fileName: file.fileName });
    } finally {
      setFileDownloading(false);
    }
  }, [file.downloadUrl, file.fileName]);

  const { isPdf, isVideo, canPreview } = useMemo(() => {
    const isPdf = isFileTypePdf(file.fileType);
    const isVideo = isFileTypeVideo(file.fileType);

    return {
      isPdf,
      isVideo,
      canPreview: isPdf || isVideo,
    };
  }, [file.fileType]);

  // likely audio message or an audio file –> we need to be able to listen it via player if possible (no error occurred)
  if (file.fileType.includes('audio')) {
    if (mediaObjectUrl) getBlobDuration(mediaObjectUrl).then(dur => setAudioDuration(dur));

    const downloadProps: PlayerDownloadProps = {
      canDownload: downloadable,
      getFileName: () => file.downloadUrl,
    };

    if (mediaObjectUrl && audioDuration && !mediaError) {
      return (
        <Player
          width={mediaFileWidth}
          duration={audioDuration}
          displayDurationBeforePlay
          recordUrl={mediaObjectUrl}
          downloadProps={downloadProps}
        />
      );
    } else if (!mediaError) {
      return <PlayerSkeleton ref={ref} width={mediaFileWidth} />;
    }
  }

  // likely an image media file -> we need to display it's preview if possible (no error occurred)
  if (file.fileType.includes('image')) {
    if (mediaObjectUrl && !mediaError) {
      return (
        <ImageWrapper>
          <Image
            src={mediaObjectUrl}
            $width={mediaFileWidth}
            alt={`${envUtil.appName} – ${file.fileName}`}
          />

          {downloadable && (
            <ImageDownloadButtonWrapper $visible={fileDownloading}>
              <DownloadButton
                loading={fileDownloading}
                loaderColor="var(--primary-statuses-green-520)"
                onClick={handleDownload}
              />
            </ImageDownloadButtonWrapper>
          )}
        </ImageWrapper>
      );
    } else if (!mediaError) {
      return <ImageSkeleton ref={ref} $width={mediaFileWidth} title={t('loading_title')} />;
    }
  }

  return (
    <>
      {file.downloadUrl && previewOpened && (
        <>
          {isPdf && (
            <PdfViewerModal
              opened={previewOpened}
              fileName={file.fileName}
              fileUrl={file.downloadUrl}
              onClose={closePreview}
            />
          )}

          {isVideo && (
            <VideoPlayerModal
              opened={previewOpened}
              fileName={file.fileName}
              fileUrl={file.downloadUrl}
              onClose={closePreview}
            />
          )}
        </>
      )}

      <Root>
        <FileIconHelper
          $canDelete={canDelete}
          $canDownload={downloadable}
          $downloading={fileDownloading}
        >
          <DocumentTypeIconWrapper>
            {isMedia ? <ImageIcon /> : <DocumentIcon />}
          </DocumentTypeIconWrapper>

          {downloadable && (
            <DownloadIconWrapper onClick={handleDownload}>
              {fileDownloading ? <MiniLoader /> : <DownloadIcon />}
            </DownloadIconWrapper>
          )}
        </FileIconHelper>

        <Content $hoverable={canPreview} onClick={canPreview ? openPreview : undefined}>
          <FileName>{file.fileName}</FileName>

          <FileSize $minWidth="fit-content" $size={file.fileSize} />
        </Content>

        {canDelete && <DeleteButton onClick={onDelete} />}
      </Root>
    </>
  );
};

export { ChatMessageFileBlock };
