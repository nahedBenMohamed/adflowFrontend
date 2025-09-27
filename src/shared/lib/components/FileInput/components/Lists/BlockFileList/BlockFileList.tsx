import type { FileLink } from '../../../../../models';
import { BlockFileItem } from '../../BlockFileItem/BlockFileItem';
import { BlockFileListRoot } from '../../BlockFileListRoot/BlockFileListRoot';

interface Props {
  fileLinks: FileLink[];
  canDelete?: boolean;
  onDelete: (fileLink: FileLink) => void;
}

const BlockFileList = (props: Props) => {
  const { fileLinks, canDelete = true, onDelete } = props;

  return (
    <BlockFileListRoot>
      {fileLinks.map(fileLink => (
        <BlockFileItem
          key={fileLink.id}
          file={fileLink.fileInfo}
          canDelete={canDelete}
          onDelete={() => onDelete(fileLink)}
        />
      ))}
    </BlockFileListRoot>
  );
};

export { BlockFileList };
