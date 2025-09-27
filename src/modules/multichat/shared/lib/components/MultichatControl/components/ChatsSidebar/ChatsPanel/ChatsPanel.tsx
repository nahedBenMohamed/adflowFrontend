import { EmptyTableBlock, type Nullable, type Optional } from '@/shared';
import { Tabs } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useGetChats } from '../../../../../../../api';
import { renderChatButton } from '../../../../../helpers';
import type { ChatProvider, ChatProviderTransport } from '../../../../../models';
import { ProviderTabs } from '../ChatsHeaderProvidersTabs/ChatsHeaderProvidersTabs';
import { ChatsPanelBlock } from '../ChatsPanelBlock/ChatsPanelBlock';
import { ChatsSmallPanelBlock } from '../ChatsSmallPanelBlock/ChatsSmallPanelBlock';
import { ChatsPanelSkeleton } from '../Skeletons/ChatsPanelSkeleton';

const StyledTabsPanel = styled(Tabs.Panel)`
  height: 100%;
`;

const Content = styled.div<{ $smallView: boolean }>`
  height: 100%;

  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 16px;
  overflow: hidden auto;

  ::-webkit-scrollbar {
    width: 8px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border: 2px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    border-radius: 10px;
    background-color: var(--button-text-graphite-secondary-text);
  }
`;

const RenderChatButtonWrapper = styled.div`
  width: 72px;

  padding: 8px 20px;
`;

export interface ChatsPanelProps {
  smallView: boolean;
  providers: ChatProvider[];
  activeChatId: Nullable<number>;
  provider?: ChatProvider;
  activeProviderId?: number;
  setActiveChatId: (chatId: number) => void;
}

const ChatsPanel = (props: ChatsPanelProps) => {
  const { smallView, providers, activeChatId, provider, activeProviderId, setActiveChatId } = props;

  const { t } = useTranslation('module.multichat', {
    keyPrefix: 'multichat.components.multichat_control',
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const queryEnabled = useMemo<boolean>(
    () => activeProviderId === provider?.id,
    [activeProviderId, provider]
  );

  const {
    isLoading,
    hasNextPage,
    data: chatsData,
    fetchNextPage,
  } = useGetChats({ providerId: provider?.id, enabled: queryEnabled });

  const { ref: observerRef, entry } = useIntersection({
    root: containerRef.current,
    rootMargin: '424px',
  });

  const isVisible = entry?.isIntersecting;

  useEffect(() => {
    if (isVisible) fetchNextPage();
  }, [isVisible, fetchNextPage]);

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

  return (
    <StyledTabsPanel value={provider ? String(provider.id) : ProviderTabs.ALL_CHATS}>
      <Content ref={containerRef} $smallView={smallView}>
        {smallView && (
          <RenderChatButtonWrapper>{renderChatButton(provider)}</RenderChatButtonWrapper>
        )}

        {isLoading && <ChatsPanelSkeleton />}

        {!isLoading && (!chatsData || !chatsData.pages.flat().length) && (
          // we specify minHeight for smallView due to weird Safari vertical text behavior
          <EmptyTableBlock $verticalText={smallView} $minHeight={smallView ? '320px' : 0}>
            {t('no_chats_yet')}
          </EmptyTableBlock>
        )}

        {chatsData &&
          chatsData.pages
            .flat()
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
                  active={activeChatId === c.id}
                  providerTransport={providerTransport}
                  onSelect={getActiveChatHandler(c.id)}
                />
              );
            })}

        {hasNextPage && <div ref={observerRef} />}
      </Content>
    </StyledTabsPanel>
  );
};

export { ChatsPanel };
