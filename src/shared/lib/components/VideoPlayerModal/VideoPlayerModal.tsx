import { useGetMediaBlobObjectUrl } from '@/shared';
import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player';
import styled from 'styled-components';
import { WholePageLoaderWithLogo } from '../Loaders/WholePageLoaderWithLogo/WholePageLoaderWithLogo';
import { DialogModalSecondary } from '../Modals/Dialog/DialogModalSecondary/DialogModalSecondary';
import { SpanWithEllipsis } from '../SpanWithEllipsis/SpanWithEllipsis';

const Root = styled.div`
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 24px 32px;
`;

const ErrorMessage = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
  color: var(--button-text-red-default);
`;

interface Props {
  opened: boolean;
  fileUrl: string;
  fileName: string;
  onClose: () => void;
}

const VideoPlayerModal = (props: Props) => {
  const { opened, fileUrl, fileName, onClose } = props;

  const { t } = useTranslation();

  const {
    data: objectUrl,
    isLoading,
    isError,
  } = useGetMediaBlobObjectUrl({
    downloadUrl: fileUrl,
    enabled: true,
  });

  return (
    <DialogModalSecondary
      hideCancel
      width="100%"
      hideControls
      height="100%"
      maxWidth="1200px"
      maxHeight="840px"
      isOpened={opened}
      contentHeight="100%"
      Header={<SpanWithEllipsis text={t('view_document', { document: fileName })} />}
      onClose={onClose}
    >
      <Root>
        {isLoading ? (
          <WholePageLoaderWithLogo height="100%" />
        ) : (
          objectUrl && <ReactPlayer url={objectUrl} controls playing height="auto" width="100%" />
        )}

        {isError && <ErrorMessage>{t('video_error')}</ErrorMessage>}
      </Root>
    </DialogModalSecondary>
  );
};

export { VideoPlayerModal };
