import { boardApiUtil, userStore } from '@/app';
import { authStore } from '@/modules/auth';
import {
  CreateSubtaskDto,
  RepeatingTaskInterval,
  TaskFieldCode,
  UpdateTaskSettingsDto,
  getRepeatingTaskDatesByInterval,
  taskSettingsStore,
  useGetRepeatingTasksIntervalOptions,
  type AddTaskPreset,
  type CreateTaskDto,
  type Subtask,
  type TaskSettings,
  type TaskSettingsIdentifier,
} from '@/modules/tasks';
import {
  DialogModalSecondary,
  FunctionalTextEditor,
  InputModel,
  ModalLoader,
  MyDatePickerWithTime,
  MyFloatingTooltip,
  MyInputNumber,
  MySelect,
  MyTextArea,
  NumberModel,
  PlannedTimePicker,
  SelectModel,
  UserPicker,
  useErrorMessageIdle,
  useUploadFiles,
  type Nullable,
  type Optional,
  type User,
  type UtcDateValue,
} from '@/shared';
import { FocusTrap } from '@mantine/core';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AddTaskModalHeader } from '../AddTaskModalHeader/AddTaskModalHeader';
import { SubtasksBlock } from '../Subtask/SubtasksBlock';
import { TasksBoardSelector } from '../TasksBoardSelector/TasksBoardSelector';
import { AddTaskModalFormItem } from './components';

const Root = styled.div`
  padding: 24px 32px 22px;
`;

const FormWrapper = styled.div`
  display: grid;
  grid-template-columns: 47.5% 47.5%;
  column-gap: 5%;
  row-gap: 24px;
`;

const RowWrapper = styled.div`
  display: grid;
  grid-template-columns: 47.5% 47.5%;
  column-gap: 5%;

  grid-column: 1 / 3;
`;

const WrapperWithNegativeMargin = styled.div`
  margin-left: -8px;
`;

export enum OpenedFrom {
  DEFAULT = 'default',
  COMMON_ENTITY_CARD = 'common_entity_card',
  PROJECT_ENTITY_CARD = 'project_entity_card',
}

interface Props {
  isOpened: boolean;
  entityId: Nullable<number>;
  identifier: TaskSettingsIdentifier;
  initialText?: string;
  openedFrom?: OpenedFrom;
  boardId?: Nullable<number>;
  preset?: Nullable<AddTaskPreset>;
  onClose: () => void;
  onTaskAdd: (dto: CreateTaskDto) => Promise<void> | Promise<boolean>;
  onRepeatingTaskAdd?: (dtos: CreateTaskDto[]) => Promise<void> | Promise<boolean>;
}

interface InitialForm {
  text: InputModel;
  title: InputModel;
  subtasks: Subtask[];
  endDate: SelectModel;
  responsibleUser: User;
  startDate: SelectModel;
  boardId: Nullable<number>;
  plannedTime: Nullable<number>;
  repeatingTasksCount: NumberModel;
  repeatingTasksInterval: SelectModel;
}

