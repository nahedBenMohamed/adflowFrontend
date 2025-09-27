import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { calculateEndOfWordIdxByNumber } from '../../../../helpers';
import { FileInfo, FileModel } from '../../../../models';
import { FileItem } from '../FileItem/FileItem';

const Root = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

interface Props {
  files: FileInfo[] | FileModel[];
  onDelete: (fileId: string) => void;
}

const CompactFileList = (props: Props) => {
  const { files, onDelete } = props;

  const { t } = useTranslation('common');

  if (files.length === 1 && files[0] && files[0] instanceof FileModel)
    return (
      <FileItem collapsing file={files[0]} onDelete={() => onDelete((files[0] as FileModel).id)} />
    );

  if (files.length === 1 && files[0] && files[0] instanceof FileInfo)
    return (
      <FileItem
        collapsing
        file={files[0]}
        onDelete={() => onDelete((files[0] as FileInfo).fileId)}
      />
    );

  const idx = calculateEndOfWordIdxByNumber(files.length);

  return <Root>{t(`files_count.${idx}`, { count: files.length })}</Root>;
};

export { CompactFileList };
