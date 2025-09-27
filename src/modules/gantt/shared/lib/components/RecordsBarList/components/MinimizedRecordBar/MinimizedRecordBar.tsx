import { getTaskStatusColor, type TaskViewStyles } from '@/modules/tasks';
import { useMemo, type CSSProperties } from 'react';
import styled, { css } from 'styled-components';
import { useGanttContext } from '../../../../../../context';
import { BAR_HEIGHT, TOP_PADDING, type Bar } from '../../../../models';

const Root = styled.div<{ $editable?: boolean }>`
  position: relative;

  width: ${BAR_HEIGHT}px;
  height: ${BAR_HEIGHT}px;

  display: flex;
  justify-content: center;
  align-items: center;

  ${p =>
    p.$editable &&
    css`
      &:hover {
        cursor: pointer;
      }
    `}
`;

const BarDot = styled.div<{ $bgColor: CSSProperties['color'] }>`
  position: relative;

  height: ${BAR_HEIGHT / 2}px;
  width: ${BAR_HEIGHT / 2}px;

  display: flex;
  align-items: center;

  background-color: color-mix(in srgb, ${p => p.$bgColor} 90%, transparent);
  border-radius: 50%;
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

const MinimizedRecordBar = (props: Props) => {
  const { bar } = props;

  const { store, barHeight } = useGanttContext();

  const { showSelectionIndicator, selectionIndicatorTop, rowHeight } = store;

  const { indicatorColor } = useMemo<TaskViewStyles>(
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

  const showDragBarAndLabels = useMemo<boolean>(() => {
    if (!showSelectionIndicator) return false;

    const baseTop = TOP_PADDING + rowHeight / 2 - barHeight / 2;

    return selectionIndicatorTop === bar.translateY - baseTop;
  }, [showSelectionIndicator, selectionIndicatorTop, bar.translateY, rowHeight, barHeight]);

  const dateFormat = bar.record.dateFormat;

  return (
    <Root $editable={bar.record?.userRights.canEdit}>
      <BarDot title={bar.item.title} $bgColor={indicatorColor} />

      {showDragBarAndLabels && bar.record.startDate && bar.record.endDate && (
        <>
          <DateText $left>{bar.record.startDate.format(dateFormat)}</DateText>

          <DateText>{bar.record.endDate.format(dateFormat)}</DateText>
        </>
      )}
    </Root>
  );
};

export { MinimizedRecordBar };
