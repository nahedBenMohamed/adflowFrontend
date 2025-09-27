import { userStore } from '@/app';
import { SELECTED_TASK_ID_PARAM, type Task, UpdateTaskDto, UpdateTaskModal } from '@/modules/tasks';
import { type FileLink, FileUtil, type Optional, TaskTimeStatus, UtcDate } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import DOMPurify from 'dompurify';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import type { FeedItemColorVariant } from '../../../../helpers';
import { useFeedItemOutline } from '../../../../hooks';
import { TaskTimeStatusIcons } from '../../../../models';
import {
  AttachmentsBlock,
  AuthorBlock,
  DateBlock,
  FeedItem,
  FeedItemLeftBlock,
  FeedItemWrapper,
  type FrameVariant,
  InnerHTMLNormalizer,
  ItemInfo,
} from '../FeedItem';
import type { CheckboxProps } from '../FeedItem/Common/FeedItem/FeedItem';
import { TaskItemBottom } from './components';

const DescriptionWrapper = styled.div<{ $resolved: boolean }>`
  margin-top: 16px;

  div {
    ${p => p.$resolved && `color: var(--button-text-graphite-secondary-text);`}
  }
`;

interface Props {
  task: Task;
  syncTask: (taskStateInModal: Task) => void;
  updateTask: ({ taskId, dto }: { taskId: number; dto: UpdateTaskDto }) => Promise<void>;
  deleteTask: (id: number) => void;
}

const getFrameVariant = (timeStatus: TaskTimeStatus): FrameVariant => {
  switch (timeStatus) {
    case TaskTimeStatus.ACTIVE_TODAY:
      return 'green-outline';

    case TaskTimeStatus.EXPIRED:
      return 'outlined-with-dark-icon';

    default:
      return 'outlined';
  }
};

