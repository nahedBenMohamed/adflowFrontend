import type { FileLink } from '../../../../../models';
import type { Nullable } from '../../../../../types';
import { FileItem } from '../../FileItem/FileItem';
import { FileListWrapper } from '../../FileListWrapper/FileListWrapper';

interface Props {
  onDelete: Nullable<(fileLink: FileLink) => void>;
  fileLinks: FileLink[];
}

const CommonFileList = (props: Props) => {
  const { onDelete, fileLinks } = props;

  return (
    <FileListWrapper>
      {fileLinks.map(fileLink => (
        <FileItem
          key={fileLink.id}
          file={fileLink.fileInfo}
          onDelete={onDelete ? () => onDelete(fileLink) : null}
        />
      ))}
    </FileListWrapper>
  );
};

export { CommonFileList };
