import { SpanWithEllipsis, TruncateMixin, type Nullable, type Optional } from '@/shared';
import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import type {
  Chat,
  ChatProvider,
  ChatProviderTransport,
  FindChatsFullResult,
} from '../../../../../../../models';
import { ChatsPanelBlock } from '../../../ChatsPanelBlock/ChatsPanelBlock';
import { ChatsSmallPanelBlock } from '../../../ChatsSmallPanelBlock/ChatsSmallPanelBlock';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ChatTitle = styled.p`
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  text-transform: uppercase;
  color: var(--button-text-graphite-primary-text);

  ${TruncateMixin}
`;

export interface FoundChatsGroupProps {
  title: string;
  smallView: boolean;
  providers: ChatProvider[];
  activeChatId: Nullable<number>;
  titleSearch?: string;
  messageContentSearch?: string;
  findChatsResult?: FindChatsFullResult[];
  setActiveChatId: (chatId: number) => void;
}

const FoundChatsGroup = (props: FoundChatsGroupProps) => {
  const {
    title,
    smallView,
    activeChatId,
    providers,
    titleSearch,
    messageContentSearch,
    findChatsResult,
    setActiveChatId,
  } = props;

  const getProviderTransportById = useCallback(
    (id: number): Optional<ChatProviderTransport> => {
      const provider = providers.find(p => p.id === id);

      if (!provider) {
        console.error(
          `Provider with id ${id} was not found, failed to getProviderTransportById in ChatsPanel`
        );

        return;
      }

      return provider.transport;
    },
    [providers]
  );

  const getActiveChatHandler = useCallback(
    (chatId: number) => () => setActiveChatId(chatId),
    [setActiveChatId]
  );

  const chats = useMemo<Optional<Chat[]>>(
    () => findChatsResult?.flatMap(c => c.chats),
    [findChatsResult]
  );

  if (chats && !chats.length) return null;

  return (
    <Root>
      {!smallView && (
        <ChatTitle>
          <SpanWithEllipsis text={title} />
        </ChatTitle>
      )}

      {chats &&
        chats.length > 0 &&
        chats
          .sort((a, b) => (a.updatedAt.greaterThan(b.updatedAt) ? -1 : 1))
          .map(c => {
            const providerTransport = getProviderTransportById(c.providerId);

            if (!providerTransport) return null;

            return smallView ? (
              <ChatsSmallPanelBlock
                key={c.id}
                chat={c}
                active={activeChatId === c.id}
                providerTransport={providerTransport}
                onSelect={getActiveChatHandler(c.id)}
              />
            ) : (
              <ChatsPanelBlock
                key={c.id}
                chat={c}
                titleSearch={titleSearch}
                active={activeChatId === c.id}
                providerTransport={providerTransport}
                messageContentSearch={messageContentSearch}
                onSelect={getActiveChatHandler(c.id)}
              />
            );
          })}
    </Root>
  );
};

export { FoundChatsGroup };