const TaskBlock = observer((props: Props) => {
  const { task, deleteTask, updateTask, syncTask } = props;

  const { canDelete, canEdit } = task.userRights;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed.task_block',
  });

  const highlighted = useFeedItemOutline(task.createdAt);

  const [searchParams, setSearchParams] = useSearchParams();

  const [isResolving, setIsResolving] = useState(false);

  const selectedTaskIdParam = searchParams.get(SELECTED_TASK_ID_PARAM);
  const selectedTaskId = selectedTaskIdParam ? Number(selectedTaskIdParam) : null;

  const [isUpdateModalOpened, { close: hideUpdateModal, open: showUpdateModal }] = useDisclosure(
    Boolean(selectedTaskId)
  );

  const creator = userStore.getById(task.createdBy);
  const responsibleUser = userStore.getById(task.responsibleUserId);

  const Icon = TaskTimeStatusIcons.get(task.timeStatus());

  const getItemStyle = useCallback((): Optional<FeedItemColorVariant> => {
    switch (task.timeStatus()) {
      case TaskTimeStatus.EXPIRED:
        return 'red';

      case TaskTimeStatus.ACTIVE_TODAY:
        return 'green';
    }
  }, [task]);

  const handleResolve = useCallback(async (): Promise<void> => {
    try {
      setIsResolving(true);

      const resolved = !task.isResolved;

      task.isResolved = resolved;
      task.resolvedDate = resolved ? UtcDate.now() : null;

      const dto = UpdateTaskDto.create({
        isResolved: resolved,
      });

      await updateTask({ taskId: task.id, dto });

      syncTask(task);
    } catch (e) {
      console.error(`Failed to resolve task: ${e}`);
    } finally {
      setIsResolving(false);
    }
  }, [task, updateTask, syncTask]);

  const handleShowUpdateModal = useCallback(() => {
    showUpdateModal();

    setSearchParams(prev => {
      prev.set(SELECTED_TASK_ID_PARAM, String(task.id));

      return prev;
    });
  }, [task.id, showUpdateModal, setSearchParams]);

  const handleHideUpdateModal = useCallback(() => {
    hideUpdateModal();

    setSearchParams(prev => {
      prev.delete(SELECTED_TASK_ID_PARAM);

      return prev;
    });
  }, [hideUpdateModal, setSearchParams]);

  const handleDeleteFileLink = useCallback(
    (fileLink: FileLink) => {
      task.fileLinks = task.fileLinks.filter(f => f.fileInfo.fileId !== fileLink.fileInfo.fileId);

      FileUtil.deleteFileLink(fileLink.id);
    },
    [task]
  );

  const handleDownloadFile = useCallback(
    async ({ url, fileName }: { url: string; fileName: string }) =>
      await FileUtil.downloadFile({ url, fileName }),
    []
  );

  const checkboxProps = useMemo<CheckboxProps>(
    () => ({
      resolved: task.isResolved,
      checked: task.isResolved,
      disabled: !canEdit || isResolving,
      handleCheckboxChange: handleResolve,
    }),
    [task.isResolved, canEdit, isResolving, handleResolve]
  );

  const frameVariant = getFrameVariant(task.timeStatus());

  return (
    <>
      <FeedItemWrapper>
        <FeedItemLeftBlock Icon={Icon} />

        <FeedItem
          title={task.title}
          highlighted={highlighted}
          itemStyle={getItemStyle()}
          checkboxProps={checkboxProps}
          isResolvedTask={task.isResolved}
          dashed={task.timeStatus() === TaskTimeStatus.ACTIVE_FUTURE}
          handleHeaderClick={handleShowUpdateModal}
          handleEdit={canEdit ? handleShowUpdateModal : undefined}
          handleDelete={canDelete ? () => deleteTask(task.id) : undefined}
        >
          <ItemInfo>
            <AuthorBlock
              user={responsibleUser}
              title={t('creator')}
              isResolvedTask={task.isResolved}
            />

            {task.startDate && (
              <DateBlock
                date={task.startDate}
                title={t('start_date')}
                frameVariant={frameVariant}
                isResolvedTask={task.isResolved}
                indicatorVariant={
                  task.timeStatus() === TaskTimeStatus.ACTIVE_TODAY ? 'green' : undefined
                }
              />
            )}

            {task.endDate && (
              <DateBlock
                isEndDate
                date={task.endDate}
                title={t('end_date')}
                frameVariant={frameVariant}
                isResolvedTask={task.isResolved}
                indicatorVariant={task.timeStatus() === TaskTimeStatus.EXPIRED ? 'red' : undefined}
              />
            )}
          </ItemInfo>

          {task.text.length > 0 && (
            <DescriptionWrapper $resolved={task.isResolved}>
              <InnerHTMLNormalizer
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(task.text) }}
                $expanded={false}
              />
            </DescriptionWrapper>
          )}

          <TaskItemBottom
            reporterFullName={creator.fullName}
            createdAt={task.createdAt}
            timeStatus={task.timeStatus()}
            subtaskCount={task.subtasks.length > 0 ? task.subtasks.length : undefined}
            attachmentCount={task.fileLinks.length > 0 ? task.fileLinks.length : undefined}
          />

          {task.fileLinks.length > 0 && (
            <AttachmentsBlock
              fileLinks={task.fileLinks}
              margin="16px 0 0"
              hasNotBackground={
                task.timeStatus() === TaskTimeStatus.EXPIRED ||
                task.timeStatus() === TaskTimeStatus.ACTIVE_TODAY
              }
              onDelete={handleDeleteFileLink}
              handleDownloadFile={handleDownloadFile}
            />
          )}
        </FeedItem>
      </FeedItemWrapper>

      {isUpdateModalOpened && (
        <UpdateTaskModal
          id={task.id}
          isOpened={isUpdateModalOpened}
          syncState={syncTask}
          disabledEntityTag
          onDelete={deleteTask}
          onClose={handleHideUpdateModal}
        />
      )}
    </>
  );
});

TaskBlock.displayName = 'TaskBlock';
export { TaskBlock };
