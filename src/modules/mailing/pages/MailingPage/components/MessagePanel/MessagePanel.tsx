import { DropdownScrollbarMixin, MediaBreakpoints, type Nullable } from '@/shared';
import { useIntersection } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { getMockMailMessageInfos, type MailMessageInfo } from '../../../../shared';
import { MessageItem } from '../MessageItem/MessageItem';
import { NoMailboxesPanelBlock } from '../NoMailboxesPanelBlock/NoMailboxesPanelBlock';
import { SearchBlock, type SearchBlockProps } from '../SearchBlock/SearchBlock';
import { MessagePanelSkeleton } from '../Skeletons/MessagePanelSkeleton';

const Root = styled.div<{ $sidebarOpened: boolean }>`
  position: fixed;

  height: calc(100dvh - var(--header-with-subheader-height));
  width: var(--mailing-message-panel-width);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  overflow-x: hidden;
  z-index: 1;

  margin-left: ${p =>
    p.$sidebarOpened
      ? 'var(--mailing-sidebar-width-opened)'
      : 'var(--mailing-sidebar-width-closed)'};

  border-right: 1px solid var(--graphite-graphite-80);
  background-color: var(--graphite-graphite-20);

  transition: var(--transition-200);

  @media ${MediaBreakpoints.SM} {
    position: relative;
    margin-left: 0;
  }
`;

const SearchBlockWrapper = styled.div<{ $hasBorderBottom: boolean }>`
  width: 100%;

  padding: 8px 8px 0;
  border-bottom: 1px solid
    ${p => (p.$hasBorderBottom ? 'var(--graphite-graphite-80)' : 'transparent')};
`;

const List = styled.div`
  position: relative;

  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  overflow: hidden auto;

  ${DropdownScrollbarMixin}

  padding: 0 8px 8px;
`;

const NoMessagesAnnotation = styled.div`
  margin-top: 32px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-secondary-text);
`;

interface Props {
  loading: boolean;
  loadingMore: boolean;
  showDemoMessage: boolean;
  isSidebarOpened: boolean;
  search: Nullable<string>;
  searchProps: SearchBlockProps;
  messagesInfos: MailMessageInfo[];
  currentThreadId: Nullable<string>;
  loadMoreThreads: () => void;
  setCurrentThreadId: (threadId: Nullable<string>) => void;
  loadMessages: ({ mailboxId, messageId }: { mailboxId: number; messageId: number }) => void;
  onSeenThread: ({ mailboxId, messageId }: { mailboxId: number; messageId: number }) => void;
}

const MessagePanel = observer((props: Props) => {
  const {
    loading,
    loadingMore,
    showDemoMessage,
    isSidebarOpened,
    search,
    searchProps,
    messagesInfos,
    currentThreadId,
    loadMoreThreads,
    setCurrentThreadId,
    loadMessages,
    onSeenThread,
  } = props;

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.pages.mailing_page.components.message_panel',
  });

  const mockMailMessageInfos = getMockMailMessageInfos(t);

  const [containerWasScrolled, setContainerWasScrolled] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const { ref: observerRef, entry } = useIntersection({
    root: containerRef.current,
    rootMargin: '496px',
  });

  const isVisible = entry?.isIntersecting;

  useEffect(() => {
    if (isVisible) loadMoreThreads();
  }, [isVisible, loadMoreThreads]);

  const handleScroll = () => {
    // to prevent the blocking of new elements rendering while loading more threads,
    // we utilize setTimeout with a delay of 0
    setTimeout(() => {
      if (containerRef.current?.scrollTop) {
        setContainerWasScrolled(true);
      } else {
        setContainerWasScrolled(false);
      }
    }, 0);
  };

  const loadingMoreWithNewSearchApplied = loadingMore && !messagesInfos.length;
  const showSkeleton = loading || loadingMoreWithNewSearchApplied;

  const messageInfosToDisplay = showDemoMessage ? mockMailMessageInfos : messagesInfos;

  return (
    <Root $sidebarOpened={isSidebarOpened}>
      <SearchBlockWrapper $hasBorderBottom={containerWasScrolled}>
        <SearchBlock {...searchProps} />
      </SearchBlockWrapper>

      <List ref={containerRef} onScroll={handleScroll}>
        {showSkeleton ? (
          <MessagePanelSkeleton />
        ) : (
          <>
            {messageInfosToDisplay.length > 0 ? (
              messageInfosToDisplay.map(mi => (
                <MessageItem
                  key={mi.id}
                  message={mi}
                  search={search}
                  currentThreadId={currentThreadId}
                  active={showDemoMessage ? true : currentThreadId === mi.threadId}
                  loadMessages={loadMessages}
                  onSeenThread={onSeenThread}
                  setCurrentThreadId={setCurrentThreadId}
                />
              ))
            ) : (
              <NoMessagesAnnotation>{t('no_messages')}</NoMessagesAnnotation>
            )}

            {showDemoMessage && <NoMailboxesPanelBlock />}
          </>
        )}

        {/* must be higher than skeleton to prevent looping on small screens! */}
        {messageInfosToDisplay.length > 0 && <div ref={observerRef} />}
      </List>
    </Root>
  );
});

MessagePanel.displayName = 'MessagePanel';
export { MessagePanel };
