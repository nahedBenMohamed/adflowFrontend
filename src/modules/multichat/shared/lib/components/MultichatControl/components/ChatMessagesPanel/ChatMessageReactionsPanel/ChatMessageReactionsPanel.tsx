import type { ChatMessage, ChatUser } from '@/modules/multichat';
import { useReactToChatMessage, useUnreactToChatMessage } from '@/modules/multichat/api';
import { useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;

  padding: 0 4px;

  border-radius: 16px;
  background: var(--primary-statuses-white-0);
  box-shadow: var(--dropdown-box-shadow);
  z-index: 10000;
`;

const ReactionHovering = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(10deg); }
  50% { transform: rotate(-10deg); }
  75% { transform: rotate(5deg); }
  100% { transform: rotate(0deg); }
`;

const Reaction = styled.div`
  font-size: 20px;
  line-height: 20px;

  padding: 4px;
  border-radius: 50%;
  user-select: none;
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;
    animation: ${ReactionHovering} 0.4s ease-in-out;
  }
`;

const REACTIONS_LIST = ['👍', '👎', '❤️', '🔥', '👏', '😀', '🥰', '🤣'];

interface Props {
  message: ChatMessage;
  currentChatUser: ChatUser;
}

const ChatMessageReactionsPanel = (props: Props) => {
  const { message, currentChatUser } = props;

  const { mutate: reactToMessage } = useReactToChatMessage({
    messageId: message.id,
    chatId: message.chatId,
  });

  const { mutate: unreactToMessage } = useUnreactToChatMessage({
    messageId: message.id,
    chatId: message.chatId,
  });

  const handleReact = useCallback(
    (reaction: string) => {
      const userReaction = message.reactions.find(
        r => r.reaction === reaction && r.chatUserId === currentChatUser.id
      );

      if (userReaction) {
        unreactToMessage(userReaction.id);
      } else {
        reactToMessage(reaction);
      }
    },
    [currentChatUser.id, message.reactions, reactToMessage, unreactToMessage]
  );

  return (
    <Root>
      {REACTIONS_LIST.map(r => (
        <Reaction onClick={() => handleReact(r)}>{r}</Reaction>
      ))}
    </Root>
  );
};

export { ChatMessageReactionsPanel };
