import { NoSelectMixin, type Nullable } from '@/shared';
import { flexRender } from '@tanstack/react-table';
import type { ColumnResizeMode, Header } from '@tanstack/table-core';
import { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { TasksColumnsIds, type TaskRow } from '../../../../models';

const Resizer = styled.div<{ $resizing: boolean }>`
  cursor: col-resize;

  position: absolute;
  right: 0;
  bottom: 0;

  height: 24px;
  width: 5px;

  scale: 0;
  opacity: 0;
  touch-action: none;
  transform-origin: bottom;
  background: ${p =>
    p.$resizing ? 'var(--button-text-graphite-primary-text)' : 'var(--graphite-graphite-80)'};
  transition:
    opacity var(--transition-200),
    scale var(--transition-200),
    background-color var(--transition-200);

  ${NoSelectMixin}
`;

const THeadCell = styled.div<{ $resizing: boolean }>`
  position: relative;

  height: 24px;

  display: flex;
  align-items: center;

  font-weight: 600;
  font-size: 10px;
  line-height: 12px;
  text-transform: uppercase;
  color: var(--button-text-graphite-secondary-text);

  padding-bottom: 4px;

  white-space: nowrap;
  overflow: hidden;

  &:last-child {
    padding-right: 12px;
  }

  &:hover {
    ${Resizer} {
      scale: 1;
      opacity: 1;
    }
  }

  ${p =>
    p.$resizing &&
    css`
      ${Resizer} {
        scale: 1;
        opacity: 1;
        background-color: var(--button-text-graphite-primary-text);
      }
    `}
`;

interface Props {
  header: Header<TaskRow, unknown>;
  columnResizeMode: ColumnResizeMode;
  sizingDeltaOffset: Nullable<number>;
  saveColumnSize: ({ columnId, size }: { columnId: string; size: number }) => void;
}

const TasksTableHeadCell = (props: Props) => {
  const { header, columnResizeMode, sizingDeltaOffset, saveColumnSize } = props;

  const { id: columnId, column, isPlaceholder, getResizeHandler, getSize, getContext } = header;
  const resizing = header.column.getIsResizing();

  const deltaOffset = sizingDeltaOffset ? sizingDeltaOffset : 0;

  useEffect(() => {
    // make body cursor resize-col when resizing
    if (resizing) {
      document.body.classList.add('resize-col');
    } else {
      document.body.classList.remove('resize-col');
    }

    saveColumnSize({ columnId: header.column.id, size: header.getSize() });
  }, [resizing, header, saveColumnSize]);

  return (
    <THeadCell $resizing={resizing} style={{ width: getSize() }}>
      {isPlaceholder ? null : flexRender(column.columnDef.header, getContext())}

      {![TasksColumnsIds.CHECKBOX, TasksColumnsIds.DELETE].includes(
        columnId as TasksColumnsIds
      ) && (
        <Resizer
          $resizing={column.getIsResizing()}
          onMouseDown={getResizeHandler()}
          onTouchStart={getResizeHandler()}
          style={{
            transform:
              columnResizeMode === 'onEnd' && column.getIsResizing()
                ? `translateX(${deltaOffset}px)`
                : '',
          }}
        />
      )}
    </THeadCell>
  );
};

export { TasksTableHeadCell };
