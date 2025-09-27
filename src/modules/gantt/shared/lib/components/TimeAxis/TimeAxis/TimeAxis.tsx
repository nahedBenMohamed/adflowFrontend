import { NoSelectMixin } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useGanttContext } from '../../../../../context';
import type { Minor } from '../../../models';
import { DragResizeManager } from '../../DragResizeManager/DragResizeManager';

const Root = styled.div`
  position: absolute;
  top: 1px;

  height: 56px;

  overflow: hidden;

  ${NoSelectMixin}
`;

const RenderChunk = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  height: 56px;

  pointer-events: none;
  will-change: transform;

  ${NoSelectMixin}
`;

const MajorAxis = styled.div`
  box-sizing: content-box;

  position: absolute;

  height: 28px;

  display: flex;
  align-items: center;
  flex-shrink: 0;

  font-size: 13px;
  text-align: left;
  font-weight: 500;
  line-height: 24px;
  color: var(--button-text-graphite-primary-text);

  overflow: hidden;
  border-right: 1px solid var(--graphite-graphite-80);
`;

const MajorLabel = styled.div`
  overflow: hidden;
  padding-left: 8px;
  white-space: nowrap;
`;

const MinorAxis = styled.div<{ $smallerText: boolean }>`
  box-sizing: content-box;

  position: absolute;
  top: 27px;

  height: 28px;

  font-size: 12px;
  line-height: 28px;
  text-align: center;
  color: var(--button-text-graphite-primary-text);

  border-top: 1px solid var(--graphite-graphite-80);
  border-right: 1px solid var(--graphite-graphite-80);

  ${p =>
    p.$smallerText &&
    css`
      font-size: 11px;
      line-height: 26px;
    `}
`;

const MinorLabel = styled.div<{ $today: boolean }>`
  height: 28px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${p =>
    p.$today &&
    css`
      color: var(--primary-statuses-white-0);
      // --primary-statuses-green-520 with 60% opacity
      background-color: rgba(104, 210, 34, 0.6);
    `}
`;

const ALIGN_WITH_CHART_OFFSET = 0.5;

const TimeAxis = observer(() => {
  const { store } = useGanttContext();
  const { viewConfig, isToday, isCurrentHour, isCurrentFifteenMinutes } = store;

  const majorList = store.majorAmpList;
  const minorList = store.minorAmpList;

  const handleResize = useCallback(({ x }: { x: number }) => store.handlePanMove(-x), [store]);
  const handleLeftResizeEnd = useCallback(() => store.handlePanEnd(), [store]);

  const getIsToday = useCallback(
    (item: Minor): boolean => {
      const { key } = item;

      switch (viewConfig.view) {
        case 'fifteen-minutes':
          return isCurrentFifteenMinutes(key);

        case 'hour':
          return isCurrentHour(key);

        case 'day':
          return isToday(key);

        default:
          return false;
      }
    },
    [viewConfig, isToday, isCurrentHour, isCurrentFifteenMinutes]
  );

  const defaultSize = useMemo(
    () => ({
      x: -store.translateX,
      width: 0,
    }),
    [store.translateX]
  );

  return (
    <DragResizeManager
      type="move"
      defaultSize={defaultSize}
      onResize={handleResize}
      onResizeEnd={handleLeftResizeEnd}
    >
      <Root
        style={{
          left: `${store.tableWidth}px`,
          width: `${store.viewWidth}px`,
        }}
      >
        <RenderChunk
          style={{
            transform: `translateX(-${store.translateX}px)`,
          }}
        >
          {majorList.map(majX => (
            <MajorAxis
              key={majX.key}
              style={{
                width: `${majX.width}px`,
                left: `${majX.left - ALIGN_WITH_CHART_OFFSET}px`,
              }}
            >
              <MajorLabel>{majX.label}</MajorLabel>
            </MajorAxis>
          ))}

          {minorList.map(minX => (
            <MinorAxis
              key={minX.key}
              $smallerText={viewConfig.view === 'fifteen-minutes'}
              style={{
                width: `${minX.width}px`,
                left: `${minX.left - ALIGN_WITH_CHART_OFFSET}px`,
              }}
            >
              <MinorLabel $today={getIsToday(minX)}>{minX.label}</MinorLabel>
            </MinorAxis>
          ))}
        </RenderChunk>
      </Root>
    </DragResizeManager>
  );
});

TimeAxis.displayName = 'TimeAxis';
export { TimeAxis };
