import {
  MyInput,
  PencilButton,
  SpanWithEllipsis,
  TruncateMixin,
  debounce,
  type InputModel,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import type { CellContext } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { RefObject, useCallback, useRef, type KeyboardEventHandler } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useOnClickOutside } from 'usehooks-ts';
import { UpdateTaskDto } from '../../../../../../../api';
import { tasksStore } from '../../../../../../../store';
import { SELECTED_TASK_ID_PARAM, type TaskRow } from '../../../../../models';

const Root = styled.div<{ $editVisible: boolean }>`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 8px;

  .workspace__PencilButton--Root {
    opacity: ${p => (p.$editVisible ? 1 : 0)};
    scale: ${p => (p.$editVisible ? 1 : 0)};
  }

  &:hover {
    .workspace__PencilButton--Root {
      opacity: 1;
      scale: 1;
    }
  }

  ${TruncateMixin}
`;

const Title = styled.button<{ $resolved: boolean }>`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: var(--primary-blue);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: ${p =>
      p.$resolved ? 'var(--button-text-graphite-primary-text)' : 'var(--button-text-blue-hover)'};
  }

  &:active {
    color: var(--button-text-blue-active);
  }

  ${p =>
    p.$resolved &&
    css`
      text-decoration: line-through;
      color: var(--button-text-graphite-secondary-text);
    `}

  ${TruncateMixin}
`;

interface Props {
  cellContext: CellContext<TaskRow, InputModel>;
}

const TaskTitleCell = observer((props: Props) => {
  const { cellContext } = props;

  const titleModel = cellContext.getValue();
  const { isResolved, originalTask } = cellContext.row.original;
  const {
    id: taskId,
    userRights: { canEdit },
  } = originalTask;

  const ref = useRef<HTMLDivElement>(null);

  const [, setSearchParams] = useSearchParams();

  const [editMode, { toggle: toggleEditMode, close: hideEditMode }] = useDisclosure(false);

  const handleEnter = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    e => {
      if (e.key !== 'Enter') return;

      hideEditMode();
    },
    [hideEditMode]
  );

  const showUpdateTaskModal = useCallback(() => {
    setSearchParams(prev => {
      prev.set(SELECTED_TASK_ID_PARAM, String(taskId));

      return prev;
    });
  }, [taskId, setSearchParams]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateTaskTitle = useCallback(
    debounce(async (title: string): Promise<void> => {
      if (!titleModel.validate() || !canEdit) return;

      originalTask.title = title;

      try {
        await tasksStore.updateTask({
          taskId,
          dto: UpdateTaskDto.create({ title }),
        });
      } catch (e) {
        throw new Error(`Error while updating task ${originalTask.id} title: ${e}`);
      }
    }, 500),
    [canEdit]
  );

  useOnClickOutside(ref as RefObject<HTMLDivElement>, hideEditMode);

  return (
    <Root ref={ref} $editVisible={editMode}>
      {editMode && canEdit ? (
        <MyInput
          autoFocus
          alwaysActive
          model={titleModel}
          variant="outlined"
          disabled={!canEdit}
          onKeyDown={handleEnter}
          handleChange={debouncedUpdateTaskTitle}
        />
      ) : (
        <Title $resolved={isResolved} onClick={showUpdateTaskModal}>
          <SpanWithEllipsis text={titleModel.value} />
        </Title>
      )}

      {canEdit && <PencilButton onClick={toggleEditMode} />}
    </Root>
  );
});

TaskTitleCell.displayName = 'TaskTitleCell';
export { TaskTitleCell };