const AddTaskModal = observer((props: Props) => {
  const {
    isOpened,
    entityId,
    identifier,
    boardId,
    initialText,
    preset,
    openedFrom = OpenedFrom.DEFAULT,
    onClose,
    onTaskAdd,
    onRepeatingTaskAdd,
  } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed.add_task_modal',
  });

  const users = userStore.activeUsers;
  const { user: currentUser } = authStore;

  const { data: boards } = boardApiUtil.useGetTasksBoards();

  const {
    areFilesLoading,
    uploadedFiles,
    errorMessages,
    deleteUploadedFile,
    resetUploadedFiles,
    handleFileEvent,
  } = useUploadFiles();

  const [isTaskAdding, setIsTaskAdding] = useState(false);
  const [taskSettings, setTaskSettings] = useState<Nullable<TaskSettings>>(null);

  const { error: datesError, idle: datesErrorIdle } = useErrorMessageIdle(t('dates_error'), 7000);

  const intervalOptions = useGetRepeatingTasksIntervalOptions();

  const form = useLocalObservable<InitialForm>(() => ({
    subtasks: [],
    plannedTime: null,
    boardId: boardId || null,
    text: InputModel.create(initialText),
    title: InputModel.create().required(),
    repeatingTasksCount: NumberModel.create(0),
    endDate: SelectModel.create(preset?.endDate),
    startDate: SelectModel.create(preset?.startDate),
    repeatingTasksInterval: SelectModel.create(RepeatingTaskInterval.NONE),
    responsibleUser: currentUser ? currentUser : userStore.firstActiveUser,
  }));

  const onSelectResponsibleUser = (user: User) => (form.responsibleUser = user);

  const onSubmit = async (): Promise<void> => {
    if (!form.title.validate() || form.repeatingTasksCount.valueOrZero > 50) return;

    const createSubtasksDtos = form.subtasks
      .filter(s => s.text.trim().length > 0)
      .map<CreateSubtaskDto>(CreateSubtaskDto.fromSubtask);

    const boardId = form.boardId;

    const settingsId = (await taskSettingsStore.findOrCreateByIdentifier(identifier)).id;

    const endDate = form.endDate.value as UtcDateValue;
    const startDate = form.startDate.value as UtcDateValue;

    if (endDate && startDate && endDate.isBeforeOrEqual(startDate)) {
      datesErrorIdle();

      return;
    }

    const dto: CreateTaskDto = {
      boardId,
      entityId,
      settingsId,
      text: form.text.value,
      subtasks: createSubtasksDtos,
      title: form.title.trimmedValue,
      endDate: endDate?.formatISO() ?? null,
      startDate: startDate?.formatISO() ?? null,
      responsibleUserId: form.responsibleUser.id,
      fileIds: uploadedFiles.map<string>(f => f.fileId),
      // planned time can't be 0, in this case we send null instead
      plannedTime: form.plannedTime ? form.plannedTime : null,
    };

    try {
      setIsTaskAdding(true);

      let success: Optional<boolean>;

      if (form.repeatingTasksCount.valueOrZero > 0) {
        success =
          (await onRepeatingTaskAdd?.(
            getRepeatingTaskDatesByInterval({
              dto,
              count: form.repeatingTasksCount.valueOrZero,
              interval: form.repeatingTasksInterval.value,
            })
          )) ?? undefined;
      } else {
        success = (await onTaskAdd(dto)) ?? undefined;
      }

      if (success !== false) {
        resetUploadedFiles();

        onClose();
      }
    } catch (e) {
      throw new Error(`Failed to create new task ${form.title}: ${e}`);
    } finally {
      setIsTaskAdding(false);
    }
  };

  useEffect(() => {
    const getTaskSettings = async (): Promise<void> => {
      const taskSettings = await taskSettingsStore.findOrCreateByIdentifier(identifier);

      setTaskSettings(taskSettings);
    };

    getTaskSettings();
  }, [identifier]);

  if (!taskSettings) return <ModalLoader />;

  const activeFields = taskSettings.activeFields;

  const handleSelectSettings = async (activeFields: string[]): Promise<void> => {
    const updatedTaskSettings = await taskSettingsStore.updateTaskSettings({
      id: taskSettings.id,
      dto: new UpdateTaskSettingsDto(activeFields as TaskFieldCode[]),
    });
    setTaskSettings(updatedTaskSettings);
  };

  const hasEndDate = activeFields.includes(TaskFieldCode.END_DATE);
  const hasSubtasks = activeFields.includes(TaskFieldCode.SUBTASKS);
  const hasBoardName = activeFields.includes(TaskFieldCode.BOARD_NAME);
  const hasStartDate = activeFields.includes(TaskFieldCode.START_DATE);
  const hasDescription = activeFields.includes(TaskFieldCode.DESCRIPTION);
  const hasPlannedTime = activeFields.includes(TaskFieldCode.PLANNED_TIME);

  return (
    <DialogModalSecondary
      width="650px"
      maxHeight="730px"
      isOpened={isOpened}
      loading={isTaskAdding}
      errorMessage={datesError}
      approveDisabled={areFilesLoading || isTaskAdding}
      Header={<AddTaskModalHeader activeFields={activeFields} onSelect={handleSelectSettings} />}
      onClose={onClose}
      onApprove={onSubmit}
    >
      <Root>
        <FocusTrap>
          <FormWrapper>
            <AddTaskModalFormItem gridColumn="1 / 3" label={t('task_name')}>
              <MyTextArea fontSize="large" model={form.title} placeholder={t('placeholder')} />
            </AddTaskModalFormItem>

            {hasPlannedTime && (
              <AddTaskModalFormItem gridColumn="1 / 3" label={t('planned_time')}>
                <PlannedTimePicker
                  changeValue={newPlannedTime => (form.plannedTime = newPlannedTime)}
                />
              </AddTaskModalFormItem>
            )}

            <RowWrapper>
              <AddTaskModalFormItem label={t('assignee')}>
                <UserPicker
                  withinPortal
                  users={users}
                  noActiveShadow
                  selectedId={form.responsibleUser.id}
                  onSelect={onSelectResponsibleUser}
                />
              </AddTaskModalFormItem>

              {hasBoardName && boards && (
                <AddTaskModalFormItem label={t('board_name')}>
                  <WrapperWithNegativeMargin>
                    <TasksBoardSelector
                      boards={boards}
                      activeBoardId={form.boardId}
                      placeholder={t('placeholders.board')}
                      disabled={openedFrom === OpenedFrom.PROJECT_ENTITY_CARD}
                      onBoardSelect={boardId => (form.boardId = boardId)}
                    />
                  </WrapperWithNegativeMargin>
                </AddTaskModalFormItem>
              )}
            </RowWrapper>

            {(hasStartDate || hasEndDate) && (
              <RowWrapper>
                {hasStartDate && (
                  <AddTaskModalFormItem label={t('start_date')}>
                    <WrapperWithNegativeMargin>
                      <MyDatePickerWithTime
                        withinPortal
                        model={form.startDate}
                        disableDatesAfter={form.endDate.value}
                      />
                    </WrapperWithNegativeMargin>
                  </AddTaskModalFormItem>
                )}

                {hasEndDate && (
                  <AddTaskModalFormItem label={t('end_date')}>
                    <WrapperWithNegativeMargin>
                      <MyDatePickerWithTime
                        withinPortal
                        iconType="end"
                        model={form.endDate}
                        disableDatesBefore={form.startDate.value}
                      />
                    </WrapperWithNegativeMargin>
                  </AddTaskModalFormItem>
                )}
              </RowWrapper>
            )}

            {hasDescription && (
              <AddTaskModalFormItem gridColumn="1 / 3" label={t('description')}>
                <FunctionalTextEditor
                  placeholder="..."
                  model={form.text}
                  fileProps={{
                    files: uploadedFiles,
                    fileErrors: errorMessages,
                    filesLoading: areFilesLoading,
                    onFileChange: handleFileEvent,
                    onFileDelete: deleteUploadedFile,
                  }}
                />
              </AddTaskModalFormItem>
            )}

            {hasSubtasks && (
              <AddTaskModalFormItem gridColumn="1 / 3" label={t('subtasks')} minHeight="90px">
                <SubtasksBlock subtasks={form.subtasks} />
              </AddTaskModalFormItem>
            )}

            {Boolean(onRepeatingTaskAdd) && (
              <AddTaskModalFormItem
                gridColumn="1 / 3"
                bold
                label={t('repeating_task.title')}
                hint={t('repeating_task.hint')}
              >
                <RowWrapper>
                  <AddTaskModalFormItem label={t('repeating_task.count')}>
                    <MyInputNumber
                      min={1}
                      max={50}
                      width="75%"
                      variant="outlined"
                      invalid={
                        form.repeatingTasksCount.valueOrZero < 0 ||
                        form.repeatingTasksCount.valueOrZero > 50
                      }
                      model={form.repeatingTasksCount}
                    />
                  </AddTaskModalFormItem>

                  <MyFloatingTooltip
                    withinPortal
                    zIndex={1051}
                    label={t('repeating_task.interval_disabled_tooltip')}
                    disabled={Boolean(form.startDate.value || form.endDate.value)}
                  >
                    <div>
                      <AddTaskModalFormItem label={t('repeating_task.interval')}>
                        <MySelect
                          width="75%"
                          withinPortal
                          options={intervalOptions}
                          disabled={!(form.startDate.value || form.endDate.value)}
                          model={form.repeatingTasksInterval}
                          variant="outlined-without-active-shadow"
                        />
                      </AddTaskModalFormItem>
                    </div>
                  </MyFloatingTooltip>
                </RowWrapper>
              </AddTaskModalFormItem>
            )}
          </FormWrapper>
        </FocusTrap>
      </Root>
    </DialogModalSecondary>
  );
});

AddTaskModal.displayName = 'AddTaskModal';
export { AddTaskModal };
