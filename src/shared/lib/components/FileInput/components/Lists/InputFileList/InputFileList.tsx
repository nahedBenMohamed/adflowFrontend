import { FileModel, type FileInfo } from '../../../../../models';
import { FileItem } from '../../FileItem/FileItem';
import { FileListWrapper } from '../../FileListWrapper/FileListWrapper';

interface Props {
  files: FileInfo[] | FileModel[];
  collapsing?: boolean;
  onDelete: (fileId: string) => void;
}

const InputFileList = (props: Props) => {
  const { files, collapsing, onDelete } = props;

  return (
    <FileListWrapper>
      {files.map((f, idx) => {
        if (f instanceof FileModel) {
          return (
            <FileItem key={idx} file={f} collapsing={collapsing} onDelete={() => onDelete(f.id)} />
          );
        } else {
          return (
            <FileItem
              key={idx}
              file={f}
              collapsing={collapsing}
              onDelete={() => onDelete(f.fileId)}
            />
          );
        }
      })}
    </FileListWrapper>
  );
};

export { InputFileList };
