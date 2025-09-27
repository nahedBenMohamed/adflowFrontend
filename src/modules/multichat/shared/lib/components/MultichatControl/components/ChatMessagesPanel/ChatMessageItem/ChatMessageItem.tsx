import { AvatarCircle, MediaBreakpoints } from '@/shared';
import { useIntersection } from '@mantine/hooks';
import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  ReadChatMessageIcon as ReadIcon,
  UnreadChatMessageIcon as UnreadIcon,
} from '../../../../../../assets';
import { parseChatMessageText } from '../../../../../helpers';
import type { Chat, ChatMessage, ChatUser } from '../../../../../models';
import { ChatMessageContextMenu } from '../ChatMessageContextMenu/ChatMessageContextMenu';
import { ChatMessageFileList } from '../ChatMessageFileList/ChatMessageFileList';
import { ChatMessageReactionsList } from '../ChatMessageReactionsList/ChatMessageReactionsList';
import { ChatMessageReplyBlock } from '../ChatMessageReplyBlock/ChatMessageReplyBlock';

export const ChatMessageItemRoot = styled.li`
  display: flex;
  gap: 8px;

  margin-top: 16px;

  &:first-child {
    margin-bottom: 16px;
  }
`;

export const ChatMessageItemContent = styled.div`
  width: fit-content;
  max-width: 440px;

  display: flex;
  flex-direction: column;
  gap: 4px;

  @media ${MediaBreakpoints.SM} {
    max-width: calc(100% - 48px);
  }
`;

const AuthorName = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const MessageBubble = styled.div<{ $currentAuthor: boolean }>`
  width: 100%;
  min-width: 66px;

  display: flex;
  flex-direction: column;

  padding: 8px 12px 4px;
  background-color: ${p =>
    p.$currentAuthor ? 'var(--background-green-20)' : 'var(--primary-statuses-white-0)'};
  box-shadow:
    0 0 2px #eef4fe,
    0 1px 2px #d0daeb;
  border-radius: 0 12px 12px;
`;

const MessageTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MessageText = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  white-space: pre-wrap;
  overflow-wrap: break-word;

  a {
    color: var(--button-text-blue-default);
    transition: var(--transition-200);

    &:hover {
      cursor: pointer;

      color: var(--button-text-blue-hover);
    }

    &:active {
      color: var(--button-text-blue-active);
    }

    &:visited {
      color: var(--primary-statuses-fuchsia-400);
    }
  }
`;

const MessageBubbleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const InfoIconWrapper = styled.div`
  height: 14px;
  width: 14px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Timestamp = styled.span`
  margin-left: auto;

  font-weight: 400;
  font-size: 10px;
  line-height: 14px;
  color: var(--button-text-graphite-primary-text);
`;

interface Props {
  message: ChatMessage;
  chat: Chat;
  currentChatUser: ChatUser;
  setMarkAsReadIds: Dispatch<SetStateAction<number[]>>;
}

const ChatMessageItem = (props: Props) => {
  const { message, chat, currentChatUser, setMarkAsReadIds } = props;

  const { t } = useTranslation('module.multichat', {
    keyPrefix: 'multichat.components.multichat_control.ui.chat_message_item',
  });

  const { ref, entry } = useIntersection();
  const isIntersecting = entry?.isIntersecting;

  const wasSeenByCurrent = message.wasMessageSeenByCurrent(currentChatUser.id);
  const wasSeenByOthers = message.wasMessageSeenByOthers(currentChatUser.id);

  const author = chat.getChatUser(message.chatUserId);
  const isCurrentUserAuthor = Boolean(
    author.userId && currentChatUser.userId && author.userId === currentChatUser.userId
  );

  useEffect(() => {
    if (isIntersecting && !wasSeenByCurrent && !isCurrentUserAuthor)
      setMarkAsReadIds(prev => [...prev, message.id]);
  }, [isIntersecting, wasSeenByCurrent, message.id, isCurrentUserAuthor, setMarkAsReadIds]);

  return (
    <ChatMessageItemRoot ref={ref} data-id={message.id}>
      <AvatarCircle size="large" avatar={author.getAvatar()} />

      <ChatMessageItemContent>
        <AuthorName>{isCurrentUserAuthor ? t('you') : author.fullName}</AuthorName>

        <ChatMessageContextMenu
          message={message}
          currentChatUser={currentChatUser}
          isCurrentUserAuthor={isCurrentUserAuthor}
        >
          <MessageBubble $currentAuthor={isCurrentUserAuthor}>
            <MessageTextWrapper>
              {message.replyTo && <ChatMessageReplyBlock chat={chat} message={message.replyTo} />}

              {message.files.length > 0 && (
                <ChatMessageFileList
                  canDownloadFiles
                  files={message.files}
                  mediaFileWidth="416px"
                />
              )}

              <MessageText>{parseChatMessageText(message.text)}</MessageText>

              <ChatMessageReactionsList
                chat={chat}
                message={message}
                currentChatUser={currentChatUser}
              />
            </MessageTextWrapper>

            <MessageBubbleInfo>
              <Timestamp>{message.createdAt.displayTime()}</Timestamp>

              {isCurrentUserAuthor && (
                <InfoIconWrapper>{wasSeenByOthers ? <ReadIcon /> : <UnreadIcon />}</InfoIconWrapper>
              )}
            </MessageBubbleInfo>
          </MessageBubble>
        </ChatMessageContextMenu>
      </ChatMessageItemContent>
    </ChatMessageItemRoot>
  );
};

export { ChatMessageItem };
