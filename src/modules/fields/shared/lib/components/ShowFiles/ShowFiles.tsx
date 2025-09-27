import type { CardFilesStore } from '@/modules/card';
import { EmptyTableBlock, FileInput, FileItem, useUploadFiles } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

interface FileListProps {
  $hasLinks?: boolean;
  $scrollbarBorderColor: CSSProperties['borderColor'];
}

const FileList = styled.div<FileListProps>`
  max-height: 260px;

  display: flex;
  flex-direction: column;

  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #aab7d442;

    border-radius: 8px;
    border: none;
    border: 4px solid;
    border-color: ${p => p.$scrollbarBorderColor || 'var(--graphite-graphite-20)'};

    transition: var(--transition-200);

    &:hover {
      background: #aab7d45f;
    }
  }

  ${p =>
    p.$hasLinks &&
    css`
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid var(--graphite-graphite-80);
    `}
`;

interface Props {
  filesStore: CardFilesStore;
  readonly?: boolean;
}

const ShowFiles = observer((props: Props) => {
  const { filesStore, readonly } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields.components.show_files',
  });

  const {
    uploadedFiles,
    areFilesLoading,
    errorMessages,
    deleteUploadedFile,
    handleFileEvent,
    resetUploadedFiles,
  } = useUploadFiles();

  const addUploadedFiles = useCallback(async (): Promise<void> => {
    await filesStore.addFiles(uploadedFiles.map<string>(f => f.fileId));

    resetUploadedFiles();
  }, [filesStore, uploadedFiles, resetUploadedFiles]);

  useEffect(() => {
    if (uploadedFiles && uploadedFiles.length > 0) addUploadedFiles();
  }, [uploadedFiles, addUploadedFiles]);

  const hasLinks = filesStore.fileLinks.length > 0;

  if (readonly && !hasLinks) return <EmptyTableBlock $height="80px">{t('empty')}</EmptyTableBlock>;

  return (
    <div>
      {!readonly && (
        <FileInput
          showFiles={false}
          margin="0 12px 0 0"
          title={t('attach')}
          hasActiveView={false}
          files={uploadedFiles}
          errors={errorMessages}
          loading={areFilesLoading}
          onChange={handleFileEvent}
          onDelete={deleteUploadedFile}
        />
      )}

      <FileList $hasLinks={hasLinks} $scrollbarBorderColor="var(--primary-statuses-white-0)">
        {filesStore.fileLinks.map(fl => (
          <FileItem
            key={fl.id}
            file={fl.fileInfo}
            onDelete={readonly ? null : () => filesStore.deleteFileLink(fl.id)}
          />
        ))}
      </FileList>
    </div>
  );
});

ShowFiles.displayName = 'ShowFiles';
export { ShowFiles };
