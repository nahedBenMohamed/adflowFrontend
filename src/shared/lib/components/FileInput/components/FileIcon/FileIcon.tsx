import { memo } from 'react';
import styled from 'styled-components';
import {
  FileAudioIcon,
  FileDocumentIcon,
  FileImageIcon,
  FileVideoIcon,
} from '../../../../../assets';

const Root = styled.div`
  width: 20px;

  display: flex;
  align-items: center;
  flex-shrink: 0;

  margin-right: 5px;

  &:hover {
    cursor: pointer;
  }
`;

interface Props {
  type: string;
  onClick: () => void;
}

const FileIcon = memo((props: Props) => {
  const { type, onClick } = props;

  const getIcon = () => {
    if (type.includes('image')) {
      return <FileImageIcon />;
    }

    if (type.includes('video')) {
      return <FileVideoIcon />;
    }

    if (type.includes('audio')) {
      return <FileAudioIcon />;
    }

    return <FileDocumentIcon />;
  };

  return <Root onClick={onClick}>{getIcon()}</Root>;
});

FileIcon.displayName = 'FileIcon';
export { FileIcon };
