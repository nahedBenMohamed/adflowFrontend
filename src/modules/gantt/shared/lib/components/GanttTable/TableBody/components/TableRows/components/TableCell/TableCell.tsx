import { routes, stageApiUtil, userStore } from '@/app';
import { UpdateEntityDto } from '@/modules/section';
import { AccountTreeIcon, Task, UpdateTaskDto, tasksStore } from '@/modules/tasks';
import {
  AvatarCircle,
  EntityApiUtil,
  InputModel,
  LinkedEntityTag,
  MyCheckbox,
  MySelectColored,
  MyUsersSelect,
  NoSelectMixin,
  SelectModel,
  TruncateMixin,
  UriCodingUtil,
  debounce,
  truncateNumber,
  type Avatar,
  type Nullable,
  type Option,
  type ShowHideHandlers,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useRef, type MouseEventHandler } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useGanttContext } from '../../../../../../../../../context';
import {
  GANTT_TABLE_HIDDEN_ATTRIBUTE,
  GANTT_TABLE_RESIZE_EVENT,
  type Bar,
} from '../../../../../../../models';

const Root = styled.div`
  position: relative;

  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  gap: 8px;

  padding: 8px 8px 8px 32px;

  ${NoSelectMixin};
`;

const TaskContent = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 8px;

  overflow-x: clip;
`;

const TitleWrapper = styled.div`
  width: fit-content;
  max-width: 30vw;

  display: flex;
  align-items: center;
  flex-shrink: 0;

  overflow: clip;
`;

interface ContentTextProps {
  $asLink?: boolean;
  $canEdit?: boolean;
  $resolved?: boolean;
}

const ContentText = styled.span<ContentTextProps>`
  display: inline-block;

  max-width: 30vw;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin};

  ${p =>
    p.$canEdit &&
    css`
      &:hover {
        cursor: pointer;
      }
    `}

  ${p =>
    p.$resolved &&
    css`
      font-weight: 400;
      color: var(--button-text-graphite-secondary-text);
      text-decoration: line-through;
    `}

  ${p =>
    p.$asLink &&
    css`
      font-weight: 500;
      color: var(--primary-blue);

      transition: var(--transition-200);

      &:hover {
        color: var(--button-text-blue-hover);
      }

      &:active {
        color: var(--button-text-blue-active);
      }
    `}
`;

const Time = styled.div<{ $resolved?: boolean }>`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  color: var(--button-text-graphite-primary-text);

  ${p =>
    p.$resolved &&
    css`
      font-weight: 400;
      color: var(--button-text-graphite-secondary-text);
    `}
`;

const LinkedItemsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const IconWrapper = styled.div`
  height: 14px;
  width: 14px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const SubtasksCount = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 22px;
  font-variant: tabular-nums;
  color: var(--button-text-graphite-primary-text);
