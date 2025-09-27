import { useGetFileInfos } from '@/app';
import { type FileInfo, FileInput, useUploadFiles } from '@/shared';
import { observer } from 'mobx-react-lite';
import { type ChangeEvent, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { FieldValueBaseProps, FileFieldValue } from '../../../models';
import { FieldValueTemplate } from '../FieldValueTemplate';

interface Props extends FieldValueBaseProps<FileFieldValue> {
  title?: string;
}

const FileFieldValueComp = observer((props: Props) => {
  const {
    title,
    readonly,
    tableView,
    fieldValue,
    fieldSettings,
    alwaysHideIndicator,
    rightIndicatorOnMobile,
    onChange,
  } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields.components.file_field_value_comp',
  });

  const { data: fileInfos, isLoading: areFileInfosLoading } = useGetFileInfos(fieldValue.fileIds);

  const { uploadedFiles, areFilesLoading, handleFileEvent, resetUploadedFiles } = useUploadFiles();

  const handleChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      await handleFileEvent(e);

      onChange?.(fieldValue);
    },
    [fieldValue, handleFileEvent, onChange]
  );

  const handleDeleteFile = useCallback(
    (fileId: string) => {
      fieldValue.removeFile(fileId);
    },
    [fieldValue]
  );

  useEffect(() => {
    if (uploadedFiles.length) {
      fieldValue.addFiles(uploadedFiles.map(f => f.fileId));

      resetUploadedFiles();
    }
  }, [fieldValue, uploadedFiles, resetUploadedFiles]);

  const files = useMemo<FileInfo[]>(
    () =>
      fileInfos.reduce<FileInfo[]>((acc, cur) => {
        if (!cur || !cur.fileId) return acc;

        if (!fieldValue.fileIds.includes(cur.fileId)) return acc;

        acc.push(cur);

        return acc;
      }, []),
    [fieldValue.fileIds, fileInfos]
  );

  return (
    <FieldValueTemplate
      title={title}
      readonly={readonly}
      tableView={tableView}
      settings={fieldSettings}
      filled={fieldValue.filled()}
      alwaysHideIndicator={alwaysHideIndicator}
      rightIndicatorOnMobile={rightIndicatorOnMobile}
    >
      <FileInput
        collapsing
        files={files}
        as="add-button"
        compact={tableView}
        hasDelimiter={false}
        loading={areFilesLoading || areFileInfosLoading}
        title={t('attach_files')}
        onChange={handleChange}
        onDelete={handleDeleteFile}
      />
    </FieldValueTemplate>
  );
});

FileFieldValueComp.displayName = 'FileFieldValueComp';
export { FileFieldValueComp };
