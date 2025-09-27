import {
  ScaleBarIcon,
  TaskEventAvatarBlock,
  getTaskStatusColor,
  type TaskViewStyles,
} from '@/modules/tasks';
import {
  SpanWithEllipsis,
  TruncateMixin,
  calculateEndOfWordIdxByNumber,
  throttle,
  usePersistFn,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEventHandler,
} from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { useOnClickOutside } from 'usehooks-ts';
import { useGanttContext } from '../../../../../../context';
import { BAR_HEIGHT, GANTT_BAR_CLICK_EVENT, SELECTION_BAR_TOP, type Bar } from '../../../../models';
import type { MoveType } from '../../../../types';
import { DragResizeManager } from '../../../DragResizeManager/DragResizeManager';
import { GanttBarLinkMenu, type MenuPosition } from '../../../GanttBarLinkMenu/GanttBarLinkMenu';
import { MinimizedRecordBar } from '../MinimizedRecordBar/MinimizedRecordBar';

interface TimelineBarProps {
  $width: number;
  $bgColor: CSSProperties['color'];
  $borderColor: CSSProperties['borderColor'];
  $editable?: boolean;
}

const TimelineBar = styled.div<TimelineBarProps>`
  position: relative;

  height: ${BAR_HEIGHT}px;
  width: ${p => p.$width}px;

  display: flex;
  align-items: center;
  gap: 4px;

  padding: 2px 8px 2px 3px;
  background-color: color-mix(in srgb, ${p => p.$bgColor} 60%, transparent);
  border: 1px solid ${p => p.$borderColor};
  border-radius: var(--border-radius-element);

  ${p =>
    p.$editable &&
    css`
      &:hover {
        cursor: pointer;
      }
    `}
`;

const Content = styled.div`
  height: 17px;
  width: 100%;

  display: flex;
  align-items: center;
  gap: 4px;
`;

const Indicator = styled.div<{ $color: CSSProperties['color'] }>`
  width: 2px;
  height: 100%;
  min-width: 2px;
  min-height: 17px;

  border-radius: 100px;
  background: ${p => p.$color};
`;

const TextWrapper = styled.div`
  max-width: calc(100% - 32px);

  display: flex;
  gap: 4px;

  ${TruncateMixin};
`;

interface TextProps {
  $resolved?: boolean;
  $time?: boolean;
}

const Text = styled.span<TextProps>`
  max-width: ${p => (p.$time ? 'unset' : '100%')};

  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: var(--button-text-graphite-priory-text);

  ${p =>
    p.$resolved &&
    css`
      font-weight: 400;
      color: var(--button-text-graphite-secondary-text);
      text-decoration: line-through;
    `}

  ${p => !p.$time && TruncateMixin};
`;

interface RootProps {
  $invalidDateRange: boolean;
  $translateX: number;
  $translateY: number;
}

const Root = styled.div<RootProps>`
  position: absolute;
  top: 0;
  left: 0;

  z-index: 10;

  display: ${p => (p.$invalidDateRange ? 'none' : 'flex')};
  align-items: center;
  gap: 4px;

  transform: translate(${p => p.$translateX}px, ${p => p.$translateY}px);
`;

const BarLabel = styled.p`
  position: absolute;
  top: -8px;
  left: 50%;

  height: 14px;
  width: fit-content;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  font-size: 9px;
  font-weight: 500;
  color: var(--button-text-graphite-primary-text);

  padding: 0 4px;
  white-space: nowrap;
  background: var(--graphite-graphite-40);
  border-radius: var(--border-radius-element);
  border: 1px solid var(--graphite-graphite-120);
  z-index: 100;

  transform: translateX(-50%);
`;

const DateText = styled.p<{ $left?: boolean }>`
  position: absolute;
  ${p => (p.$left ? `right: calc(100% + 12px)` : `left: calc(100% + 12px)`)};

  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  white-space: nowrap;
  color: var(--button-text-graphite-primary-text);
`;

interface Props {
  bar: Bar;
}

