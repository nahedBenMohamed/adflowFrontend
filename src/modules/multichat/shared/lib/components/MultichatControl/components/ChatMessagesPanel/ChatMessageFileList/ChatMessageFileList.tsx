import type { FileInfo } from '@/shared';
import { useCallback, type CSSProperties } from 'react';
import styled from 'styled-components';
import { ChatMessageFile } from '../../../../../models';
import { ChatMessageFileBlock } from '../ChatMessageFileBlock/ChatMessageFileBlock';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  padding-top: 8px;
`;

interface Props {
  files: FileInfo[] | ChatMessageFile[];
  alwaysLoadMedia?: boolean;
  canDownloadFiles?: boolean;
  mediaFileWidth?: CSSProperties['width'];
  onFileDelete?: (fileId: string) => void;
}

const ChatMessageFileList = (props: Props) => {
  const { files, alwaysLoadMedia, canDownloadFiles, mediaFileWidth, onFileDelete } = props;

  const getFileDeleteFunction = useCallback(
    (fileId: string) => () => onFileDelete?.(fileId),
    [onFileDelete]
  );

  return (
    <Root>
      {files.map(f => (
        <ChatMessageFileBlock
          key={f.fileId}
          file={f}
          mediaFileWidth={mediaFileWidth}
          downloadable={canDownloadFiles}
          alwaysLoadMedia={alwaysLoadMedia}
          onDelete={f instanceof ChatMessageFile ? undefined : getFileDeleteFunction(f.fileId)}
        />
      ))}
    </Root>
  );
};

export { ChatMessageFileList };
