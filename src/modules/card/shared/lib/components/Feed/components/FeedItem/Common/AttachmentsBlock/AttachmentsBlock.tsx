import { FileFeedItem, MiniLoader, type FileLink } from '@/shared';
import { useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

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

const MiniLoaderWrapper = styled.div`
  position: relative;
`;

interface Props {
  fileLinks: FileLink[];
  margin?: CSSProperties['margin'];
  hasNotBackground?: boolean;
  onDelete?: (fileLink: FileLink) => void;
  handleDownloadFile?: ({ url, fileName }: { url: string; fileName: string }) => Promise<void>;
}

const AttachmentsBlock = (props: Props) => {
  const { fileLinks, margin, hasNotBackground, onDelete, handleDownloadFile } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed.files_block',
  });

  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const handleDownloadAll = async (): Promise<void> => {
    if (!handleDownloadFile) return;

    try {
      setIsDownloadingAll(true);

      await Promise.all(
        fileLinks.map(fl =>
          handleDownloadFile({ url: fl.fileInfo.downloadUrl, fileName: fl.fileInfo.fileName })
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
              <MiniLoaderWrapper>
                <MiniLoader size="small" />
              </MiniLoaderWrapper>
            ) : (
              <AttachmentsTitle onClick={handleDownloadAll} $clickable>
                {t('download_all')}
              </AttachmentsTitle>
            )}
          </>
        )}
      </Header>

      <AttachmentListWrapper>
        {fileLinks.map(l => (
          <FileFeedItem
            key={l.id}
            file={l.fileInfo}
            hasNotBackground={hasNotBackground}
            onDelete={() => onDelete?.(l)}
          />
        ))}
      </AttachmentListWrapper>
    </Root>
  );
};

export { AttachmentsBlock };
