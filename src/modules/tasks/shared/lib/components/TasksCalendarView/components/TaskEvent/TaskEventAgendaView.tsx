import { routes } from '@/app';
import {
  LinkedEntityTag,
  SpanWithEllipsis,
  TruncateMixin,
  UriCodingUtil,
  throttle,
  type UtcDateValue,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { memo, useCallback, useMemo, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useTasksCalendarContext } from '../../../../../../context';
import { getTaskStatusColor } from '../../../../helpers';
import {
  Activity,
  SELECTED_TASK_ID_PARAM,
  type BaseTask,
  type TaskViewStyles,
} from '../../../../models';
import { TaskEventAvatarBlock } from '../../../TaskEventAvatarBlock/TaskEventAvatarBlock';

const Root = styled.div<{ $editable?: boolean }>`
  position: relative;

  height: 100%;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  padding: 8px 12px;
  border-radius: var(--border-radius-block);
  transition: var(--transition-200);

  &:hover {
    background: var(--graphite-graphite-40);
  }

  &:active {
    background: var(--graphite-graphite-80);
  }

  ${p =>
    p.$editable &&
    css`
      &:hover {
        cursor: pointer;
      }
    `}

  ${TruncateMixin}
`;

const LeftBlock = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 24px;

  ${TruncateMixin}
`;

const InfoWrapper = styled.div`
  width: 200px;

  display: flex;
  align-items: center;
  gap: 12px;
`;

const Indicator = styled.div<{ $bgColor: CSSProperties['color'] }>`
  width: 12px;
  height: 12px;

  flex-shrink: 0;

  border-radius: 50%;
  background: ${p => p.$bgColor};
`;

const Text = styled.div<{ $time?: boolean }>`
  width: 100%;

  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
  color: var(--button-text-graphite-priory-text);

  ${p => p.$time && `font-variant-numeric: tabular-nums;`};

  ${TruncateMixin};
`;

interface Props {
  task: BaseTask;
  title: string;
  endDate?: UtcDateValue;
  startDate?: UtcDateValue;
  toggleResolved?: (task: BaseTask) => void;
}

const TaskEventAgendaView = memo((props: Props) => {
  const { task, title, startDate, endDate, toggleResolved } = props;

  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.tasks_page_calendar',
  });

  const context = useTasksCalendarContext();

  const [, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();

  const currentPageEncodedUrl = useMemo<string>(() => UriCodingUtil.encode(pathname), [pathname]);

  const [isHovered, { open: onHover, close: onBlur }] = useDisclosure(false);

  // Throttle here is needed to prevent too frequent mouse position updates resulting in icons blinking
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledOnHover = useCallback(throttle(onHover, 200), [onHover]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledOnBlur = useCallback(throttle(onBlur, 200), [onBlur]);

  const handleSelect = useCallback(() => {
    if (task instanceof Activity) return;

    setSearchParams(prev => {
      prev.set(SELECTED_TASK_ID_PARAM, String(task.id));

      return prev;
    });
  }, [setSearchParams, task]);

  const handleResolve = useCallback(
    (task: BaseTask) => {
      if (toggleResolved) {
        return toggleResolved(task);
      } else if (context?.onResolve) {
        return context.onResolve(task);
      } else {
        throw new Error(`Cannot get resolving function in agenda view for task: ${task.id}`);
      }
    },
    [context, toggleResolved]
  );

  const startTime = startDate?.displayTime();
  const endTime = endDate?.displayTime();

  const colors = useMemo<TaskViewStyles>(
    () =>
      task
        ? getTaskStatusColor(task.timeStatus())
        : {
            indicatorColor: 'var(--button-text-graphite-secondary-text)',
            bgColor: 'var(--primary-statuses-white-0)',
            borderColor: 'var(--graphite-graphite-120)',
          },
    [task]
  );

  return (
    <Root
      $editable={task?.userRights.canEdit}
      onMouseEnter={throttledOnHover}
      onMouseLeave={throttledOnBlur}
      onClick={handleSelect}
    >
      <LeftBlock>
        <InfoWrapper>
          <Indicator $bgColor={colors.indicatorColor} />

          <TaskEventAvatarBlock
            task={task}
            isHovered={isHovered}
            toggleResolved={handleResolve}
            bigAvatar
          />

          {startTime && endTime && (
            <Text $time>
              {startTime} — {endTime}
            </Text>
          )}
        </InfoWrapper>

        <Text>
          <SpanWithEllipsis text={!task ? t('new_event') : title} />
        </Text>
      </LeftBlock>

      {task?.entityInfo && (
        <LinkedEntityTag
          $maxWidth="240px"
          to={routes.card({
            entityTypeId: task.entityInfo.entityTypeId,
            entityId: task.entityInfo.id,
            from: currentPageEncodedUrl,
          })}
        >
          <SpanWithEllipsis text={task.entityInfo.name} />
        </LinkedEntityTag>
      )}
    </Root>
  );
});

TaskEventAgendaView.displayName = 'TaskEventAgendaView';
export { TaskEventAgendaView };
