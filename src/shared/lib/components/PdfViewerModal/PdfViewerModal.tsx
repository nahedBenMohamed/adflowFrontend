import { Viewer, Worker, type RenderError } from '@react-pdf-viewer/core';
import { useCallback, useMemo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TokenUtil } from '../../utils';
import { WholePageLoaderWithLogo } from '../Loaders/WholePageLoaderWithLogo/WholePageLoaderWithLogo';
import { DialogModalSecondary } from '../Modals/Dialog/DialogModalSecondary/DialogModalSecondary';
import { SpanWithEllipsis } from '../SpanWithEllipsis/SpanWithEllipsis';

const Root = styled.div`
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

const WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// https://github.com/mozilla/pdf.js/issues/3768#issuecomment-36468349
// "TT: undefined function"
const PdfViewerModal = (props: Props) => {
  const { opened, fileUrl, fileName, onClose } = props;

  const { t } = useTranslation();

  const httpsHeaders = useMemo<Record<string, string | string[]>>(
    () => ({
      'Content-Type': 'application/pdf',
      'X-Api-Key': import.meta.env.VITE_BASE_API_KEY,
      Authorization: `Bearer ${TokenUtil.getLocalToken()}`,
    }),
    []
  );

  const renderLoader = useCallback(
    (): ReactElement => <WholePageLoaderWithLogo height="500px" />,
    []
  );

  const renderError = useCallback<RenderError>(e => <ErrorMessage>{e.message}</ErrorMessage>, []);

  return (
    <DialogModalSecondary
      hideCancel
      width="100%"
      hideControls
      height="100%"
      maxWidth="920px"
      maxHeight="1000px"
      isOpened={opened}
      Header={<SpanWithEllipsis text={t('view_document', { document: fileName })} />}
      onClose={onClose}
    >
      <Root>
        <Worker workerUrl={WORKER_URL}>
          <Viewer
            fileUrl={fileUrl}
            enableSmoothScroll
            httpHeaders={httpsHeaders}
            renderError={renderError}
            renderLoader={renderLoader}
          />
        </Worker>
      </Root>
    </DialogModalSecondary>
  );
};

export { PdfViewerModal };
