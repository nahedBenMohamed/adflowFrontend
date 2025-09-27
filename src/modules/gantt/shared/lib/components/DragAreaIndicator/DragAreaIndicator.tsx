import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { useGanttContext } from '../../../../context';

const Root = styled.g`
  fill: rgba(121, 171, 246, 0.08);
  stroke: var(--primary-blue);
`;

const Path = styled.path`
  stroke-width: 1;
  stroke-dasharray: 5, 5;
  stroke: var(--primary-blue);
`;

const Rect = styled.rect`
  stroke: none;
  stroke-width: 0;
`;

const DragAreaIndicator = observer(() => {
  const { store } = useGanttContext();

  const { draggingBar, draggingType, bodyScrollHeight } = store;

  if (!draggingBar) return null;

  const { width, translateX } = draggingBar;

  const left = translateX;
  const right = translateX + width;

  const leftLine = draggingType === 'left' || draggingType === 'move';
  const rightLine = draggingType === 'right' || draggingType === 'move';

  return (
    <Root>
      {leftLine && <Path d={`M${left},0 L${left},${bodyScrollHeight}`} />}

      <Rect x={left} y={0} width={width} height={bodyScrollHeight} />

      {rightLine && <Path d={`M${right},0 L${right},${bodyScrollHeight}`} />}
    </Root>
  );
});

DragAreaIndicator.displayName = 'DragAreaIndicator';
export { DragAreaIndicator };