const RecordBar = observer((props: Props) => {
  const { bar } = props;

  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.tasks_page_timeline.annotation',
  });

  const { width, record, translateY, translateX, invalidDateRange, getDateWidth, dateTextFormat } =
    bar;

  const { store, onBarClick, tasksProps } = useGanttContext();

  const {
    viewConfig: { view },
    selectionIndicatorTop,
    showSelectionIndicator,
    scrolling,
    draggingKey,
    getBarGrid,
  } = store;

  const rootRef = useRef<HTMLDivElement>(null);

  const [menuPosition, setMenuPosition] = useState<MenuPosition>({ x: 0, y: 0 });
  const [isMenuOpened, { open: openMenu, close: closeMenu }] = useDisclosure(false);

  const showDragBarAndLabels = useMemo<boolean>(() => {
    if (!showSelectionIndicator) return false;

    return selectionIndicatorTop === translateY - SELECTION_BAR_TOP;
  }, [showSelectionIndicator, selectionIndicatorTop, translateY]);

  const handleBeforeResize = useCallback(
    (type: MoveType) => () => store.handleDragStart({ barInfo: bar, type }),
    [bar, store]
  );

  const handleResize = useCallback(
    ({ width: newWidth, x }: { width: number; x: number }) =>
      store.updateBarSize(bar, { width: newWidth, x }),
    [bar, store]
  );

  const handleLeftResizeEnd = useCallback(
    (oldSize: { width: number; x: number }) => {
      store.handleDragEnd();
      store.updateRecordDate({ barInfo: bar, oldSize, updateType: 'left' });
    },
    [bar, store]
  );

  const handleRightResizeEnd = useCallback(
    (oldSize: { width: number; x: number }) => {
      store.handleDragEnd();
      store.updateRecordDate({ barInfo: bar, oldSize, updateType: 'right' });
    },
    [bar, store]
  );

  const handleMoveEnd = useCallback(
    (oldSize: { width: number; x: number }) => {
      store.handleDragEnd();
      store.updateRecordDate({ barInfo: bar, oldSize, updateType: 'move' });
    },
    [bar, store]
  );

  const handleAutoScroll = useCallback(
    (delta: number) => store.setTranslateX(store.translateX + delta),
    [store]
  );

  const handleClick = useCallback<MouseEventHandler<HTMLDivElement>>(
    e => {
      onBarClick?.(record);

      setMenuPosition({ x: e.nativeEvent.clientX, y: e.nativeEvent.clientY });
      openMenu();
    },
    [onBarClick, record, openMenu]
  );

  useOnClickOutside(rootRef as RefObject<HTMLDivElement>, () => {
    closeMenu();
  });

  // custom event emitted on click in DragResizeManager
  // for clarification see BarClickEvent
  useEffect(() => {
    document.addEventListener(GANTT_BAR_CLICK_EVENT, closeMenu);

    return () => document.removeEventListener(GANTT_BAR_CLICK_EVENT, closeMenu);
  }, [closeMenu]);

  useEffect(() => {
    if (scrolling || draggingKey) closeMenu();
  }, [closeMenu, draggingKey, scrolling]);

  const reachEdge = usePersistFn(
    (position: 'left' | 'right') => position === 'left' && store.translateX <= 0
  );

  const [isHovered, { open: onHover, close: onBlur }] = useDisclosure(false);

  // Throttle here is needed to prevent too frequent mouse position updates resulting in icons blinking
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledOnHover = useCallback(throttle(onHover, 200), [onHover]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledOnBlur = useCallback(throttle(onBlur, 200), [onBlur]);

  const grid = getBarGrid();

  const moveCalc = -(width / store.pxUnitAmp);

  const getBarLabel = useCallback((): string => {
    const barWidth = getDateWidth({ startX: translateX + width + moveCalc, endX: translateX });
    const idx = calculateEndOfWordIdxByNumber(barWidth);

    let annotation: string;

    switch (view) {
      case 'fifteen-minutes': {
        annotation = t(`minute.${idx}`);

        break;
      }

      case 'hour': {
        annotation = t(`hour.${idx}`);

        break;
      }

      default: {
        annotation = t(`day.${idx}`);
      }
    }

    return `${barWidth} ${annotation}`;
  }, [view, translateX, width, moveCalc, getDateWidth, t]);

  const { indicatorColor, bgColor, borderColor } = useMemo<TaskViewStyles>(
    () =>
      bar.record
        ? getTaskStatusColor(bar.record.timeStatus)
        : {
            indicatorColor: 'var(--button-text-graphite-secondary-text)',
            bgColor: 'var(--primary-statuses-white-0)',
            borderColor: 'var(--graphite-graphite-120)',
          },
    [bar.record]
  );

  const dragResizeDefaultSize = useMemo(() => ({ x: translateX, width }), [translateX, width]);

  const fifteenMinutesOrHourView = view === 'fifteen-minutes' || view === 'hour';

  const rightDateText = useMemo<string>(() => {
    const x = translateX + width + moveCalc;
    const finalX = fifteenMinutesOrHourView ? Math.ceil(x) : x;

    return dateTextFormat(finalX);
  }, [fifteenMinutesOrHourView, translateX, width, moveCalc, dateTextFormat]);

  const leftDateText = useMemo<string>(
    () => dateTextFormat(Math.ceil(translateX)),
    [translateX, dateTextFormat]
  );

  const isMinimizedView = useMemo<boolean>(() => {
    if (!bar.record.startDate || !bar.record.endDate) return false;

    switch (view) {
      case 'fifteen-minutes':
        return false;

      case 'hour':
      case 'day':
        return bar.record.endDate.diffMinutes(bar.record.startDate) < 30;

      case 'week':
        return bar.record.endDate.diffDays(bar.record.startDate) < 1;

      case 'month':
      case 'quarter':
      case 'half-year':
        return bar.record.endDate.diffDays(bar.record.startDate) < 5;
    }

    throw new Error(`Unrecognized timeline view: ${view}`);
  }, [bar.record.endDate, bar.record.startDate, view]);

  if (isMinimizedView)
    return (
      <Root
        ref={rootRef}
        $translateX={translateX}
        $translateY={translateY}
        $invalidDateRange={invalidDateRange}
        onClick={handleClick}
      >
        <MinimizedRecordBar bar={bar} />

        <GanttBarLinkMenu
          bar={bar}
          isOpen={isMenuOpened}
          position={menuPosition}
          handleClose={closeMenu}
        />
      </Root>
    );

  return (
    <Root
      ref={rootRef}
      $translateX={translateX}
      $translateY={translateY}
      $invalidDateRange={invalidDateRange}
      onClick={handleClick}
    >
      <DragResizeManager
        grid={grid}
        type="move"
        defaultSize={dragResizeDefaultSize}
        scroller={store.chartElementRef.current}
        onResize={handleResize}
        hasReachedEdge={reachEdge}
        onResizeEnd={handleMoveEnd}
        onAutoScroll={handleAutoScroll}
        onBeforeResize={handleBeforeResize('move')}
      >
        <TimelineBar
          $width={width}
          title={bar.item.title}
          $bgColor={bgColor}
          $borderColor={borderColor}
          $editable={bar.record?.userRights.canEdit}
          onMouseLeave={throttledOnBlur}
          onMouseEnter={throttledOnHover}
        >
          {!bar.record.isResolved && <Indicator $color={indicatorColor} />}

          {width >= 28 && (
            <Content>
              <TaskEventAvatarBlock
                task={bar.record}
                isHovered={isHovered}
                toggleResolved={tasksProps?.toggleResolveTask}
              />

              <TextWrapper>
                <Text $resolved={bar.record?.isResolved}>
                  <SpanWithEllipsis text={bar.item.title} />
                </Text>
              </TextWrapper>

              <GanttBarLinkMenu
                bar={bar}
                isOpen={isMenuOpened}
                position={menuPosition}
                handleClose={closeMenu}
              />
            </Content>
          )}

          {showDragBarAndLabels && (
            <>
              <DateText $left>{leftDateText}</DateText>

              {width > 60 && <BarLabel>{getBarLabel()}</BarLabel>}

              <DateText>{rightDateText}</DateText>

              <DragResizeManager
                type="left"
                grid={grid}
                defaultSize={dragResizeDefaultSize}
                scroller={store.chartElementRef.current}
                onResize={handleResize}
                hasReachedEdge={reachEdge}
                onAutoScroll={handleAutoScroll}
                onResizeEnd={handleLeftResizeEnd}
                onBeforeResize={handleBeforeResize('left')}
              >
                <ScaleBarIcon />
              </DragResizeManager>

              <DragResizeManager
                grid={grid}
                type="right"
                defaultSize={dragResizeDefaultSize}
                scroller={store.chartElementRef.current}
                onResize={handleResize}
                hasReachedEdge={reachEdge}
                onAutoScroll={handleAutoScroll}
                onResizeEnd={handleRightResizeEnd}
                onBeforeResize={handleBeforeResize('right')}
              >
                <ScaleBarIcon />
              </DragResizeManager>
            </>
          )}
        </TimelineBar>
      </DragResizeManager>
    </Root>
  );
});

RecordBar.displayName = 'RecordBar';
export { RecordBar };
