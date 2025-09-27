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
  MyTextArea,
  OverlayingModal,
  PlannedTimePicker,
  PrimaryButton,
  SelectModel,
  SpanWithEllipsis,
  UserPicker,
  debounce,
  setCaretToPos,
  useUploadFiles,
  type FileLink,
  type Nullable,
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
import { CreateSubtaskDto, UpdateSubtaskDto } from '../../../../../../../api';
import {
  TaskCommentsStore,
  UpdateTaskModalStore,
  taskSettingsStore,
} from '../../../../../../../store';
import { CloseCrossIcon, ErrorIcon } from '../../../../../../assets';
import { hasDescriptionUserContent } from '../../../../../helpers';
import {
  TaskFieldCode,
  allTaskFieldCodes,
  type Subtask,
  type Task,
  type TaskSettings,
} from '../../../../../models';
import { AddDescriptionPlaceholder } from '../AddDescriptionPlaceholder/AddDescriptionPlaceholder';
import { CommentsBlock } from '../Comments/CommentsBlock';
import { CompleteButton } from '../CompleteButton/CompleteButton';
import { SelectEntityButton } from '../SelectEntityButton/SelectEntityButton';
import { UpdateTaskModalSkeleton } from '../Skeletons/UpdateTaskModalSkeleton';
import { TaskControlsBlock } from '../TaskControlsBlock/TaskControlsBlock';
import {
  CloseCrossIconWrapper,
  Delimiter,
  FileInputWrapper,
  IconsBlock,
  LeftBlock,
  LeftBlockHeader,
  RightBlock,
  RightBlockContent,
  RightBlockHeader,
  Root,
} from './UpdateTaskModal.styles';

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
  position: relative;

  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: var(--button-text-red-hover);
`;

const ErrorCloseCrossIconWrapper = styled(CloseCrossIconWrapper)`
  position: absolute;
  top: 24px;
  right: 24px;
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

const CommentsLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LinkedEntityBlock = styled.div`
  height: 24px;

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

interface Props {
  id: number;
  isOpened: boolean;
  currentPageEncodedUrl?: string;
  disabledEntityTag?: boolean;
  onClose: () => void;
  handleToggleResolve?: (task: Task) => void;
  syncState?: (task: Task) => void;
  onDelete?: Nullable<(id: number) => void>;
}

interface InitialForm {
  title: InputModel;
  text: InputModel;
  subtasks: Subtask[];
  isResolved: boolean;
  endDate: SelectModel;
  startDate: SelectModel;
}

const UpdateTaskModal = observer((props: Props) => {
  const {
    id,
    isOpened,
    disabledEntityTag,
    currentPageEncodedUrl,
    onClose,
    onDelete,
    syncState,
    handleToggleResolve,
  } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'update_task_modal',
  });

  const titleInputRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const { user: currentUser } = authStore;
  const { activeUsers: users } = userStore;

  const updateTaskModalStore = useMemo(() => new UpdateTaskModalStore(), []);
  const taskCommentsStore = useMemo(() => new TaskCommentsStore(id), [id]);

  const [error, setError] = useState<Nullable<string>>(null);

  const [taskSettings, setTaskSettings] = useState<Nullable<TaskSettings>>(null);

  const {
    comments,
    isLoading: areCommentsLoading,
    loadComments,
    loadMoreComments,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    unlikeComment,
  } = taskCommentsStore;

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
    updateEndDate,
    updateResolved,
    updateSubtasks,
    updateStartDate,
    updatePlannedTime,
    updateResponsibleUser,
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
      try {
        await loadTask(id);

        const { task } = updateTaskModalStore;

        if (task) {
          loadComments();

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
  }, [form, id, updateTaskModalStore, currentUser, loadComments, loadTask]);

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleChangePlannedTime = useCallback(
    debounce((plannedTime: number) => {
      if (!canEdit || !task) return;

      updatePlannedTime(plannedTime);
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

  const browser = useMemo<Bowser.Parser.Parser>(
    () => Bowser.getParser(window.navigator.userAgent),
    []
  );

  const isSafari = useMemo<boolean>(() => browser.isBrowser('safari'), [browser]);
  const isFirefox = useMemo<boolean>(() => browser.isBrowser('firefox'), [browser]);

  if (error)
    return (
      <OverlayingModal isOpened={isOpened} onClose={handleApprove}>
        <Root $flex>
          <ErrorWrapper>
            <ErrorCloseCrossIconWrapper>
              <CloseCrossIcon onClick={onClose} />
            </ErrorCloseCrossIconWrapper>

            <ErrorIcon />
            <ErrorTitle>{t('not_found')}</ErrorTitle>
            <ErrorMessage>{error}</ErrorMessage>

            <PrimaryButton variant="danger" onClick={onClose}>
              {t('close')}
            </PrimaryButton>
          </ErrorWrapper>
        </Root>
      </OverlayingModal>
    );

  if (isLoading || !task)
    return (
      <OverlayingModal isOpened={isOpened} onClose={handleApprove}>
        <Root>
          <UpdateTaskModalSkeleton />
        </Root>
      </OverlayingModal>
    );

  async function handleApprove(): Promise<void> {
    if (!task || !canEdit) {
      onClose();

      return;
    }

    onClose();

    // updates and state synchronization

    if (task.isResolved !== form.isResolved) {
      if (handleToggleResolve) {
        handleToggleResolve(task);
      } else {
        updateResolved(form.isResolved);
      }
    }

    if (form.title.value.trim() !== task.title && form.title.validate())
      updateTitle(form.title.value);

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

    syncState?.(task);
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

    form.title.value = form.title.value.trim();

    if (form.title.value !== task.title) updateTitle(form.title.value);
  };

  const handleChangeBoard = (boardId: number) => {
    if (canEdit) updateBoard(boardId);
  };

  const handleSelectResponsibleUser = (responsibleUser: User) => {
    if (canEdit) updateResponsibleUser(responsibleUser.id);
  };

  const handleChangeStartDate = (startDate: UtcDateValue) => {
    if (!canEdit) return;

    if (form.endDate.value && startDate && startDate.isAfterOrEqual(form.endDate.value)) {
      form.endDate.setValue(startDate.endOfDay());

      updateEndDate(startDate.endOfDay());
    }

    updateStartDate(startDate);
  };

  const handleChangeEndDate = (endDate: UtcDateValue) => {
    if (!canEdit) return;

    if (form.startDate.value && endDate && endDate.isBeforeOrEqual(form.startDate.value)) {
      form.startDate.setValue(endDate.startOfDay());

      updateStartDate(endDate.startOfDay());
    }

    updateEndDate(endDate);
  };

  const handleResolve = () => {
    if (canEdit) form.isResolved = !form.isResolved;
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
  const hasPlannedTime = activeFields.includes(TaskFieldCode.PLANNED_TIME);

  const showDescriptionPlaceholder = !hasDescriptionUserContent(form.text.value);

  return (
    <OverlayingModal isOpened={isOpened} onClose={handleApprove}>
      <Root>
        <LeftBlock>
          <LeftBlockHeader>
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
                  $resolved={form.isResolved}
                  $isSafari={isSafari}
                  $isFirefox={isFirefox}
                  onClick={onTitleClick}
                >
                  {title}
                </Title>
              )}
            </TitleWrapper>

            <LinkedEntityBlock>
              {task.entityInfo && (
                <LinkedEntityTag
                  $maxWidth="50%"
                  $disabled={!task.entityInfo.hasAccess || disabledEntityTag}
                  to={routes.card({
                    from: currentPageEncodedUrl,
                    entityId: task.entityInfo.id,
                    entityTypeId: task.entityInfo.entityTypeId,
                  })}
                >
                  <SpanWithEllipsis text={task.entityInfo.name} />
                </LinkedEntityTag>
              )}

              {task.entityInfo && canEdit && <ClearRoundButton onClick={handleUnpinEntity} />}

              {canEdit && (
                <SelectEntityButton
                  selectedEntityId={task.entityInfo ? task.entityInfo.id : null}
                  onSelectEntity={handleSelectEntity}
                />
              )}
            </LinkedEntityBlock>
          </LeftBlockHeader>

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
                <SubtasksBlock preventFocusOnMount subtasks={form.subtasks} />
              </SubtasksBlockWrapper>
            </FormItem>
          )}

          <FormItem gap={GAP}>
            <FormItemLabel as="div" $color={LABEL_COLOR}>
              <CommentsLabelWrapper>
                {t('comments')}

                {areCommentsLoading && (
                  <MiniLoader size="small" color="var(--button-text-graphite-secondary-text)" />
                )}
              </CommentsLabelWrapper>
            </FormItemLabel>

            <CommentsBlock
              comments={comments}
              onAdd={addComment}
              onLike={likeComment}
              onDelete={deleteComment}
              onUpdate={updateComment}
              onUnlike={unlikeComment}
              loadMore={loadMoreComments}
            />
          </FormItem>
        </LeftBlock>

        <Delimiter />

        <RightBlock>
          <RightBlockHeader>
            <CompleteButton
              completed={form.isResolved}
              disabled={!canEdit}
              onClick={handleResolve}
            />

            <IconsBlock>
              <TaskControlsBlock
                taskId={id}
                hideModal={onClose}
                onDelete={canDelete && onDelete ? onDelete : null}
              />

              <CloseCrossIconWrapper>
                <CloseCrossIcon onClick={handleApprove} />
              </CloseCrossIconWrapper>
            </IconsBlock>
          </RightBlockHeader>

          <RightBlockContent>
            {task && hasPlannedTime && (
              <FormItem readonly={!canEdit} gap={GAP}>
                <FormItemLabel $color={LABEL_COLOR}>{t('planned_time')}</FormItemLabel>

                <PlannedTimePicker
                  defaultValue={task.plannedTime}
                  changeValue={debouncedHandleChangePlannedTime}
                />
              </FormItem>
            )}

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
          </RightBlockContent>
        </RightBlock>
      </Root>
    </OverlayingModal>
  );
});

UpdateTaskModal.displayName = 'UpdateTaskModal';
export { UpdateTaskModal };
