import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, type MouseEventHandler } from 'react';
import styled from 'styled-components';
import { useGanttContext } from '../../../../context';
import { DragAreaIndicator } from '../DragAreaIndicator/DragAreaIndicator';
import { RecordsBarList } from '../RecordsBarList/RecordsBarList';
import { RecordsBarsThumbsList } from '../RecordsBarsThumbsList/RecordsBarsThumbsList';
import { TasksDependencies } from '../TasksDependencies/TasksDependencies';
import { TimeAxisTodayLine } from '../TimeAxis/TimeAxisTodayLine/TimeAxisTodayLine';

const Root = styled.div`
  position: absolute;
  top: 0;

  overflow-x: hidden;
  overflow-y: hidden;
`;

const ChartSvgRenderer = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
`;

const RenderChunk = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  will-change: transform;
`;

const WEEKDAY_PATTERN_ID = 'weekday-pattern';

const GanttChart = observer(() => {
  const { store } = useGanttContext();
  const {
    tableWidth,
    viewWidth,
    bodyScrollHeight,
    translateX,
    chartElementRef,
    minorAmpList: minorList,
    createRecord,
  } = store;

  const handleMouseMove = useCallback<MouseEventHandler<HTMLDivElement>>(
    e => store.handleMouseMove(e),
    [store]
  );

  const handleMouseLeave = useCallback(() => store.handleMouseLeave(), [store]);

  useEffect(() => {
    const element = chartElementRef.current;

    if (!element) return;

    element.addEventListener('wheel', store.handleWheel);

    return () => element.removeEventListener('wheel', store.handleWheel);
  }, [chartElementRef, store]);

  const handleCreateRecord = useCallback<MouseEventHandler>(
    async (e): Promise<void> => {
      const mouseX = e.clientX;

      await createRecord(mouseX);
    },
    [createRecord]
  );

  return (
    <Root
      id={store.GANTT_CHART_ID}
      ref={chartElementRef}
      style={{
        width: viewWidth,
        height: bodyScrollHeight,
        left: tableWidth,
      }}
      onClick={handleCreateRecord}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <ChartSvgRenderer
        version="1.1"
        style={{ width: viewWidth, height: bodyScrollHeight }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`${translateX} 0 ${viewWidth} ${bodyScrollHeight}`}
      >
        <defs>
          <pattern
            width={4.5}
            height={10}
            id={WEEKDAY_PATTERN_ID}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(70 50 50)"
          >
            <line stroke="var(--graphite-graphite-80)" strokeWidth={1} y2={10} />
          </pattern>
        </defs>

        {minorList.map(i =>
          i.isWeekend ? (
            <g key={i.key} stroke="var(--graphite-graphite-40)" strokeWidth={1}>
              <path d={`M${i.left},0 L${i.left},${bodyScrollHeight}`} />

              <rect
                y={0}
                x={i.left}
                strokeWidth={0}
                width={i.width}
                height={bodyScrollHeight}
                fill={`url(#${WEEKDAY_PATTERN_ID})`}
              />
            </g>
          ) : (
            <g key={i.key} stroke="var(--graphite-graphite-40)" strokeWidth={1}>
              <path d={`M${i.left},0 L${i.left},${bodyScrollHeight}`} />
            </g>
          )
        )}

        <TasksDependencies />
        <DragAreaIndicator />
      </ChartSvgRenderer>

      <RenderChunk
        style={{
          height: `${bodyScrollHeight}px`,
          transform: `translateX(-${translateX}px)`,
        }}
      >
        <RecordsBarsThumbsList />
        <RecordsBarList />
        <TimeAxisTodayLine />
      </RenderChunk>
    </Root>
  );
});

GanttChart.displayName = 'GanttChart';
export { GanttChart };
