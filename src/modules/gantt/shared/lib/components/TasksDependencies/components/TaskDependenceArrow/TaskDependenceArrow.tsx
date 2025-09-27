import { observer } from 'mobx-react-lite';
import { useGanttContext } from '../../../../../../context';
import type { Dependence } from '../../../../models';
import type { DependenceType } from '../../../../types';

const spaceX = 10;
const spaceY = 10;

interface Props {
  dependence: Dependence;
}

interface ArrowBreakPoint {
  x: number;
  y: number;
}

const getPoints = (
  from: ArrowBreakPoint,
  to: ArrowBreakPoint,
  type: DependenceType
): ArrowBreakPoint[] => {
  const { x: fromX, y: fromY } = from;
  const { x: toX, y: toY } = to;

  const sameSide = type === 'finish_finish' || type === 'start_start';

  if (sameSide) {
    if (type === 'start_start') {
      return [
        { x: Math.min(fromX - spaceX, toX - spaceX), y: fromY },
        { x: Math.min(fromX - spaceX, toX - spaceX), y: toY },
      ];
    }

    return [
      { x: Math.max(fromX + spaceX, toX + spaceX), y: fromY },
      { x: Math.max(fromX + spaceX, toX + spaceX), y: toY },
    ];
  }

  return [
    { x: type === 'finish_start' ? fromX + spaceX : fromX - spaceX, y: fromY },
    {
      x: type === 'finish_start' ? fromX + spaceX : fromX - spaceX,
      y: toY - spaceY * 2.25,
    },
    {
      x: type === 'finish_start' ? toX - spaceX : toX + spaceX,
      y: toY - spaceY * 2.25,
    },
    { x: type === 'finish_start' ? toX - spaceX : toX + spaceX, y: toY },
  ];
};

const TaskDependenceArrow = observer((props: Props) => {
  const {
    dependence: { from, to, type, color = 'var(--graphite-graphite-80)' },
  } = props;

  const { store, barHeight } = useGanttContext();

  const barList = store.barList;

  const fromBar = barList.find(b => b.record.id === Number(from));
  const toBar = barList.find(b => b.record.id === Number(to));

  if (!fromBar || !toBar) return null;

  const posY = barHeight / 2;

  const [start, end] = (() => [
    {
      x:
        type === 'finish_finish' || type === 'finish_start'
          ? fromBar.translateX + fromBar.width
          : fromBar.translateX,
      y: fromBar.translateY + posY,
    },
    {
      x:
        type === 'finish_finish' || type === 'start_finish'
          ? toBar.translateX + toBar.width
          : toBar.translateX,
      y: toBar.translateY + posY,
    },
  ])();

  const points = [...getPoints(start, end, type), end];
  const endPosition = type === 'start_finish' || type === 'finish_finish' ? -1 : 1;

  return (
    <g stroke={color}>
      <path
        fill="none"
        strokeWidth={1}
        style={{ stroke: color }}
        d={`
          M${start.x},${start.y}
          ${points.map(point => `L${point.x},${point.y}`).join('\n')}
          L${end.x},${end.y}
          `}
      />
      <path
        name="arrow"
        fill={color}
        strokeWidth={1}
        d={`
        M${end.x},${end.y} 
        L${end.x - 4 * endPosition},${end.y - 3 * endPosition} 
        L${end.x - 4 * endPosition},${end.y + 3 * endPosition} 
        Z`}
      />
    </g>
  );
});

TaskDependenceArrow.displayName = 'TaskDependenceArrow';
export { TaskDependenceArrow };
