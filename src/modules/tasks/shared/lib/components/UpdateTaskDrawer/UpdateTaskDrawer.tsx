import { boardApiUtil, routes, userStore } from '@/app';
import { authStore } from '@/modules/auth';
import { SubtasksBlock, TasksBoardSelector } from '@/modules/card';
import {
  ClearRoundButton,
  CommonFileList,
  FileInput,
  FileUtil,
  FormItem,
  FormItemLabel,
  FunctionalTextEditor,
  InnerHTMLNormalizerMixin,
  InputModel,
  LinkedEntityTag,
  MiniLoader,
  MyDatePickerWithTime,
  MyDrawer,
  MyTextArea,
  PrimaryButton,
  SelectModel,
  UserPicker,
  debounce,
  setCaretToPos,
  useUploadFiles,
  type FileLink,
  type Nullable,
  type Optional,
  type User,
  type UtcDateValue,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import Bowser from 'bowser';
import DOMPurify from 'dompurify';
import { toJS } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from 'react';
import { flushSync } from 'react-dom';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { useOnClickOutside } from 'usehooks-ts';
import { CreateSubtaskDto, UpdateSubtaskDto, UpdateTaskDto } from '../../../../api';
import { TaskCommentsStore, UpdateTaskModalStore, taskSettingsStore } from '../../../../store';
import { CloseCrossIcon, ErrorIcon } from '../../../assets';
import { hasDescriptionUserContent } from '../../helpers';
import {
  TaskFieldCode,
  allTaskFieldCodes,
  type BaseTask,
  type Subtask,
  type TaskSettings,
} from '../../models';
import {
  AddDescriptionPlaceholder,
  CommentsBlock,
  CompleteButton,
  SelectEntityButton,
  TaskControlsBlock,
} from '../TaskItem/TaskItem/components';
import {
  CloseCrossIconWrapper,
  FileInputWrapper,
  IconsBlock,
  MetaInfoWrapper,
  Root,
  TitleBlockWrapper,
  TopControlsWrapper,
} from './UpdateTaskDrawer.styles';
import { UpdateTaskDrawerSkeleton } from './components';

interface TitleProps {
  $resolved: boolean;
  $readonly?: boolean;
  $isSafari?: boolean;
  $isFirefox?: boolean;
}

const TitleWrapper = styled.div`
  min-height: 34px;
`;

const Title = styled.div<TitleProps>`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-break: break-word;
  overflow: hidden;

  font-size: 22px;
  font-weight: 600;
  line-height: 26px;
  color: var(--button-text-graphite-priory-text);

  // to align with the textarea
  margin-bottom: 6px;
  border-bottom: 1.5px solid transparent;

  &:hover {
    cursor: pointer;
  }

  // In Safari we use integer border width because of rendering differences
  // This is needed to prevent layout shift when Title → Textarea
  ${p => p.$isSafari && `border-bottom: 1px solid transparent;`}

  // Same for Firefox — for some reason it has different textarea bottom margin
  ${p => p.$isFirefox && `margin-bottom: 2.5px;`}

  ${p =>
    p.$resolved &&
    css`
      text-decoration: line-through;
      color: var(--button-text-graphite-secondary-text);
    `}

  ${p =>
    p.$readonly &&
    css`
      &:hover {
        cursor: default;
      }

      opacity: 0.8;

      * {
        pointer-events: none;
      }
    `}
`;

const Description = styled.div<{ $disabled: boolean }>`
  &:hover {
    cursor: pointer;
  }

  ${p => p.$disabled && `pointer-events: none`};

  ${InnerHTMLNormalizerMixin}
`;

const SubtasksBlockWrapper = styled.div`
  max-width: 440px;

  padding-left: 16px;
`;

const Reporter = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const ErrorWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: var(--button-text-red-hover);
`;

const ErrorTitle = styled.div`
  font-weight: 600;
  font-size: 24px;
  line-height: 34px;

  margin-top: 16px;
`;

const ErrorMessage = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;

  margin-bottom: 16px;
`;

const ErrorCloseCrossIconWrapper = styled(CloseCrossIconWrapper)`
  position: absolute;
  top: 24px;
  right: 24px;
`;

const CommentsLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LinkedEntityBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

const WrapperWithNegativeMargin = styled.div`
  margin-left: -8px;
`;

const GAP = '8px';
const LABEL_COLOR = 'var(--button-text-graphite-primary-text)';

interface InitialForm {
  title: InputModel;
  text: InputModel;
  subtasks: Subtask[];
  isResolved: boolean;
  endDate: SelectModel;
  startDate: SelectModel;
}

interface Props {
  id: Nullable<number>;
  opened: boolean;
  hide: () => void;
  onDeleteTask: (taskId: number) => void;
  onResolveTask: (task: BaseTask) => void;
  onUpdateTask: ({ taskId, dto }: { taskId: number; dto: UpdateTaskDto }) => void;
}

const UpdateTaskDrawer = observer((props: Props) => {
  const { id, opened, hide, onDeleteTask, onResolveTask, onUpdateTask } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'update_task_modal',
  });

  const titleInputRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const { user: currentUser } = authStore;
  const { activeUsers: users } = userStore;

  const updateTaskModalStore = useMemo(() => new UpdateTaskModalStore(), []);

  const taskCommentsStore = useMemo<Optional<TaskCommentsStore>>(() => {
    if (!id) return;

    return new TaskCommentsStore(id);
  }, [id]);

  const [error, setError] = useState<Nullable<string>>(null);

  const [taskSettings, setTaskSettings] = useState<Nullable<TaskSettings>>(null);

  const {
    task,
    isLoading,
    loadTask,
    updateText,
    updateBoard,
    unpinEntity,
    updateFiles,
    updateTitle,
    updateEntity,
    updateResolved,
    updateSubtasks,
  } = updateTaskModalStore;

  const canEdit = Boolean(task?.userRights.canEdit);
  const canDelete = Boolean(task?.userRights.canDelete);

  const form = useLocalObservable<InitialForm>(() => ({
    subtasks: [],
    isResolved: false,
    text: InputModel.create(),
    endDate: SelectModel.create(),
    startDate: SelectModel.create(),
    title: InputModel.create().required(),
  }));

  const {
    uploadedFiles,
    errorMessages,
    areFilesLoading,
    handleFileEvent,
    resetUploadedFiles,
    deleteUploadedFile,
  } = useUploadFiles();

  const [isTitleInputShown, { close: hideTitleInput, open: showTitleInput }] = useDisclosure(false);
  const [isDescriptionInputShown, { close: hideDescriptionInput, open: showDescriptionInput }] =
    useDisclosure(false);

  const { data: boards } = boardApiUtil.useGetTasksBoards();

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      if (!id) return;

      try {
        await loadTask(id);

        const { task } = updateTaskModalStore;

        if (task) {
          taskCommentsStore?.loadComments();

          const { settingsId, text, title, subtasks, isResolved } = task;

          if (settingsId) {
            const settings = taskSettingsStore.getById(settingsId);

            setTaskSettings(settings);
          }

          form.text.value = text;
          form.title.value = title;
          form.isResolved = isResolved;
          form.subtasks = toJS(subtasks);
          form.endDate.setValue(task.endDate);
          form.startDate.setValue(task.startDate);
        }
      } catch (e) {
        if (e instanceof Error) setError(e.message);
      }
    };

    loadData();
  }, [form, id, updateTaskModalStore, currentUser, taskCommentsStore, loadTask]);

  useEffect(() => {
    const handleUpdateFiles = () => {
      const fileIds = uploadedFiles.map(f => f.fileId);

      updateFiles(fileIds);
      resetUploadedFiles();
    };

    if (uploadedFiles.length > 0) handleUpdateFiles();
  }, [uploadedFiles, resetUploadedFiles, updateFiles]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleUpdateDescription = useCallback(
    debounce(async (): Promise<void> => {
      if (!task || !canEdit) return;

      const text = form.text.value;

      if (text.trim() === task.text) return;

      updateText(text);
    }, 500),
    [task, canEdit]
  );

  const handleShowDescriptionInput = (
    e: MouseEvent<HTMLDivElement> | MouseEvent<HTMLButtonElement>
  ) => {
    // do not open editor if user clicks on a link or can not edit
    if ((e.target as HTMLElement).tagName === 'A' || !canEdit) return;

    showDescriptionInput();
  };

  useOnClickOutside(descriptionRef as RefObject<HTMLDivElement>, e => {
    const target = e.target as HTMLElement;

    // to prevent close when clicked on emoji picker
    if (target.closest('.workspace__MyDropdown--StyledDropdown')) return;

    if (form.text.value.length) hideDescriptionInput();
  });

  useEffect(() => {
    if (!task || !canEdit) return;

    onUpdateTask({ taskId: task.id, dto: UpdateTaskDto.create({ title: form.title.value }) });
  }, [canEdit, form.title.value, onUpdateTask, task]);

  const browser = useMemo<Bowser.Parser.Parser>(
    () => Bowser.getParser(window.navigator.userAgent),
    []
  );

  const isSafari = useMemo<boolean>(() => browser.isBrowser('safari'), [browser]);
  const isFirefox = useMemo<boolean>(() => browser.isBrowser('firefox'), [browser]);

  if (error)
    return (
      <MyDrawer ensurePageSubheader opened={opened} hide={handleApprove}>
        <Root>
          <ErrorWrapper>
            <ErrorCloseCrossIconWrapper>
              <CloseCrossIcon onClick={hide} />
            </ErrorCloseCrossIconWrapper>

            <ErrorIcon />

            <ErrorTitle>{t('not_found')}</ErrorTitle>

            <ErrorMessage>{error}</ErrorMessage>

            <PrimaryButton variant="danger" onClick={hide}>
              {t('close')}
            </PrimaryButton>
          </ErrorWrapper>
        </Root>
      </MyDrawer>
    );

  if (isLoading || !task || !id)
    return (
      <MyDrawer ensurePageSubheader opened={opened} hide={handleApprove}>
        <UpdateTaskDrawerSkeleton />
      </MyDrawer>
    );

  async function handleApprove(): Promise<void> {
    if (!task || !canEdit) {
      hide();

      return;
    }

    hide();

    // updates

    if (task.isResolved !== form.isResolved) {
      if (onResolveTask) {
        onResolveTask(task);
      } else {
        updateResolved(form.isResolved);
      }
    }

    if (form.title.trimmedValue !== task.title && form.title.validate())
      onUpdateTask({
        taskId: task.id,
        dto: UpdateTaskDto.create({ title: form.title.value }),
      });

    // update subtasks only if something changed, this code will likely be refactored in the future
    if (
      JSON.stringify(form.subtasks.filter(s => s.text.trim().length > 0)) !==
      JSON.stringify(task.subtasks.filter(s => s.text.trim().length > 0))
    ) {
      const subtasksDtos = form.subtasks
        // no need to create empty subtasks
        .filter(s => s.text.trim().length > 0)
        .map<CreateSubtaskDto | UpdateSubtaskDto>(s => {
          if (s.id < 0) return CreateSubtaskDto.fromSubtask(s);

          return UpdateSubtaskDto.fromSubtask(s);
        });

      const { subtasks, subtaskCount } = await updateSubtasks({
        taskId: task.id,
        subtasks: subtasksDtos,
      });

      task.subtasks = subtasks;
      task.subtaskCount = subtaskCount;
    }
  }

  const onFileDelete = (file: FileLink) => {
    task.fileLinks = task.fileLinks.filter(f => f.fileInfo.fileId !== file.fileInfo.fileId);
    FileUtil.deleteFileLink(file.id);
  };

  const onTitleClick = () => {
    if (canEdit) {
      // to synchronously update state and show textarea to then be able to set focus on it via ref
      flushSync(() => {
        showTitleInput();
      });

      if (titleInputRef.current) {
        titleInputRef.current.focus();

        setCaretToPos({ textarea: titleInputRef.current, pos: form.title.value.length });
      }
    }
  };

  const handleTitleBlur = () => {
    if (!form.title.validate()) return;

    hideTitleInput();

    form.title.value = form.title.trimmedValue;

    if (form.title.value !== task.title) updateTitle(form.title.value);
  };

  const handleChangeBoard = (boardId: number) => {
    if (canEdit) updateBoard(boardId);
  };

  const handleSelectResponsibleUser = (responsibleUser: User) => {
    if (canEdit)
      onUpdateTask({
        taskId: task.id,
        dto: UpdateTaskDto.create({ responsibleUserId: responsibleUser.id }),
      });
  };

  const handleChangeStartDate = (startDate: UtcDateValue) => {
    if (!canEdit) return;

    if (form.endDate.value && startDate && startDate.isAfterOrEqual(form.endDate.value)) {
      form.endDate.setValue(startDate.endOfDay());

      onUpdateTask({
        taskId: task.id,
        dto: UpdateTaskDto.create({ endDate: startDate ? startDate.formatISO() : null }),
      });
    }

    onUpdateTask({
      taskId: task.id,
      dto: UpdateTaskDto.create({ startDate: startDate ? startDate.formatISO() : null }),
    });
  };

  const handleChangeEndDate = (endDate: UtcDateValue) => {
    if (!canEdit) return;

    if (form.startDate.value && endDate && endDate.isBeforeOrEqual(form.startDate.value)) {
      form.startDate.setValue(endDate.startOfDay());

      onUpdateTask({
        taskId: task.id,
        dto: UpdateTaskDto.create({ startDate: endDate ? endDate.formatISO() : null }),
      });
    }

    onUpdateTask({
      taskId: task.id,
      dto: UpdateTaskDto.create({ endDate: endDate ? endDate.formatISO() : null }),
    });
  };

  const handleResolve = () => {
    if (canEdit) {
      form.isResolved = !form.isResolved;

      onResolveTask(task);
    }
  };

  const handleSelectEntity = async (selectedEntityId: number) => {
    if (canEdit) await updateEntity(selectedEntityId);
  };

  const handleUnpinEntity = async (): Promise<void> => {
    if (canEdit) await unpinEntity();
  };

  const rightBlockHeader = t('reporter', {
    name: userStore.getById(task.createdBy).fullName,
    date: task.createdAt.displayShort(),
    time: task.createdAt.displayTime(),
  });

  const title = form.title.value;

  const activeFields = taskSettings ? taskSettings.activeFields : allTaskFieldCodes;

  const hasEndDate = activeFields.includes(TaskFieldCode.END_DATE);
  const hasSubtasks = activeFields.includes(TaskFieldCode.SUBTASKS);
  const hasBoardName = activeFields.includes(TaskFieldCode.BOARD_NAME);
  const hasStartDate = activeFields.includes(TaskFieldCode.START_DATE);
  const hasDescription = activeFields.includes(TaskFieldCode.DESCRIPTION);

  const showDescriptionPlaceholder = !hasDescriptionUserContent(form.text.value);

  return (
    <MyDrawer ensurePageSubheader opened={opened} hide={handleApprove}>
      <Root>
        <TopControlsWrapper>
          <CompleteButton completed={form.isResolved} disabled={!canEdit} onClick={handleResolve} />

          <IconsBlock>
            <TaskControlsBlock
              taskId={id}
              hideModal={hide}
              onDelete={canDelete ? onDeleteTask : null}
            />

            <CloseCrossIconWrapper>
              <CloseCrossIcon onClick={handleApprove} />
            </CloseCrossIconWrapper>
          </IconsBlock>
        </TopControlsWrapper>

        <TitleBlockWrapper>
          <TitleWrapper>
            {isTitleInputShown ? (
              <MyTextArea
                fontSize="large"
                model={form.title}
                ref={titleInputRef}
                disableAutocomplete
                onBlur={handleTitleBlur}
              />
            ) : (
              <Title
                title={title}
                $readonly={!canEdit}
                $isSafari={isSafari}
                $isFirefox={isFirefox}
                $resolved={form.isResolved}
                onClick={onTitleClick}
              >
                {title}
              </Title>
            )}
          </TitleWrapper>

          <LinkedEntityBlock>
            {task.entityInfo && (
              <LinkedEntityTag
                to={routes.card({
                  entityTypeId: task.entityInfo.entityTypeId,
                  entityId: task.entityInfo.id,
                })}
                $disabled={!task.entityInfo.hasAccess}
              >
                {task.entityInfo.name}
              </LinkedEntityTag>
            )}

            {task.entityInfo && canEdit && <ClearRoundButton onClick={handleUnpinEntity} />}

            {canEdit && (
              <SelectEntityButton
                onSelectEntity={handleSelectEntity}
                selectedEntityId={task.entityInfo ? task.entityInfo.id : null}
              />
            )}
          </LinkedEntityBlock>
        </TitleBlockWrapper>

        <MetaInfoWrapper>
          {hasBoardName && boards && (
            <FormItem readonly={!canEdit} gap={GAP}>
              <FormItemLabel $color={LABEL_COLOR}>{t('board_name')}</FormItemLabel>

              <WrapperWithNegativeMargin>
                <TasksBoardSelector
                  placeholder={t('placeholders.board')}
                  boards={boards}
                  activeBoardId={task.boardId}
                  onBoardSelect={handleChangeBoard}
                />
              </WrapperWithNegativeMargin>
            </FormItem>
          )}

          <FormItem readonly={!canEdit} gap={GAP}>
            <FormItemLabel $color={LABEL_COLOR}>{t('assignee')}</FormItemLabel>

            <UserPicker
              withinPortal
              users={users}
              noActiveShadow
              selectedId={task.responsibleUserId}
              onSelect={handleSelectResponsibleUser}
            />
          </FormItem>

          {hasStartDate && (
            <FormItem readonly={!canEdit} gap={GAP}>
              <FormItemLabel $color={LABEL_COLOR}>{t('start_date')}</FormItemLabel>

              <WrapperWithNegativeMargin>
                <MyDatePickerWithTime
                  withinPortal
                  model={form.startDate}
                  disableDatesAfter={form.endDate.value}
                  handleChange={handleChangeStartDate}
                />
              </WrapperWithNegativeMargin>
            </FormItem>
          )}

          {hasEndDate && (
            <FormItem readonly={!canEdit} gap={GAP}>
              <FormItemLabel $color={LABEL_COLOR}>{t('end_date')}</FormItemLabel>

              <WrapperWithNegativeMargin>
                <MyDatePickerWithTime
                  withinPortal
                  iconType="end"
                  model={form.endDate}
                  disableDatesBefore={form.startDate.value}
                  handleChange={handleChangeEndDate}
                />
              </WrapperWithNegativeMargin>
            </FormItem>
          )}
        </MetaInfoWrapper>

        {hasDescription && (
          <FormItem ref={descriptionRef} gap={GAP} readonlyButLinksClickable={!canEdit}>
            <FormItemLabel $color={LABEL_COLOR}>{t('description')}</FormItemLabel>

            {isDescriptionInputShown ? (
              <FunctionalTextEditor
                autoFocus
                model={form.text}
                showSubControls={canEdit}
                resolved={form.isResolved}
                placeholder={t('enter_description')}
                handleChange={debouncedHandleUpdateDescription}
              />
            ) : showDescriptionPlaceholder ? (
              <AddDescriptionPlaceholder canEdit={canEdit} onClick={handleShowDescriptionInput} />
            ) : (
              <Description
                $disabled={!canEdit}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(form.text.value) }}
                onClick={handleShowDescriptionInput}
              />
            )}
          </FormItem>
        )}

        {hasSubtasks && (
          <FormItem gap={GAP} readonly={!canEdit}>
            <FormItemLabel $color={LABEL_COLOR}>{t('subtasks')}</FormItemLabel>

            <SubtasksBlockWrapper>
              <SubtasksBlock inDrawer preventFocusOnMount subtasks={form.subtasks} />
            </SubtasksBlockWrapper>
          </FormItem>
        )}

        <Reporter>{rightBlockHeader}</Reporter>

        <FormItem gap={GAP} readonly={!canEdit}>
          <FormItemLabel $color={LABEL_COLOR}>{t('files')}</FormItemLabel>

          <FileInputWrapper $hasGap={uploadedFiles.length === 0}>
            <FileInput
              margin="4px 0 0 0"
              hasDelimiter={false}
              showFiles={false}
              files={uploadedFiles}
              errors={errorMessages}
              loading={areFilesLoading}
              title={t('attach_files')}
              onChange={handleFileEvent}
              onDelete={deleteUploadedFile}
            />

            {task.fileLinks.length > 0 && (
              <CommonFileList
                fileLinks={task.fileLinks}
                onDelete={!canEdit ? null : onFileDelete}
              />
            )}
          </FileInputWrapper>
        </FormItem>

        <FormItem gap={GAP}>
          <FormItemLabel as="div" $color={LABEL_COLOR}>
            <CommentsLabelWrapper>
              {t('comments')}

              {taskCommentsStore?.isLoading && (
                <MiniLoader size="small" color="var(--button-text-graphite-secondary-text)" />
              )}
            </CommentsLabelWrapper>
          </FormItemLabel>

          {taskCommentsStore && (
            <CommentsBlock
              comments={taskCommentsStore.comments}
              onAdd={taskCommentsStore.addComment}
              onLike={taskCommentsStore.likeComment}
              onDelete={taskCommentsStore.deleteComment}
              onUpdate={taskCommentsStore.updateComment}
              onUnlike={taskCommentsStore.unlikeComment}
              loadMore={taskCommentsStore.loadMoreComments}
            />
          )}
        </FormItem>
      </Root>
    </MyDrawer>
  );
});

UpdateTaskDrawer.displayName = 'UpdateTaskDrawer';
export { UpdateTaskDrawer };
