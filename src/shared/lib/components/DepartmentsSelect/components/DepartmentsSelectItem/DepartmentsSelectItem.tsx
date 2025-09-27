import type { Department } from '@/modules/settings';
import { GroupIcon, SpanWithEllipsis, SubgroupIcon, TruncateMixin } from '@/shared';
import { memo, useCallback } from 'react';
import styled from 'styled-components';
import { MultiselectCheckIcon } from '../../../Form/MultiselectWithCheckboxes/components';

const Root = styled.label<{ $subdepartment?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;

  padding: 8px;
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background-color: #f3fded;
  }

  ${p => p.$subdepartment && `padding-left: 24px`};
`;

const Title = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

export interface DepartmentsSelectItemProps {
  active: boolean;
  department: Department;
  includeArray?: number[];
  isSubdepartment?: boolean;
  onSelect: (id: number) => void;
  onCancel?: (id: number) => void;
}

const DepartmentsSelectItem = memo((props: DepartmentsSelectItemProps) => {
  const {
    active,
    department: { id, name },
    includeArray,
    isSubdepartment,
    onSelect,
    onCancel,
  } = props;

  const handleClick = useCallback(() => {
    if (active) {
      onCancel?.(id);
    } else {
      onSelect(id);
    }
  }, [id, active, onSelect, onCancel]);

  if (includeArray && includeArray.length > 0 && !includeArray.includes(id)) return null;

  return (
    <Root $subdepartment={isSubdepartment} onClick={handleClick}>
      <MultiselectCheckIcon visible={active} />

      {isSubdepartment ? <SubgroupIcon /> : <GroupIcon />}

      <Title>
        <SpanWithEllipsis text={name} />
      </Title>
    </Root>
  );
});

DepartmentsSelectItem.displayName = 'DepartmentsSelectItem';
export { DepartmentsSelectItem };
