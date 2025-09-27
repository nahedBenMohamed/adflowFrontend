import {
  ContextMenu,
  CopyContentIcon,
  PencilMediumIcon,
  TrashbinMediumIcon,
  type ContextMenuItemModel,
} from '@/shared';
import { useClipboard } from '@mantine/hooks';
import { useCallback, useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useDeleteChatMessage } from '../../../../../../../api';
import { useMultichatContext } from '../../../../../../../context';
import { ReplyIcon } from '../../../../../../assets';
import type { ChatMessage, ChatUser } from '../../../../../models';
import { ChatMessageReactionsPanel } from '../ChatMessageReactionsPanel/ChatMessageReactionsPanel';

interface Props {
  children: ReactNode;
  message: ChatMessage;
  currentChatUser: ChatUser;
  isCurrentUserAuthor: boolean;
}

const ChatMessageContextMenu = (props: Props) => {
  const { children, message, currentChatUser, isCurrentUserAuthor } = props;

  const { t } = useTranslation('module.multichat', {
    keyPrefix: 'multichat.components.multichat_control.ui.chat_message_context_menu',
  });

  const { setEditMessageId, setReplyToId } = useMultichatContext();

  const { copy } = useClipboard();

  const { mutate: deleteMessage } = useDeleteChatMessage({
    messageId: message.id,
    chatId: message.chatId,
  });

  const handleEditMessage = useCallback(() => {
    setReplyToId(null);
    setEditMessageId(message.id);
  }, [message.id, setEditMessageId, setReplyToId]);

  const handleCopyMessage = useCallback(() => {
    copy(message.text);
  }, [copy, message.text]);

  const handleReplyToMessage = useCallback(() => {
    setEditMessageId(null);
    setReplyToId(message.id);
  }, [message.id, setEditMessageId, setReplyToId]);

  const items = useMemo<ContextMenuItemModel[]>(() => {
    const menuItems = [
      {
        label: t('reply'),
        icon: <ReplyIcon />,
        onClick: handleReplyToMessage,
      },
      {
        label: t('copy'),
        icon: <CopyContentIcon />,
        onClick: handleCopyMessage,
      },
    ];

    if (isCurrentUserAuthor) {
      menuItems.push(
        ...[
          {
            label: t('edit'),
            icon: <PencilMediumIcon />,
            onClick: handleEditMessage,
          },
          {
            label: t('delete'),
            icon: <TrashbinMediumIcon />,
            onClick: deleteMessage,
          },
        ]
      );
    }

    return menuItems;
  }, [
    isCurrentUserAuthor,
    handleEditMessage,
    handleCopyMessage,
    handleReplyToMessage,
    deleteMessage,
    t,
  ]);

  return (
    <ContextMenu
      items={items}
      topContent={<ChatMessageReactionsPanel message={message} currentChatUser={currentChatUser} />}
    >
      {children}
    </ContextMenu>
  );
};

export { ChatMessageContextMenu };
