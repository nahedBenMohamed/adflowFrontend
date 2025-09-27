import {
  DeleteButton,
  DownloadButton,
  FileSize,
  PdfViewerModal,
  SpanWithEllipsis,
  getBlockFileItemIcon,
  isFileTypePdf,
  type FileLink,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useMemo, useState } from 'react';
import styled from 'styled-components';

const Root = styled.li`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 8px;

  padding: 8px;
  border-radius: var(--border-radius-element);
  border: 1px solid var(--graphite-graphite-80);
`;

const IconWrapper = styled.div`
  height: 32px;
  width: 32px;

  flex-shrink: 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
`;

const SectionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--black);
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Date = styled.span`
  color: var(--button-text-graphite-secondary-text);
`;

interface Props {
  document: FileLink;
  onDelete: () => Promise<void>;
  onDownload: () => Promise<void>;
}

const GeneratedDocumentItem = (props: Props) => {
  const {
    document: {
      fileInfo: { fileName, fileSize, createdAt, fileType, downloadUrl },
    },
    onDelete,
    onDownload,
  } = props;

  const [downloading, setDownloading] = useState(false);
  const [pdfViewerOpened, { open: openPdfViewer, close: closePdfViewer }] = useDisclosure(false);

  const handleDownload = async (): Promise<void> => {
    try {
      setDownloading(true);

      await onDownload();
    } finally {
      setDownloading(false);
    }
  };

  const isPdf = useMemo<boolean>(() => isFileTypePdf(fileType), [fileType]);

  return (
    <>
      {downloadUrl && pdfViewerOpened && (
        <PdfViewerModal
          fileName={fileName}
          fileUrl={downloadUrl}
          opened={pdfViewerOpened}
          onClose={closePdfViewer}
        />
      )}

      <Root>
        <IconWrapper>{getBlockFileItemIcon(fileType)}</IconWrapper>

        <Content>
          <SectionWrapper>
            <SpanWithEllipsis
              text={fileName}
              hoverable={isPdf}
              onClick={isPdf ? openPdfViewer : undefined}
            />

            <Controls>
              <DownloadButton loading={downloading} onClick={handleDownload} />
              <DeleteButton onClick={onDelete} />
            </Controls>
          </SectionWrapper>

          <SectionWrapper>
            <FileSize $size={fileSize} />
            <Date>{createdAt.displayLong()}</Date>
          </SectionWrapper>
        </Content>
      </Root>
    </>
  );
};

export { GeneratedDocumentItem };
