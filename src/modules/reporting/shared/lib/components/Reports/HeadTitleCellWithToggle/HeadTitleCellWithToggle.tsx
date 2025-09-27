import type { Table } from '@tanstack/react-table';
import styled from 'styled-components';
import { ArrowToggleIcon } from '../../../../assets';
import type { ReportSyntheticRow } from '../../../types';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ToggleExpandedIconWrapper = styled.button<{ $expanded: boolean }>`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  transform: rotate(${p => (p.$expanded ? 0 : -90)}deg);
  transition: var(--transition-200);

  svg path {
    fill: var(--button-text-graphite-primary-text);
  }

  &:hover {
    cursor: pointer;
  }
`;

interface Props<R> {
  title: string;
  table: Table<R>;
}

const HeadTitleCellWithToggle = <R extends ReportSyntheticRow<unknown>>(props: Props<R>) => {
  const { title, table } = props;

  const canExpand = table.getCanSomeRowsExpand();
  const isExpanded = table.getIsAllRowsExpanded();

  return (
    <Root>
      {canExpand && (
        <ToggleExpandedIconWrapper
          $expanded={isExpanded}
          onClick={table.getToggleAllRowsExpandedHandler()}
        >
          <ArrowToggleIcon />
        </ToggleExpandedIconWrapper>
      )}
      {title}
    </Root>
  );
};

export { HeadTitleCellWithToggle };
