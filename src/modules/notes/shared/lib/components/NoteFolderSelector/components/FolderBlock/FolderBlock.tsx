import { TruncateMixin } from '@/shared';
import { memo } from 'react';
import styled from 'styled-components';
import { FolderIcon } from '../../../../../assets';

const Root = styled.div<{ $active: boolean }>`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 12px 16px;
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background: var(--graphite-graphite-80);
  }

  ${p => p.$active && `background: var(--graphite-graphite-80)`};
`;

const Group = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;

const StyledFolderIcon = styled(FolderIcon)`
  width: 20px;
  height: 20px;

  flex-shrink: 0;
`;

const Name = styled.span`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--neutral-black-primary);

  ${TruncateMixin}
`;

const Count = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

interface Props {
  name: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

const FolderBlock = memo((props: Props) => {
  const { name, count, isActive, onClick } = props;

  return (
    <Root $active={isActive} onClick={onClick}>
      <Group>
        <StyledFolderIcon />

        <Name title={name}>{name}</Name>
      </Group>

      <Count>{count}</Count>
    </Root>
  );
});

FolderBlock.displayName = 'FolderBlock';
export { FolderBlock };
