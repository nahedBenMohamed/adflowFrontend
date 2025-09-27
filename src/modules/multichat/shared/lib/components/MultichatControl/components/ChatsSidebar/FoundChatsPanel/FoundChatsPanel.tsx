import { EmptyTableBlock, type Nullable } from '@/shared';
import { Tabs } from '@mantine/core';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  ChatFindByMessageContentFilterDto,
  ChatFindFilterDto,
  ChatFindPersonalFilterDto,
  useFindFullChats,
  useFindFullChatsByMessageContent,
  useFindFullPersonalChats,
} from '../../../../../../../api';
import { renderChatButton } from '../../../../../helpers';
import type { ChatProvider } from '../../../../../models';
import { ProviderTabs } from '../ChatsHeaderProvidersTabs/ChatsHeaderProvidersTabs';
import { ChatsPanelSkeleton } from '../Skeletons/ChatsPanelSkeleton';
import type { FoundChatsGroupProps } from './components';
import { FoundChatsGroup } from './components';

const StyledTabsPanel = styled(Tabs.Panel)`
  height: 100%;
`;

interface ContentProps {
  $loading: boolean;
  $smallView: boolean;
}

const Content = styled.div<ContentProps>`
  height: 100%;

  display: flex;
  flex-direction: column;
  gap: ${p => (p.$loading ? 8 : 16)}px;

  padding: 16px;
  overflow: hidden auto;

  ::-webkit-scrollbar {
    width: 8px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-clip: padding-box;
    border: 2px solid rgba(0, 0, 0, 0);
    background-color: var(--button-text-graphite-secondary-text);
  }
`;

const RenderChatButtonWrapper = styled.div`
  width: 72px;

  padding: 8px 20px;
`;

export interface FoundChatsPanelProps {
  search: string;
  smallView: boolean;
  searchEnabled: boolean;
  providers: ChatProvider[];
  activeChatId: Nullable<number>;
  provider?: ChatProvider;
  activeProviderId?: number;
  setActiveChatId: (chatId: number) => void;
}

type FindType = 'title' | 'message-content' | 'personal';

type ChatFilterMap<U extends FindType> = U extends 'title'
  ? ChatFindFilterDto
  : U extends 'message-content'
    ? ChatFindByMessageContentFilterDto
    : U extends 'personal'
      ? ChatFindPersonalFilterDto
      : never;

type ChatFilterRecord = {
  [K in FindType]: ChatFilterMap<K>;
};

const FoundChatsPanel = (props: FoundChatsPanelProps) => {
  const {
    search,
    smallView,
    searchEnabled,
    providers,
    activeChatId,
    provider,
    activeProviderId,
    setActiveChatId,
  } = props;

  const providerId = provider?.id;

  const { t } = useTranslation('module.multichat', {
    keyPrefix: 'multichat.components.multichat_control',
  });

  const queryEnabled = useMemo<boolean>(
    () => searchEnabled && activeProviderId === provider?.id,
    [activeProviderId, provider, searchEnabled]
  );

  const filters = useMemo<ChatFilterRecord>(
    () => ({
      title: new ChatFindFilterDto({
        providerId,
        title: search,
      }),
      'message-content': new ChatFindByMessageContentFilterDto({
        providerId,
        messageContent: search,
      }),
      personal: new ChatFindPersonalFilterDto({
        providerId,
        fullName: search,
      }),
    }),
    [search, providerId]
  );

  const { data: foundChatsByTitle, isLoading: areFoundChatsByTitleLoading } = useFindFullChats({
    enabled: queryEnabled,
    filter: filters.title,
  });
  const { data: foundPersonalChatsByFullName, isLoading: areFoundPersonalChatsByFullNameLoading } =
    useFindFullPersonalChats({
      enabled: queryEnabled,
      filter: filters.personal,
    });
  const { data: foundChatsByMessageContent, isLoading: areFoundChatsByMessageContentLoading } =
    useFindFullChatsByMessageContent({
      enabled: queryEnabled,
      filter: filters['message-content'],
    });

  const isSearchLoading = useMemo<boolean>(
    () =>
      areFoundChatsByTitleLoading ||
      areFoundPersonalChatsByFullNameLoading ||
      areFoundChatsByMessageContentLoading,
    [
      areFoundChatsByTitleLoading,
      areFoundPersonalChatsByFullNameLoading,
      areFoundChatsByMessageContentLoading,
    ]
  );

  const foundChatsGroupProps = useMemo<Omit<FoundChatsGroupProps, 'title' | 'findChatsResult'>>(
    () => ({
      providers,
      smallView,
      activeChatId,
      setActiveChatId,
    }),
    [smallView, activeChatId, providers, setActiveChatId]
  );

  const nothingFound = useMemo<boolean>(
    () =>
      !isSearchLoading &&
      !foundChatsByTitle?.pages.flatMap(p => p.chats).length &&
      !foundChatsByMessageContent?.pages.flatMap(p => p.chats).length &&
      !foundPersonalChatsByFullName?.pages.flatMap(p => p.chats).length,
    [isSearchLoading, foundChatsByTitle, foundPersonalChatsByFullName, foundChatsByMessageContent]
  );

  return (
    <StyledTabsPanel value={provider ? String(provider.id) : ProviderTabs.ALL_CHATS}>
      <Content $smallView={smallView} $loading={isSearchLoading}>
        {smallView && (
          <RenderChatButtonWrapper>{renderChatButton(provider)}</RenderChatButtonWrapper>
        )}

        {isSearchLoading ? (
          <ChatsPanelSkeleton />
        ) : nothingFound ? (
          <EmptyTableBlock $verticalText={smallView}>{t('not_found')}</EmptyTableBlock>
        ) : (
          <>
            <FoundChatsGroup
              title={t('chats')}
              titleSearch={search}
              {...foundChatsGroupProps}
              findChatsResult={foundChatsByTitle?.pages}
            />

            <FoundChatsGroup
              title={t('messages')}
              {...foundChatsGroupProps}
              messageContentSearch={search}
              findChatsResult={foundChatsByMessageContent?.pages}
            />

            <FoundChatsGroup
              title={t('users')}
              titleSearch={search}
              {...foundChatsGroupProps}
              findChatsResult={foundPersonalChatsByFullName?.pages}
            />
          </>
        )}
      </Content>
    </StyledTabsPanel>
  );
};

export { FoundChatsPanel };
