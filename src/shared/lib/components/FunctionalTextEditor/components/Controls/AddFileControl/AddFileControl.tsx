import type { ChangeEvent } from 'react';
import type { FileInfo, FileModel } from '../../../../../models';
import type { Nullable } from '../../../../../types';
import { FileInput } from '../../../../FileInput/FileInput';

interface Props {
  files: FileInfo[] | FileModel[];
  fileErrors: Nullable<string[]>;
  filesLoading: boolean;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFileDelete: (fileId: string) => void;
}

const AddFileControl = (props: Props) => {
  const { files, fileErrors, filesLoading, onFileChange, onFileDelete } = props;

  return (
    <FileInput
      as="icon-small"
      showFiles={false}
      files={files}
      errors={fileErrors}
      loading={filesLoading}
      onDelete={onFileDelete}
      onChange={onFileChange}
    />
  );
};

export { AddFileControl };
