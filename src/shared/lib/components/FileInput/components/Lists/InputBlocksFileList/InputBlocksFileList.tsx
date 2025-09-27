import styled from 'styled-components';
import { FileModel, type FileInfo } from '../../../../../models';
import { BlockFileItem } from '../../BlockFileItem/BlockFileItem';

const Root = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

interface Props {
  onDelete: (fileId: string) => void;
  fileInfos: FileInfo[] | FileModel[];
}

const InputBlockFileList = (props: Props) => {
  const { onDelete, fileInfos } = props;

  return (
    <Root>
      {fileInfos.map(file => {
        if (file instanceof FileModel) {
          return (
            <BlockFileItem
              key={file.id}
              file={file}
              onDelete={() => {
                onDelete(file.id);
              }}
            />
          );
        } else {
          return (
            <BlockFileItem
              key={file.fileId}
              file={file}
              onDelete={() => {
                onDelete(file.fileId);
              }}
            />
          );
        }
      })}
    </Root>
  );
};

export { InputBlockFileList };
