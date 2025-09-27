import { authStore } from '@/modules/auth';
import { debounce, DropdownScrollbarMixin, MediaBreakpoints } from '@/shared';
import { useIntersection } from '@mantine/hooks';
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type Ref,
} from 'react';
import styled from 'styled-components';
import { useUpdateChatMessagesStatus } from '../../../../../../../api';
import { getMessagesGroups } from '../../../../../helpers';
import {
  ChatMessageStatus,
  type Chat,
  type ChatMessagesResult,
  type MessagesGroup,
} from '../../../../../models';
import { ChatMessageItem } from '../ChatMessageItem/ChatMessageItem';

export const ChatMessagesListRoot = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column-reverse;

  overflow-y: auto;

  ${DropdownScrollbarMixin};

  padding: 0 32px;

  @media ${MediaBreakpoints.SM} {
    padding: 0 16px;
  }
`;

const MessagesGroup = styled.ul`
  display: flex;
  flex-direction: column-reverse;
`;

const DateWrapper = styled.div<{ $withMargin: boolean }>`
  position: sticky;
  top: 16px;

  display: flex;
  justify-content: center;

  margin: ${p => (p.$withMargin ? '16px 0' : '0 0 16px')};
`;

const Date = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: var(--button-text-graphite-primary-text);

  opacity: 0.8;
  padding: 4px 12px;
  border-radius: 24px;
  background: var(--graphite-graphite-80);
`;

export interface ChatMessagesListRef {
  scrollToBottom: () => void;
}

interface Props {
  ref?: Ref<ChatMessagesListRef>;
  chat: Chat;
  messagesData: ChatMessagesResult[];
  hasNextPage?: boolean;
  fetchNextPage: () => void;
}

const ChatMessagesList = (props: Props) => {
  const { ref, chat, messagesData, hasNextPage, fetchNextPage } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  const { mutate: batchUpdateSeen } = useUpdateChatMessagesStatus({
    chatId: chat.id,
    providerId: chat.providerId,
    status: ChatMessageStatus.SEEN,
  });

  const [markAsReadIds, setMarkAsReadIds] = useState<number[]>([]);

  useImperativeHandle(ref, () => ({
    scrollToBottom: () => {
      containerRef.current?.scrollTo({
        top: containerRef.current?.scrollHeight,
        behavior: 'auto',
      });
    },
  }));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    debounce((markAsReadIds: number[]) => {
      batchUpdateSeen(markAsReadIds);

      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setMarkAsReadIds([]);
    }, 500),
    []
  );

  useEffect(() => {
    if (markAsReadIds.length > 0) debouncedUpdate(markAsReadIds);
  }, [markAsReadIds, debouncedUpdate]);

  const { ref: observerRef, entry } = useIntersection({
    root: containerRef.current,
    rootMargin: '424px',
  });

  const isVisible = entry?.isIntersecting;
  const currentUserId = authStore.user?.id;

  useEffect(() => {
    if (isVisible) fetchNextPage();
  }, [isVisible, fetchNextPage]);

  const msGroups = useMemo<MessagesGroup[]>(() => getMessagesGroups(messagesData), [messagesData]);

  return (
    <ChatMessagesListRoot ref={containerRef}>
      {currentUserId &&
        msGroups.map((g, idx) => (
          <MessagesGroup key={g.date.toString()}>
            {g.ms.map(m => (
              <ChatMessageItem
                key={m.id}
                message={m}
                chat={chat}
                setMarkAsReadIds={setMarkAsReadIds}
                currentChatUser={chat.getChatUserByUserId(currentUserId)}
              />
            ))}
            <DateWrapper $withMargin={idx === msGroups.length - 1}>
              <Date>{g.date.displayLong()}</Date>
            </DateWrapper>
          </MessagesGroup>
        ))}

      {hasNextPage && <div ref={observerRef} />}
    </ChatMessagesListRoot>
  );
};

export { ChatMessagesList };
