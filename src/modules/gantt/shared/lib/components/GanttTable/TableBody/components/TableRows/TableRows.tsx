import { LoadMoreArrowIcon } from '@/modules/tasks';
import { MiniLoader } from '@/shared';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { useGanttContext } from '../../../../../../../context';
import { TOP_PADDING } from '../../../../../models';
import { TableCell } from './components';

interface RowProps {
  $height: number;
  $top: number;
}

const Row = styled.div<RowProps>`
  position: absolute;
  top: ${p => p.$top}px;

  width: 100%;
  height: ${p => p.$height}px;

  display: flex;
  align-items: center;
`;

const LoadMoreButton = styled.button`
  position: absolute;
  bottom: 8px;
  right: 8px;

  width: 32px;
  height: 32px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  border-radius: 50%;
  background-color: var(--button-text-green-default);
  transition: var(--transition-200);

  svg {
    transform: rotate(90deg);
  }

  &:hover {
    cursor: pointer;

    background-color: var(--button-text-green-hover);
  }

  &:active {
    background-color: var(--button-text-green-active);
  }

  &:disabled {
    pointer-events: none;
  }
`;

const TableRows = observer(() => {
  const { store, isLoadingMore, canLoadMore, loadMore } = useGanttContext();
  const { rowHeight, barList } = store;

  const { count, start } = store.getVisibleRows;

  if (barList.length === 0) return null;

  return (
    <>
      {barList.slice(start, start + count).map((b, rowIndex) => {
        return (
          <Row key={b.key} $height={rowHeight} $top={(rowIndex + start) * rowHeight + TOP_PADDING}>
            <TableCell bar={b} />
          </Row>
        );
      })}

      {canLoadMore && (
        <LoadMoreButton type="button" disabled={isLoadingMore} onClick={loadMore}>
          {isLoadingMore ? (
            <MiniLoader color="var(--primary-statuses-white-0)" />
          ) : (
            <LoadMoreArrowIcon />
          )}
        </LoadMoreButton>
      )}
    </>
  );
});

TableRows.displayName = 'TableRows';
export { TableRows };
