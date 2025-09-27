import { userStore } from '@/app';
import { AvatarCircle } from '@/shared';
import { type ReactNode, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useReactToChatMessage, useUnreactToChatMessage } from '../../../../../../../api';
import type {
  Chat,
  ChatMessage,
  ChatMessageGroupedReaction,
  ChatUser,
} from '../../../../../models';

const Number = styled.div`
  min-width: 12px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 14px;
  font-weight: 600;
  line-height: 14px;
  text-align: center;
  color: var(--button-text-green-active);
  transition: var(--transition-200);
`;

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 16px;
  line-height: 16px;

  padding: 4px 8px;
  background: var(--neutral-green-120);
  border-radius: 16px;
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background: var(--primary-statuses-green-520);

    ${Number} {
      color: var(--primary-statuses-white-0);
    }
  }
`;

interface Props {
  chat: Chat;
  message: ChatMessage;
  currentChatUser: ChatUser;
  reaction: ChatMessageGroupedReaction;
}

const ChatMessageReaction = (props: Props) => {
  const { chat, message, currentChatUser, reaction } = props;

  const { mutate: reactToMessage } = useReactToChatMessage({
    messageId: message.id,
    chatId: message.chatId,
  });

  const { mutate: unreactToMessage } = useUnreactToChatMessage({
    messageId: message.id,
    chatId: message.chatId,
  });

  const userBlock = useMemo<ReactNode>(() => {
    if (reaction.chatUserIds.length > 1) {
      return <Number>{reaction.chatUserIds.length}</Number>;
    } else {
      const chatUser = chat.getChatUser(reaction.chatUserIds[0]!);

      const user = chatUser.userId ? userStore.getById(chatUser.userId) : null;

      if (user) {
        return <AvatarCircle avatar={user.getAvatar()} size="x-small" />;
      } else {
        return <Number>1</Number>;
      }
    }
  }, [chat, reaction.chatUserIds]);

  const handleClick = useCallback(() => {
    if (reaction.chatUserIds.includes(currentChatUser.id)) {
      const userReaction = message.reactions.find(
        r => r.reaction === reaction.reaction && r.chatUserId === currentChatUser.id
      );

      if (userReaction) {
        unreactToMessage(userReaction.id);
      }
    } else {
      reactToMessage(reaction.reaction);
    }
  }, [
    currentChatUser.id,
    message.reactions,
    reactToMessage,
    reaction.chatUserIds,
    reaction.reaction,
    unreactToMessage,
  ]);

  return (
    <Root onClick={handleClick}>
      {reaction.reaction}

      {userBlock}
    </Root>
  );
};

export { ChatMessageReaction };
