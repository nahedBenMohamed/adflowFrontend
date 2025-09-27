import { InputModel, debounce, useMobile, type Nullable } from '@/shared';
import { Tabs } from '@mantine/core';
import { useDidUpdate, useResizeObserver } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Panel } from 'react-resizable-panels';
import styled from 'styled-components';
import type { ChatProvider } from '../../../../../models';
import { ProviderTabs } from '../ChatsHeaderProvidersTabs/ChatsHeaderProvidersTabs';
import { ChatsPanel, type ChatsPanelProps } from '../ChatsPanel/ChatsPanel';
import { ChatsSidebarHeader } from '../ChatsSidebarHeader/ChatsSidebarHeader';
import { FoundChatsPanel, type FoundChatsPanelProps } from '../FoundChatsPanel/FoundChatsPanel';

const Root = styled(Panel)`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const MobileRoot = styled.div`
  width: calc(100vw - var(--sidebar-width));

  display: flex;
  flex-direction: column;
  flex: 1;
`;

const StyledTabs = styled(Tabs)<{ $smallView: boolean }>`
  height: 100%;
  width: 100%;

  display: ${p => p.$smallView && `flex`};
`;

const ChatsPanelsWrapper = styled.div<{ $smallView: boolean }>`
  height: ${p => (p.$smallView ? `100%` : `calc(100% - var(--chats-sidebar-header-height))`)};

  flex-grow: ${p => p.$smallView && 1};
`;

interface Props {
  areProvidersLoading: boolean;
  activeChatId: Nullable<number>;
  modalView?: boolean;
  mobileView?: boolean;
  providers?: ChatProvider[];
  activeProvider?: ChatProvider;
  setActiveChatId: (chatId: Nullable<number>) => void;
  setActiveProviderId: (providerId: Nullable<number>) => void;
}

const ChatsSidebar = observer((props: Props) => {
  const {
    areProvidersLoading,
    activeChatId,
    modalView,
    mobileView,
    providers,
    activeProvider,
    setActiveChatId,
    setActiveProviderId,
  } = props;

  const [ref, rect] = useResizeObserver<HTMLDivElement>();

  const [sidebarSmall, setSidebarSmall] = useState(false);

  const searchModel = useLocalObservable(() => InputModel.create());
  const [search, setSearch] = useState('');

  const isMobile = useMobile();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearchChange = useCallback(
    debounce((value: string) => setSearch(value), 750),
    []
  );

  useDidUpdate(() => {
    handleSearchChange(searchModel.value);
  }, [searchModel.value]);

  const trimmedSearch = useMemo<string>(() => search.trim(), [search]);
  const searchEnabled = useMemo<boolean>(() => trimmedSearch.length > 0, [trimmedSearch]);

  useLayoutEffect(() => {
    if (!rect.width) return;

    if (rect.width < 230) {
      setSidebarSmall(true);
    } else {
      setSidebarSmall(false);
    }
  }, [rect.width]);

  const handleTabChange = useCallback(
    (tv: Nullable<string>) => {
      if (!tv || !providers) return;

      const provider = providers.find(p => p.id === Number(tv));

      setActiveProviderId(provider?.id ?? null);
    },
    [providers, setActiveProviderId]
  );

  const foundChatsPanelsCommonProps = useMemo<Omit<FoundChatsPanelProps, 'providers'>>(
    () => ({
      activeChatId,
      searchEnabled,
      search: trimmedSearch,
      smallView: sidebarSmall,
      activeProviderId: activeProvider?.id,
      setActiveChatId,
    }),
    [trimmedSearch, activeChatId, searchEnabled, sidebarSmall, activeProvider, setActiveChatId]
  );

  const chatsPanelsCommonProps = useMemo<Omit<ChatsPanelProps, 'providers'>>(
    () => ({
      activeChatId,
      smallView: sidebarSmall,
      activeProviderId: activeProvider?.id,
      setActiveChatId,
    }),
    [activeChatId, sidebarSmall, activeProvider?.id, setActiveChatId]
  );

  const Content = (
    <StyledTabs
      ref={ref}
      keepMounted={false}
      $smallView={sidebarSmall}
      value={activeProvider ? String(activeProvider.id) : ProviderTabs.ALL_CHATS}
      onChange={handleTabChange}
    >
      <ChatsSidebarHeader
        providers={providers}
        smallView={sidebarSmall}
        searchModel={searchModel}
        activeProvider={activeProvider}
        providersLoading={areProvidersLoading}
      />

      <ChatsPanelsWrapper $smallView={sidebarSmall}>
        {!areProvidersLoading && providers && (
          <>
            {searchEnabled ? (
              <>
                {/* All chats panel */}
                <FoundChatsPanel providers={providers} {...foundChatsPanelsCommonProps} />

                {providers.map(p => (
                  <FoundChatsPanel
                    key={p.id}
                    provider={p}
                    providers={providers}
                    {...foundChatsPanelsCommonProps}
                  />
                ))}
              </>
            ) : (
              <>
                {/* All chats panel */}
                <ChatsPanel providers={providers} {...chatsPanelsCommonProps} />

                {providers.map(p => (
                  <ChatsPanel
                    key={p.id}
                    provider={p}
                    providers={providers}
                    {...chatsPanelsCommonProps}
                  />
                ))}
              </>
            )}
          </>
        )}
      </ChatsPanelsWrapper>
    </StyledTabs>
  );

  if (mobileView) return <MobileRoot>{Content}</MobileRoot>;

  return (
    <Root defaultSize={modalView ? 30 : 38} maxSize={isMobile ? 38 : 50} minSize={20}>
      {Content}
    </Root>
  );
});

export { ChatsSidebar };
