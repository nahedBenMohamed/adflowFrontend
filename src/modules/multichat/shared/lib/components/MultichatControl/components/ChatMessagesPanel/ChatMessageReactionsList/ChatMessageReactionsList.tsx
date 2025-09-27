import styled from 'styled-components';
import type { Chat, ChatMessage, ChatUser } from '../../../../../models';
import { ChatMessageReaction } from '../ChatMessageReaction/ChatMessageReaction';

const Root = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

interface Props {
  chat: Chat;
  message: ChatMessage;
  currentChatUser: ChatUser;
}

const ChatMessageReactionsList = (props: Props) => {
  const { chat, message, currentChatUser } = props;

  if (message.reactions.length === 0) return null;

  const groupedMap = new Map<string, number[]>();

  for (const { chatUserId, reaction } of message.reactions) {
    if (!groupedMap.has(reaction)) groupedMap.set(reaction, []);

    groupedMap.get(reaction)!.push(chatUserId);
  }

  const groupedReactions = Array.from(groupedMap.entries()).map(([reaction, chatUserIds]) => ({
    chatUserIds,
    reaction,
  }));

  return (
    <Root>
      {groupedReactions.map(r => (
        <ChatMessageReaction
          key={r.reaction}
          chat={chat}
          message={message}
          currentChatUser={currentChatUser}
          reaction={r}
        />
      ))}
    </Root>
  );
};

export { ChatMessageReactionsList };
