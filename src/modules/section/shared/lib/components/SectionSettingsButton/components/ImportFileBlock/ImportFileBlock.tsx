import { DeleteButton, FileSize, SpanWithEllipsis, TruncateMixin, UtcDate } from '@/shared';
import styled from 'styled-components';
import { ExcelIcon } from '../../../../../assets';

const Root = styled.div`
  height: 60px;

  display: flex;
  align-items: center;
  gap: 8px;

  padding: 8px;
  border-radius: var(--border-radius-element);
  border: 1px solid var(--primary-statuses-green-520);
`;

const IconWrapper = styled.div`
  width: 44px;
  height: 44px;
`;

const FileInfoWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 4px;

  ${TruncateMixin}
`;

const FileInfoHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const FileInfoBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const Date = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-secondary-text);
`;

interface Props {
  file: File;
  onDelete: () => void;
}

const ImportFileBlock = (props: Props) => {
  const { file, onDelete } = props;

  return (
    <Root>
      <IconWrapper>
        <ExcelIcon />
      </IconWrapper>

      <FileInfoWrapper>
        <FileInfoHeader>
          <SpanWithEllipsis text={file.name} />

          <DeleteButton onClick={onDelete} />
        </FileInfoHeader>

        <FileInfoBody>
          <FileSize $size={file.size} />
          <Date>{UtcDate.fromTimestamp(file.lastModified / 1000).displayLong()}</Date>
        </FileInfoBody>
      </FileInfoWrapper>
    </Root>
  );
};

export { ImportFileBlock };
