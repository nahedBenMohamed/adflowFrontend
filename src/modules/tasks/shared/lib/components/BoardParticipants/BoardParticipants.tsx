import { UpdateBoardDto, boardApiUtil, userStore } from '@/app';
import {
  MultiselectModel,
  ParticipantsAvatarRows,
  UsersMultiselectDropdown,
  debounce,
  type Board,
  type Optional,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { ShareIcon } from '../../../assets';

const ShareButton = styled.button`
  height: 32px;

  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--primary-statuses-green-520);

  border-radius: 16px;
  padding: 8px 16px 8px 12px;
  border: 1px solid var(--primary-statuses-green-520);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;
  }
`;

interface RootProps {
  $active: boolean;
  $disabled: boolean;
}

const Root = styled.div<RootProps>`
  display: flex;
  align-items: center;
  gap: 16px;

  transition: var(--transition-200);

  ${p => p.$disabled && `pointer-events: none`};

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    ${p =>
      !p.$active &&
      css`
        ${ShareButton} {
          color: var(--button-text-green-hover);

          background: #f4f8f1;
          border-color: var(--button-text-green-hover);
        }

        svg path {
          &:not(.workspace__ClearParticipantIcon--path) {
            fill: var(--button-text-green-hover);
          }
        }
      `}
  }

  ${p =>
    p.$active &&
    css`
      ${ShareButton} {
        color: var(--button-text-green-active);

        border-color: var(--button-text-green-active);
      }

      svg path {
        &:not(.workspace__ClearParticipantIcon--path) {
          fill: var(--button-text-green-active);
        }
      }
    `}
`;

interface Props {
  board: Optional<Board>;
}

const BoardParticipants = observer((props: Props) => {
  const { board } = props;

  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.common.ui.tasks_page_header',
  });

  const participantsModel = useLocalObservable(() =>
    MultiselectModel.create(board?.participantIds ?? [])
  );

  const [opened, { close, open }] = useDisclosure(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDebouncedUpdate = useCallback(
    debounce(() => {
      if (board) {
        const dto = new UpdateBoardDto({ participantIds: participantsModel.values });

        boardApiUtil.updateBoard({ dto, boardId: board.id });
      }
    }, 500),
    [board, participantsModel]
  );

  const canEdit = board?.userRights.canEdit;

  // For now, only Tasks Board is system
  if (!board || board.isSystem) return null;

  return (
    <UsersMultiselectDropdown
      width={248}
      withinPortal
      opened={opened}
      disabled={!canEdit}
      model={participantsModel}
      users={userStore.activeUsers}
      hide={close}
      show={open}
      handleChange={handleDebouncedUpdate}
    >
      <Root $active={opened} $disabled={!canEdit}>
        {participantsModel.values.length ? (
          <ParticipantsAvatarRows
            maxAvatarCount={2}
            model={participantsModel}
            onChange={handleDebouncedUpdate}
          />
        ) : null}

        {canEdit && (
          <ShareButton>
            <ShareIcon />
            {t('user_select_button')}
          </ShareButton>
        )}
      </Root>
    </UsersMultiselectDropdown>
  );
});

BoardParticipants.displayName = 'BoardParticipants';
export { BoardParticipants };
