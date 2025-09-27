import { userStore } from '@/app';
import {
  AvatarCircle,
  MyCheckbox,
  SpanWithEllipsis,
  TruncateMixin,
  truncateNumber,
  type Avatar,
} from '@/shared';
import { convert } from 'html-to-text';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, type MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import type { TasksGroupStore } from '../../../../../store';
import { Body, Date, Footer, Header, ItemTemplate, Text } from '../../../../../templates';
import { AccountTreeIcon, AttachFileIcon } from '../../../../assets';
import {
  SELECTED_TASK_ID_PARAM,
  TaskHexColors,
  TaskPalette,
  type Task,
  type TaskColorStyle,
} from '../../../models';
import { PlannedTimeBlock } from './components';

const IconWrapper = styled.div`
  width: 14px;
  height: 14px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TimeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ItemAnnotation = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 22px;
  font-variant: tabular-nums;
  color: var(--button-text-graphite-primary-text);
`;

const LinkedItemsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TitleWrapper = styled.div<{ $resolved: boolean }>`
  position: relative;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;

  overflow: hidden;
  word-wrap: break-word;

  font-size: 14px;
  font-weight: 600;
  line-height: 21px;
  text-indent: 22px;
  color: ${p => (p.$resolved ? TaskHexColors.BLUE : 'var(--primary-blue)')};
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: ${p =>
      p.$resolved ? 'var(--button-text-graphite-secondary-text)' : 'var(--button-text-blue-hover)'};
  }

  &:active {
    color: ${p =>
      p.$resolved ? 'var(--button-text-graphite-primary-text)' : 'var(--button-text-blue-active)'};
  }
`;

const CheckboxWrapper = styled.div`
  position: absolute;
  top: 1px;
  left: 0;

  width: 16px;
  height: 16px;
`;

const DateWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

interface TagProps {
  $resolved: boolean;
  $disabled: boolean;
}

const Tag = styled.div<TagProps>`
  position: relative;

  height: 20px;

  display: flex;
  align-items: center;

  font-size: 12px;
  font-weight: 400;
  color: var(--primary-statuses-white-0);

  padding: 1px 6px 2px;
  border-radius: var(--border-radius-element);
  background: ${p =>
    p.$resolved || p.$disabled
      ? 'var(--button-text-graphite-secondary-text)'
      : 'var(--primary-statuses-fuchsia-400)'};
  transition: var(--transition-200);

  ${TruncateMixin}
`;

const FooterContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${TruncateMixin}
`;

interface Props {
  task: Task;
  idx: number;
  taskGroupStore: TasksGroupStore;
  handleMouseUp?: MouseEventHandler<HTMLDivElement>;
  handleMouseDown?: MouseEventHandler<HTMLDivElement>;
}

const TaskItem = observer((props: Props) => {
  const {
    task,
    idx,
    taskGroupStore: { toggleResolved },
    handleMouseUp,
    handleMouseDown,
  } = props;

  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.task_item',
  });

  const {
    text,
    title,
    endDate,
    startDate,
    userRights,
    entityInfo,
    isResolved,
    plannedTime,
    responsibleUserId,
  } = task;

  const [, setSearchParams] = useSearchParams();

  const responsibleUser = userStore.getById(responsibleUserId);

  const avatar = useMemo<Avatar>(() => responsibleUser.getAvatar(), [responsibleUser]);
  const colorStyle = useMemo<TaskColorStyle>(() => TaskPalette[task.timeStatus()], [task]);
  const convertedText = useMemo<string>(() => convert(text), [text]);

  const fileLinksLength = task.fileLinks.length;
  const subtaskCount = task.subtaskCount || task.subtasks?.length;

  const showDate = startDate || endDate;
  const showBody = showDate || convertedText.length > 0;

  const showTaskModal = useCallback(() => {
    setSearchParams(prev => {
      prev.set(SELECTED_TASK_ID_PARAM, String(task.id));

      return prev;
    });
  }, [task.id, setSearchParams]);

  const handleToggleResolved = useCallback(() => toggleResolved(task), [task, toggleResolved]);

  return (
    <ItemTemplate
      idx={idx}
      baseTask={task}
      canEdit={userRights.canEdit}
      dragDisabledTitle={t('drag_disabled')}
      handleMouseDown={handleMouseDown}
      handleMouseUp={handleMouseUp}
    >
      <Header>
        <TitleWrapper $resolved={isResolved}>
          <span />

          <CheckboxWrapper>
            <MyCheckbox
              gray={isResolved}
              checked={isResolved}
              disabled={!userRights.canEdit}
              onChange={handleToggleResolved}
            />
          </CheckboxWrapper>

          <span onClick={showTaskModal}>{title}</span>
        </TitleWrapper>

        {plannedTime !== null && plannedTime > 0 && (
          <TimeWrapper>
            <ItemAnnotation>{t('planned_time')}</ItemAnnotation>

            <PlannedTimeBlock plannedTimeInSeconds={plannedTime} />
          </TimeWrapper>
        )}
      </Header>

      {showBody && (
        <Body>
          {showDate && (
            <DateWrapper>
              {startDate && (
                <Date $titleColor={colorStyle.titleColor} $resolved={isResolved}>
                  {startDate.format('MMM D, HH:mm')}
                </Date>
              )}

              {endDate && (
                <Date $titleColor={colorStyle.titleColor} $resolved={task.isResolved}>
                  {endDate.format('MMM D, HH:mm')}
                </Date>
              )}
            </DateWrapper>
          )}

          {convertedText.length > 0 && <Text $resolved={isResolved}>{convertedText}</Text>}
        </Body>
      )}

      <Footer>
        <FooterContentWrapper>
          {entityInfo && (
            <Tag $resolved={isResolved} $disabled={!entityInfo.hasAccess}>
              <SpanWithEllipsis text={entityInfo.name} />
            </Tag>
          )}

          {subtaskCount > 0 && (
            <LinkedItemsWrapper>
              <IconWrapper>
                <AccountTreeIcon />
              </IconWrapper>

              <ItemAnnotation>{truncateNumber({ num: subtaskCount, precision: 3 })}</ItemAnnotation>
            </LinkedItemsWrapper>
          )}

          {fileLinksLength > 0 && (
            <LinkedItemsWrapper>
              <IconWrapper>
                <AttachFileIcon />
              </IconWrapper>

              <ItemAnnotation>
                {truncateNumber({ num: fileLinksLength, precision: 3 })}
              </ItemAnnotation>
            </LinkedItemsWrapper>
          )}
        </FooterContentWrapper>

        <AvatarCircle avatar={avatar} size="small" />
      </Footer>
    </ItemTemplate>
  );
});

TaskItem.displayName = 'TaskItem';
export { TaskItem };
