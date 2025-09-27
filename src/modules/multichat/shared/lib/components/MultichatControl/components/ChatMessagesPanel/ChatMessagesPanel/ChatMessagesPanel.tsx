import { useMultichatContext } from '@/modules/multichat';
import type { Nullable, Optional } from '@/shared';
import { useCallback, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { useGetChat, useGetChatMessages } from '../../../../../../../api';
import { type ChatMessage, type ChatProvider } from '../../../../../models';
import { ChatMessagesList, type ChatMessagesListRef } from '../ChatMessagesList/ChatMessagesList';
import { ChatMessagesPanelHeader } from '../ChatMessagesPanelHeader/ChatMessagesPanelHeader';
import { SendChatMessageBlock } from '../SendChatMessageBlock/SendChatMessageBlock';
import { ChatMessagesListSkeleton } from '../Skeletons/ChatMessagesListSkeleton';
import { MessagesPanelHeaderSkeleton } from '../Skeletons/MessagesPanelHeaderSkeleton';

const Root = styled.div<{ $mobileView?: boolean }>`
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background-color: var(--graphite-graphite-20);

  ${p => p.$mobileView && `width: calc(100vw - var(--sidebar-width))`};
`;

interface Props {
  activeChatId: number;
  mobileView?: boolean;
  providers?: ChatProvider[];
  activeProvider?: ChatProvider;
  modalWidth?: string;
  onBack?: () => void;
}

const ChatMessagesPanel = (props: Props) => {
  const { activeChatId, mobileView, providers, activeProvider, modalWidth, onBack } = props;

  const { editMessageId, replyToId } = useMultichatContext();

  const listRef = useRef<ChatMessagesListRef>(null);

  const { data: chat, isLoading: chatLoading } = useGetChat(activeChatId);
  const {
    data: chatMessages,
    isLoading: areMessagesLoading,
    hasNextPage,
    fetchNextPage,
  } = useGetChatMessages(activeChatId);

  const chatProvider = useMemo<Nullable<Optional<ChatProvider>>>(
    () => (chat && providers ? providers.find(p => p.id === chat.providerId) : null),
    [chat, providers]
  );

  const handleOnSend = useCallback(() => {
    listRef.current?.scrollToBottom();
  }, []);

  const editMessage = useMemo<Nullable<ChatMessage>>(() => {
    if (editMessageId && chatMessages) {
      return chatMessages.pages.flatMap(p => p.messages).find(m => m.id === editMessageId) ?? null;
    }

    return null;
  }, [chatMessages, editMessageId]);

  const replyToMessage = useMemo<Nullable<ChatMessage>>(() => {
    if (replyToId && chatMessages) {
      return chatMessages.pages.flatMap(p => p.messages).find(m => m.id === replyToId) ?? null;
    }

    return null;
  }, [chatMessages, replyToId]);

  return (
    <Root $mobileView={mobileView}>
      {chatLoading && <MessagesPanelHeaderSkeleton />}

      {chat && chatProvider && (
        <ChatMessagesPanelHeader
          chat={chat}
          modalWidth={modalWidth}
          mobileView={mobileView}
          chatProvider={chatProvider}
          activeProviderId={activeProvider?.id}
          activeProviderType={activeProvider?.type}
          onBack={onBack}
        />
      )}

      {(areMessagesLoading || chatLoading) && <ChatMessagesListSkeleton />}

      {chat && chatMessages && (
        <ChatMessagesList
          ref={listRef}
          chat={chat}
          hasNextPage={hasNextPage}
          messagesData={chatMessages.pages}
          fetchNextPage={fetchNextPage}
        />
      )}

      <SendChatMessageBlock
        chat={chat}
        chatId={activeChatId}
        editMessage={editMessage}
        replyToMessage={replyToMessage}
        providerId={activeProvider?.id}
        onSend={handleOnSend}
      />
    </Root>
  );
};

export { ChatMessagesPanel };
