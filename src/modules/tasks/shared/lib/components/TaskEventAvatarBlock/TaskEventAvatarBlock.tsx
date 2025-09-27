import { userStore } from '@/app';
import type { GanttRecord } from '@/modules/gantt';
import { AvatarCircle, type Avatar, type Nullable } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, type MouseEventHandler } from 'react';
import styled, { css } from 'styled-components';
import { CompleteIcon, DoneIcon } from '../../../assets';
import type { BaseTask } from '../../models';

const Root = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  align-self: flex-start;
`;

const StyledAvatarCircle = styled(AvatarCircle)<{ $active?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  transition: none;

  z-index: 3;

  ${p =>
    p.$active &&
    css`
      opacity: 0;
      visibility: hidden;
    `};
`;

const StyledDoneIcon = styled(DoneIcon)<{ $big?: boolean }>`
  width: ${p => (p.$big ? 24 : 16)}px;
  height: ${p => (p.$big ? 24 : 16)}px;
`;

interface CompleteButtonProps {
  $big?: boolean;
  $active?: boolean;
}

const StyledCompleteIcon = styled(CompleteIcon)<CompleteButtonProps>`
  width: ${p => (p.$big ? 24 : 16)}px;
  height: ${p => (p.$big ? 24 : 16)}px;

  opacity: 1;

  ${p => p.$active && `opacity: 1`};
`;

const CompleteButton = styled.button<CompleteButtonProps>`
  position: absolute;
  top: 0;
  left: 0;

  z-index: 4;

  width: ${p => (p.$big ? 24 : 16)}px;
  height: ${p => (p.$big ? 24 : 16)}px;

  border-radius: 50%;
  background: var(--primary-statuses-white-0);
  opacity: 0;

  ${p => p.$active && `opacity: 1`};

  svg path,
  svg rect {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg {
      path {
        fill: var(--primary-statuses-green-520);
      }

      rect {
        fill: #e6fbda;
        stroke: var(--primary-statuses-green-520);
      }
    }
  }
`;

interface Props {
  task: BaseTask | GanttRecord;
  isHovered: boolean;
  bigAvatar?: boolean;
  avatarHidden?: boolean;
  toggleResolved?: (task: BaseTask) => void;
}

const TaskEventAvatarBlock = observer((props: Props) => {
  const { task, isHovered, bigAvatar, avatarHidden, toggleResolved } = props;

  const handleResolve = useCallback<MouseEventHandler<HTMLButtonElement>>(
    async (e): Promise<void> => {
      e.preventDefault();
      e.stopPropagation();

      if (!task.userRights.canEdit || (task as GanttRecord).entityTypeId) return;

      toggleResolved?.(task as BaseTask);
    },
    [task, toggleResolved]
  );

  const avatar = useMemo<Nullable<Avatar>>(() => {
    const user = userStore.getById(task.responsibleUserId);

    return user.getAvatar();
  }, [task]);

  return (
    <Root>
      {task.isResolved && <StyledDoneIcon $big={bigAvatar} />}

      {task.userRights.canEdit && (
        <CompleteButton
          type="button"
          $big={bigAvatar}
          $active={(isHovered || avatarHidden) && !(task as GanttRecord).entityTypeId}
          onClick={handleResolve}
        >
          <StyledCompleteIcon $big={bigAvatar} />
        </CompleteButton>
      )}

      {avatar && !task.isResolved && (
        <StyledAvatarCircle
          noTransition
          avatar={avatar}
          $active={isHovered}
          size={bigAvatar ? 'small' : 'x-small'}
        />
      )}
    </Root>
  );
});

TaskEventAvatarBlock.displayName = 'TaskEventAvatarBlock';
export { TaskEventAvatarBlock };
