import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState, type MouseEventHandler } from 'react';
import styled from 'styled-components';
import { useGanttContext } from '../../../../../context';
import { TableResizeEvent } from '../../../models';
import { ganttStorageService } from '../../../services';
import { EmptyTableBody, TableRows } from './components';

const Root = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  overflow: hidden;
  border-right: 1px solid var(--graphite-graphite-80);
`;

const ResizeHandler = styled.div`
  position: absolute;
  top: 0;
  right: 0;

  width: 10px;
  height: 100%;

  &:hover {
    cursor: col-resize;
  }
`;

const TableBody = observer(() => {
  const { store } = useGanttContext();

  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [isResizing, { open: startResizing, close: stopResizing }] = useDisclosure(false);

  const handleResizeMouseDown = useCallback<MouseEventHandler<HTMLDivElement>>(
    e => {
      startResizing();

      setStartX(e.clientX);
      setStartWidth(store.tableWidth);
    },
    [store.tableWidth, startResizing]
  );

  const handleResizeMouseMove = useCallback(
    (e: MouseEventInit) => {
      if (!isResizing) return;

      const deltaX = (e.clientX ?? 0) - startX;

      store.resizeTable(startWidth + deltaX);

      document.dispatchEvent(new TableResizeEvent());
    },
    [isResizing, startWidth, startX, store]
  );

  const handleResizeMouseMoveRoot = useCallback<MouseEventHandler<HTMLDivElement>>(
    e => store.handleMouseMove(e),
    [store]
  );

  const handleResizeMouseLeaveRoot = useCallback(() => store.handleMouseLeave(), [store]);

  useEffect(() => {
    if (isResizing) {
      const handleMouseUpDocument = () => {
        stopResizing();

        ganttStorageService.storeTableWidth(store.tableWidth);
      };

      const handleMouseMoveDocument = (e: MouseEventInit) => handleResizeMouseMove(e);

      document.addEventListener('mousemove', handleMouseMoveDocument);
      document.addEventListener('mouseup', handleMouseUpDocument);

      document.body.classList.add('resize-col');

      return () => {
        document.removeEventListener('mouseup', handleMouseUpDocument);

        document.removeEventListener('mousemove', handleMouseMoveDocument);
      };
    } else {
      document.body.classList.remove('resize-col');
    }
  }, [handleResizeMouseMove, isResizing, stopResizing, store.tableWidth]);

  const isEmpty = useMemo(() => store.barList.length === 0, [store.barList]);

  return (
    <Root
      onMouseMove={handleResizeMouseMoveRoot}
      onMouseLeave={handleResizeMouseLeaveRoot}
      style={{
        width: store.tableWidth,
        height: store.bodyScrollHeight,
      }}
    >
      {isEmpty ? <EmptyTableBody /> : <TableRows />}

      <ResizeHandler onMouseDown={handleResizeMouseDown} />
    </Root>
  );
});

TableBody.displayName = 'TableBody';
export { TableBody };
