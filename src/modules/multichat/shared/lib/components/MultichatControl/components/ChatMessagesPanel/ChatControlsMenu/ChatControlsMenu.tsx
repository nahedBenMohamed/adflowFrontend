import { authStore } from '@/modules/auth';
import { useMarkAllChatMessagesAsRead } from '@/modules/multichat/api/ChatApi/queries/useMarkAllChatMessagesAsRead';
import { DeleteButton, MoreIcon, MyDropdown, WarningModal } from '@/shared';
import { MyDropdownItem } from '@/shared/lib/components/MyDropdown/components/MyDropdownItem/MyDropdownItem';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { useDeleteChat } from '../../../../../../../api';
import { useMultichatContext } from '../../../../../../../context';
import type { Chat } from '../../../../../models';

const MoreIconWrapper = styled.button<{ $active: boolean }>`
  width: 20px;
  height: 20px;

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-green-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-green-active);
    }
  }

  ${p =>
    p.$active &&
    css`
      svg path {
        fill: var(--button-text-green-default);
      }
    `}
`;

const List = styled.div`
  display: flex;
  flex-direction: column;

  padding: 6px 0;
`;

const Option = styled.div<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 8px 12px;
  white-space: nowrap;
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    background-color: #f3fded;

    ${p =>
      p.$danger &&
      css`
        color: var(--button-text-red-default);

        svg path {
          fill: var(--button-text-red-default);
        }
      `}
  }

  &:active {
    background-color: #e6fbda;
  }
`;

interface Props {
  chat: Chat;
}

const ChatControlsMenu = observer((props: Props) => {
  const { chat } = props;

  const { t } = useTranslation('module.multichat', {
    keyPrefix: 'multichat.components.multichat_control.ui.chat_controls_menu',
  });

  const { user: currentUser } = authStore;

  const { setActiveChatId } = useMultichatContext();

  const [menuOpened, { close: hideMenu, open: showMenu }] = useDisclosure(false);
  const [warningModalOpened, { close: hideWarningModal, open: showWarningModal }] =
    useDisclosure(false);

  const { mutate: deleteChat, isPending: isDeleting } = useDeleteChat({
    chatId: chat.id,
    providerId: chat.providerId,
  });

  const { mutate: markAllAsRead } = useMarkAllChatMessagesAsRead(chat);

  const handleDelete = useCallback(() => {
    setActiveChatId(null);

    deleteChat();

    hideWarningModal();
  }, [deleteChat, hideWarningModal, setActiveChatId]);

  const isCurrentUserChatOwnerOrAdmin = currentUser
    ? chat.getIsChatOwnerOrAdminByUserId(currentUser.id)
    : false;

  return (
    <>
      <MyDropdown
        withinPortal
        opened={menuOpened}
        position="bottom-end"
        Button={
          <MoreIconWrapper $active={menuOpened}>
            <MoreIcon />
          </MoreIconWrapper>
        }
        hide={hideMenu}
        show={showMenu}
      >
        <List>
          <Option>
            <MyDropdownItem
              padding={isCurrentUserChatOwnerOrAdmin ? '0 0 0 24px' : '0'}
              active={false}
              title={t('mark_as_read')}
              onClick={markAllAsRead}
            />
          </Option>

          {isCurrentUserChatOwnerOrAdmin && (
            <Option $danger>
              <DeleteButton text={t('delete_chat')} fontWeight={400} onClick={showWarningModal} />
            </Option>
          )}
        </List>
      </MyDropdown>

      {warningModalOpened && (
        <WarningModal
          icon="trashbin"
          height="fit-content"
          maxHeight="100%"
          approveLoading={isDeleting}
          isOpened={warningModalOpened}
          title={t('delete_warning_title')}
          zIndex="calc(var(--dropdown-z-index) + 1)"
          annotation={t('delete_warning_annotation')}
          onClose={hideWarningModal}
          onApprove={handleDelete}
        />
      )}
    </>
  );
});

export { ChatControlsMenu };
