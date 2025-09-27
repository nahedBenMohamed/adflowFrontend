import { MyCheckbox, SpanWithEllipsis, TruncateMixin } from '@/shared';
import type { Table } from '@tanstack/react-table';
import styled from 'styled-components';

const ColumnsVisibilityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 4px));
  column-gap: 8px;
  row-gap: 12px;
`;

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

interface Props<T> {
  table: Table<T>;
  hideIds?: string[];
}

const ColumnsVisibilitySettingsGrid = <T extends unknown>(props: Props<T>) => {
  const { table, hideIds } = props;

  const leafColumns = table.getAllLeafColumns();
  const filteredLeafColumns = hideIds
    ? leafColumns.filter(c => !hideIds.includes(c.id))
    : leafColumns;

  return (
    <ColumnsVisibilityGrid>
      {filteredLeafColumns.map(lc => (
        <CheckboxWrapper key={lc.id}>
          <MyCheckbox checked={lc.getIsVisible()} onChange={lc.getToggleVisibilityHandler()} />
          <SpanWithEllipsis text={lc.columnDef.header?.toString() || lc.id} />
        </CheckboxWrapper>
      ))}
    </ColumnsVisibilityGrid>
  );
};

export { ColumnsVisibilitySettingsGrid };
