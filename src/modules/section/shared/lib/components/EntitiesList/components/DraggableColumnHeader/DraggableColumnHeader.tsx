import { NoSelectMixin } from '@/shared';
import {
  flexRender,
  type Column,
  type ColumnOrderState,
  type ColumnResizeMode,
  type Header,
  type Table,
} from '@tanstack/react-table';
import { useEffect, useMemo, type CSSProperties } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import styled, { css } from 'styled-components';
import { DragIndicator } from '../../../../../assets';

const Resizer = styled.div<{ $resizing: boolean }>`
  cursor: col-resize;

  position: absolute;
  right: 0;
  bottom: 0;

  width: 5px;
  height: 24px;

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

interface RootProps {
  $resizing: boolean;
  $dragging: boolean;
}

const Root = styled.div<RootProps>`
  position: relative;

  height: 24px;

  display: flex;
  align-items: center;

  font-weight: 600;
  font-size: 10px;
  line-height: 12px;
  text-transform: uppercase;
  color: var(--button-text-graphite-secondary-text);

  white-space: nowrap;
  overflow: hidden;

  padding-bottom: 4px;
  opacity: ${p => (p.$dragging ? 0.5 : 1)};
  transition: opacity var(--transition-200);

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

const DragIndicatorWrapper = styled.button`
  width: 12px;
  height: 12px;

  cursor: grab;
`;

const HeaderWrapper = styled.div<{ $width: number }>`
  width: ${p => p.$width}px;

  display: flex;
  align-items: center;
  gap: 2px;
`;

const reorderColumn = (
  draggedColumnId: string,
  targetColumnId: string,
  columnOrder: string[]
): ColumnOrderState => {
  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string
  );

  return [...columnOrder];
};

interface Props {
  header: Header<any, unknown>;
  table: Table<any>;
  columnResizeMode: ColumnResizeMode;
  setColumnOrderToLS: (columnOrder: ColumnOrderState) => void;
  saveColumnSize: ({ columnId, size }: { columnId: string; size: number }) => void;
}

const DraggableColumnHeader = (props: Props) => {
  const { header, table, columnResizeMode, setColumnOrderToLS, saveColumnSize } = props;

  const { getState, setColumnOrder } = table;
  const { columnOrder } = getState();
  const { column } = header;

  const [, dropRef] = useDrop({
    accept: 'column',
    drop: (draggedColumn: Column<any>) => {
      const newColumnOrder = reorderColumn(draggedColumn.id, column.id, columnOrder);
      setColumnOrder(newColumnOrder);
      setColumnOrderToLS(newColumnOrder);
    },
  });

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => column,
    type: 'column',
  });

  const resizing = header.column.getIsResizing();

  useEffect(() => {
    // make body cursor resize-col when resizing
    if (resizing) {
      document.body.classList.add('resize-col');
    } else {
      document.body.classList.remove('resize-col');
    }

    saveColumnSize({ columnId: header.column.id, size: header.getSize() });
  }, [resizing, header, saveColumnSize]);

  const resizerStyles = useMemo<CSSProperties>(
    () => ({
      transform:
        columnResizeMode === 'onEnd' && header.column.getIsResizing()
          ? `translateX(${table.getState().columnSizingInfo.deltaOffset}px)`
          : '',
    }),
    [columnResizeMode, header, table]
  );

  const isCheckbox = header.column.id === 'checkbox';

  return (
    <Root
      ref={node => {
        if (!isCheckbox && node) dropRef(node);
      }}
      $resizing={resizing}
      $dragging={isDragging}
    >
      <HeaderWrapper
        $width={header.getSize()}
        ref={node => {
          if (!isCheckbox && node) previewRef(node);
        }}
      >
        {!isCheckbox && (
          <DragIndicatorWrapper
            ref={node => {
              if (!isCheckbox && node) dragRef(node);
            }}
          >
            <DragIndicator />
          </DragIndicatorWrapper>
        )}

        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}

        {!isCheckbox && (
          <Resizer
            $resizing={resizing}
            style={resizerStyles}
            onMouseDown={header.getResizeHandler()}
            onTouchStart={header.getResizeHandler()}
          />
        )}
      </HeaderWrapper>
    </Root>
  );
};

export { DraggableColumnHeader };
