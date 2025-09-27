import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import styled from 'styled-components';
import { useGanttContext } from '../../../../context';

interface RootProps {
  $top: number;
  $height: number;
}

const Root = styled.div<RootProps>`
  position: absolute;
  top: ${p => p.$top}px;

  width: 100%;
  height: ${p => p.$height}px;

  z-index: 10;
  pointer-events: none;

  // --primary-statuses-green-520 with 5% opacity
  background: rgba(104, 210, 34, 0.05);
`;

const RowSelectionIndicator = observer(() => {
  const {
    store: {
      showSelectionIndicator,
      selectionIndicatorTop,
      rowHeight,
      canCreateRecordFromCurrentSelection,
      setChartCursor,
    },
  } = useGanttContext();

  useEffect(() => {
    if (canCreateRecordFromCurrentSelection) {
      setChartCursor('pointer');
    } else {
      setChartCursor('default');
    }

    return () => setChartCursor('default');
  }, [canCreateRecordFromCurrentSelection, setChartCursor]);

  return showSelectionIndicator ? <Root $height={rowHeight} $top={selectionIndicatorTop} /> : null;
});

RowSelectionIndicator.displayName = 'RowSelectionIndicator';
export { RowSelectionIndicator };