`;

const AvatarWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

interface Props {
  bar: Bar;
}

const TableCell = observer((props: Props) => {
  const { bar } = props;

  const { store, onRowClick, onBarClick, tasksProps, updateResponsibleUser } = useGanttContext();
  const { boardId, selectBar } = store;

  const [isUserDropdownOpened, { open: openUserDropdown, close: closeUserDropdown }] =
    useDisclosure(false);

  const { data: stages, isLoading: areStagesLoading } = stageApiUtil.useGetStagesByBoardId({
    boardId,
  });

  const overflowContainerRef = useRef<HTMLDivElement>(null);

  const { pathname, search } = useLocation();
  const currentPageEncodedUrl = UriCodingUtil.encode(`${pathname}${search}`);

  const record = useMemo(() => bar.record, [bar.record]);

  const form = useLocalObservable(() => ({
    title: InputModel.create(record.title).required(),
    stageId: SelectModel.create(record.stageId).required(),
    responsibleUserId: SelectModel.create(record.responsibleUserId).required(),
  }));

  // change stage in select reactively (can be changed, for example, after resolving task)
  useEffect(() => {
    if (form.stageId.value !== record.stageId) form.stageId.setValue(record.stageId);
  }, [form.stageId, record.stageId]);

  useEffect(() => {
    const handleResize = () => {
      const container = overflowContainerRef.current;

      if (container) {
        const items = container.children;
        const containerRect = container.getBoundingClientRect();

        for (let item of items) {
          const itemRect = item.getBoundingClientRect();

          if (itemRect.right > containerRect.right) {
            item.setAttribute(GANTT_TABLE_HIDDEN_ATTRIBUTE, 'true');
          } else {
            item.removeAttribute(GANTT_TABLE_HIDDEN_ATTRIBUTE);
          }
        }
      }
    };

    handleResize();

    window.addEventListener(GANTT_TABLE_RESIZE_EVENT, debounce(handleResize, 100));

    return () => window.removeEventListener(GANTT_TABLE_RESIZE_EVENT, debounce(handleResize, 100));
  }, []);

  const handleOpenUserDropdown = useCallback(() => {
    openUserDropdown();

    selectBar(bar);
  }, [bar, openUserDropdown, selectBar]);

  const handleCloseUserDropdown = useCallback(() => {
    closeUserDropdown();

    selectBar(null);
  }, [closeUserDropdown, selectBar]);

  const avatar = useMemo<Nullable<Avatar>>(() => {
    if (!record) return null;

    const user = userStore.getById(record.responsibleUserId);

    return user.getAvatar();
  }, [record]);

  const stagesOptions = useMemo<Option<number, { bgColor: string }>[]>(
    () =>
      stages?.map(s => ({
        label: s.name,
        value: s.id,
        extra: {
          bgColor: s.color,
        },
      })) ?? [],
    [stages]
  );

  const handleChangeStage = useCallback(
    async (stageId: number): Promise<void> => {
      if (!record.userRights.canEdit) return;

      record.stageId = stageId;

      if (!record.entityTypeId) {
        try {
          await tasksStore.updateTask({
            taskId: record.id,
            dto: UpdateTaskDto.create({ stageId, boardId }),
          });
        } catch (e) {
          throw new Error(`Error while changing record's ${record.id} stage to ${stageId}: ${e}`);
        }
      } else {
        try {
          await EntityApiUtil.update({
            id: record.id,
            dto: UpdateEntityDto.create({ stageId }),
          });
        } catch (e) {
          throw new Error(`Error while changing record's ${record.id} stage to ${stageId}: ${e}`);
        }
      }
    },
    [record, boardId]
  );

  const handleClick = useCallback<MouseEventHandler<HTMLDivElement>>(
    e => {
      e.stopPropagation();

      if (onRowClick) onRowClick(record);

      if (onBarClick) onBarClick(record);
    },
    [onBarClick, onRowClick, record]
  );

  const handleToggleResolveTask = useCallback(
    () => tasksProps?.toggleResolveTask(Task.fromGanttRecord(record) as Task),
    [record, tasksProps]
  );

  const handleChangeResponsibleUser = useCallback(
    async (userId: number): Promise<void> => await updateResponsibleUser({ id: record.id, userId }),
    [record.id, updateResponsibleUser]
  );

  const userDropdownShowHideHandlers = useMemo<ShowHideHandlers>(
    () => ({
      opened: isUserDropdownOpened,
      show: handleOpenUserDropdown,
      hide: handleCloseUserDropdown,
    }),
    [handleCloseUserDropdown, handleOpenUserDropdown, isUserDropdownOpened]
  );

  const startTime = record.startDate?.format(record.timeFormat);
  const endTime = record.endDate?.format(record.timeFormat);

  const subtaskCount = record.subtaskCount || record.subtasks?.length;

  const showSubtaskCount = subtaskCount !== undefined && subtaskCount > 0;

  return (
    <Root>
      <TaskContent ref={overflowContainerRef}>
        {tasksProps && (
          <MyCheckbox
            gray={record.isResolved}
            checked={record.isResolved}
            disabled={!record.userRights.canEdit}
            onChange={handleToggleResolveTask}
          />
        )}
        <TitleWrapper>
          <ContentText
            $asLink={!tasksProps}
            $resolved={record.isResolved}
            $canEdit={record.userRights.canEdit}
            onClick={handleClick}
          >
            {record.title}
          </ContentText>
        </TitleWrapper>

        {startTime && endTime && (
          <Time $resolved={record.isResolved}>
            {startTime} — {endTime}
          </Time>
        )}

        {record.entityInfo && (
          <LinkedEntityTag
            $small
            $disabled={!record.entityInfo.hasAccess}
            $maxWidth={256}
            $noTransition
            to={routes.card({
              entityTypeId: record.entityInfo.entityTypeId,
              entityId: record.entityInfo.id,
              from: currentPageEncodedUrl,
            })}
          >
            {record.entityInfo.name}
          </LinkedEntityTag>
        )}

        <MySelectColored
          withinPortal
          model={form.stageId}
          loading={areStagesLoading}
          disabled={!record.userRights.canEdit}
          options={stagesOptions}
          variant="filled-small"
          dropdownMinWidth="256px"
          handleChange={handleChangeStage}
        />
      </TaskContent>

      {showSubtaskCount && (
        <LinkedItemsWrapper>
          <IconWrapper>
            <AccountTreeIcon />
          </IconWrapper>

          <SubtasksCount>{truncateNumber({ num: subtaskCount, precision: 3 })}</SubtasksCount>
        </LinkedItemsWrapper>
      )}

      {avatar && (
        <MyUsersSelect
          withinPortal
          fixedDropdownWidth={240}
          users={userStore.activeUsers}
          model={form.responsibleUserId}
          overrideShowHideHandlers={userDropdownShowHideHandlers}
          customButton={
            <AvatarWrapper>
              <AvatarCircle
                size="small"
                avatar={avatar}
                active={isUserDropdownOpened}
                hoverable={record.userRights.canEdit}
              />
            </AvatarWrapper>
          }
          handleChange={handleChangeResponsibleUser}
        />
      )}
    </Root>
  );
});

TableCell.displayName = 'TableCell';
export { TableCell };
