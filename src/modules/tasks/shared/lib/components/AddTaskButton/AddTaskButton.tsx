import { AddTaskModal } from '@/modules/card';
import { batchRequest, CreateButton, type Nullable } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import type { CreateTaskDto, TaskSettingsIdentifier } from '../../../../api';

interface Props {
  identifier: TaskSettingsIdentifier;
  entityId: Nullable<number>;
  boardId: Nullable<number>;
  handleAddTask: (dto: CreateTaskDto) => Promise<void>;
}

const AddTaskButton = (props: Props) => {
  const { identifier, boardId, entityId, handleAddTask } = props;

  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.common.ui.tasks_page_header',
  });

  const [isAddTaskModalOpened, { close: hideAddTaskModal, open: showAddTaskModal }] =
    useDisclosure(false);

  const onTaskAdd = async (dto: CreateTaskDto): Promise<void> => {
    await handleAddTask(dto);

    hideAddTaskModal();
  };

  const onRepeatingTaskAdd = async (dtos: CreateTaskDto[]): Promise<void> => {
    await batchRequest({
      array: dtos,
      cb: async (dto): Promise<void> => await handleAddTask(dto),
    });

    hideAddTaskModal();
  };

  return (
    <>
      <CreateButton tooltip={t('create_button_tooltip')} onClick={showAddTaskModal} />

      {isAddTaskModalOpened && (
        <AddTaskModal
          identifier={identifier}
          isOpened={isAddTaskModalOpened}
          entityId={entityId}
          boardId={boardId}
          onClose={hideAddTaskModal}
          onTaskAdd={onTaskAdd}
          onRepeatingTaskAdd={onRepeatingTaskAdd}
        />
      )}
    </>
  );
};

export { AddTaskButton };
