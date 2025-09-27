import { throttle, TruncateMixin, UtcDate, type UtcDateValue } from '@/shared';
import { useDisclosure, useElementSize } from '@mantine/hooks';
import { useCallback, useMemo, type CSSProperties } from 'react';
import styled, { css } from 'styled-components';
import { getTaskStatusColor } from '../../../../helpers';
import { TaskColorType, type BaseTask, type TaskViewStyles } from '../../../../models';
import { TaskEventAvatarBlock } from '../../../TaskEventAvatarBlock/TaskEventAvatarBlock';

interface RootProps {
  $bgColor: CSSProperties['color'];
  $borderColor: CSSProperties['borderColor'];
  $editable?: boolean;
}

const Root = styled.div<RootProps>`
  position: relative;

  height: 100%;
  width: 100%;

  display: flex;
  gap: 4px;

  padding: 2px 8px 2px 2px;
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

  ${TruncateMixin}
`;

const Content = styled.div`
  position: relative;

  height: 100%;
  width: 100%;

  display: flex;
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

interface TitleProps {
  $lines: number;
  $hide?: boolean;
  $resolved?: boolean;
  $bigIndent?: boolean;
  $fromNewLine?: boolean;
  $biggerIndent?: boolean;
}

const Title = styled.span<TitleProps>`
  position: absolute;
  top: 0;
  left: 0;

  max-width: 100%;

  display: ${p => (p.$hide ? 'none' : '-webkit-box')};
  -webkit-line-clamp: ${p => p.$lines};
  -webkit-box-orient: vertical;

  overflow: hidden;
  white-space: pre-wrap;
  hyphens: ${p => (p.$lines > 1 ? 'auto' : 'none')};

  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  text-indent: ${p => (p.$biggerIndent ? 78 : p.$bigIndent ? 54 : 22)}px;
  color: var(--button-text-graphite-priory-text);

  ${p =>
    p.$fromNewLine &&
    css<TitleProps>`
      top: 16px;

      text-indent: 0;
      -webkit-line-clamp: ${p => p.$lines - 1};
    `};

  ${p =>
    p.$resolved &&
    css`
      font-weight: 400;
      color: var(--button-text-graphite-secondary-text);
      text-decoration: line-through;
    `}
`;

const Time = styled.time<{ $resolved?: boolean }>`
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
`;

interface Props {
  title: string;
  task: BaseTask;
  taskColorType: TaskColorType;
  endDate?: UtcDateValue;
  startDate?: UtcDateValue;
  toggleResolved: (task: BaseTask) => void;
}

const TaskEventGridView = (props: Props) => {
  const { title, endDate, taskColorType, startDate, task, toggleResolved } = props;

  const { ref: rootRef, width: rootWidth } = useElementSize();
  const [isHovered, { open: onHover, close: onBlur }] = useDisclosure(false);
  const [isDragged, { open: onDrag, close: onDrop }] = useDisclosure(false);

  // Throttle here is needed to prevent too frequent mouse position updates resulting in icons blinking
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledOnHover = useCallback(throttle(onHover, 200), [onHover]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledOnBlur = useCallback(throttle(onBlur, 200), [onBlur]);

  const showTime = useMemo<boolean>(() => {
    if (!startDate || !endDate) {
      return false;
    } else {
      return startDate.diffDays(endDate) < 1;
    }
  }, [endDate, startDate]);

  const startTime = startDate?.displayTime();
  const endTime = endDate?.displayTime();

  // Calculate maximum number of lines to display title
  const lines = useMemo<number>(() => {
    if (!startDate || !endDate || endDate.diff(startDate) < 15 * 60) return 1;

    const fifteenMinutesBlocks = endDate.diff(startDate) / (15 * 60);
    const blockHeightToLineHeightRatio = 24 / 16;
    const offset = -0.5;

    return Math.floor(fifteenMinutesBlocks * blockHeightToLineHeightRatio + offset);
  }, [endDate, startDate]);

  const { indicatorColor, bgColor, borderColor } = useMemo<TaskViewStyles>(
    () =>
      !task || taskColorType === TaskColorType.COLORLESS
        ? {
            indicatorColor: 'var(--button-text-graphite-secondary-text)',
            bgColor: 'var(--primary-statuses-white-0)',
            borderColor: 'var(--graphite-graphite-120)',
          }
        : getTaskStatusColor(task.timeStatus()),
    [task, taskColorType]
  );

  const startTitleFromNewLine = useMemo<boolean>(
    () => rootWidth < 160 && lines > 1,
    [lines, rootWidth]
  );
  const titleHidden = useMemo<boolean>(() => rootWidth < 100, [rootWidth]);

  return (
    <Root
      ref={rootRef}
      title={title}
      $bgColor={bgColor}
      $borderColor={borderColor}
      $editable={task?.userRights.canEdit}
      onDragEnd={onDrop}
      onDragStart={onDrag}
      onMouseLeave={throttledOnBlur}
      onMouseEnter={throttledOnHover}
    >
      {!task?.isResolved && <Indicator $color={indicatorColor} />}

      <Content>
        {task && (
          <TaskEventAvatarBlock
            task={task}
            isHovered={isHovered}
            avatarHidden={isDragged}
            toggleResolved={toggleResolved}
          />
        )}

        {showTime && (
          <Time $resolved={task?.isResolved}>{task ? startTime : `${startTime} — ${endTime}`}</Time>
        )}

        <Title
          $lines={lines}
          $hide={titleHidden}
          $bigIndent={showTime}
          $biggerIndent={showTime && UtcDate.isEnglishLocale()}
          $resolved={task?.isResolved}
          $fromNewLine={startTitleFromNewLine}
        >
          {title}
        </Title>
      </Content>
    </Root>
  );
};

export { TaskEventGridView };
