import { observer } from 'mobx-react-lite';
import { FileLink, FileModel, type FileInfo } from '../../../../../models';
import { BlockFileItem } from '../../BlockFileItem/BlockFileItem';
import { BlockFileListRoot } from '../../BlockFileListRoot/BlockFileListRoot';

export interface FileItemModel {
  onDelete: () => void;
  file: FileLink | FileInfo | FileModel;
}

interface Props {
  fileItems: FileItemModel[];
}

const MixedFileList = observer((props: Props) => {
  const { fileItems } = props;

  return (
    <BlockFileListRoot>
      {fileItems.map(fileItem => {
        if (fileItem.file instanceof FileLink) {
          return (
            <BlockFileItem
              key={fileItem.file.id}
              file={fileItem.file.fileInfo}
              onDelete={fileItem.onDelete}
            />
          );
        }

        if (fileItem.file instanceof FileModel) {
          return (
            <BlockFileItem
              key={fileItem.file.id}
              file={fileItem.file}
              onDelete={fileItem.onDelete}
            />
          );
        }

        return (
          <BlockFileItem
            key={fileItem.file.fileId}
            file={fileItem.file}
            onDelete={fileItem.onDelete}
          />
        );
      })}
    </BlockFileListRoot>
  );
});

MixedFileList.displayName = 'MixedFileList';
export { MixedFileList };
