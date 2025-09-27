import type { Nullable } from '@/shared';
import { useDidUpdate } from '@mantine/hooks';
import { useCallback, useContext, useMemo } from 'react';
import { MultichatContext } from './MultichatContext';

interface ShowHandlerChatInfo {
  activeChatId?: Nullable<number>;
  activeProviderId?: Nullable<number>;
}

interface UseMultichatContextResult {
  opened: boolean;
  pageOpened: boolean;
  activeChatId: Nullable<number>;
  activeProviderId: Nullable<number>;
  hide: () => void;
  toggle: () => void;
  show: (chatInfo?: ShowHandlerChatInfo) => void;
  openPage: () => void;
  closePage: () => void;
  setActiveChatId: (chatId: Nullable<number>) => void;
  setActiveProviderId: (providerId: Nullable<number>) => void;

  editMessageId: Nullable<number>;
  setEditMessageId: (messageId: Nullable<number>) => void;
  replyToId: Nullable<number>;
  setReplyToId: (replyId: Nullable<number>) => void;
}

export const useMultichatContext = (): UseMultichatContextResult => {
  const value = useContext(MultichatContext);

  if (!value)
    throw new Error('useMultichatContext must be used within a <MultichatContext.Provider>');

  const {
    opened,
    pageOpened,
    activeChatId,
    activeProviderId,
    setOpened,
    setPageOpened,
    setActiveChatId,
    setActiveProviderId,
    editMessageId,
    setEditMessageId,
    replyToId,
    setReplyToId,
  } = value;

  const toggle = useCallback(() => {
    setOpened(prev => !prev);
  }, [setOpened]);

  const hide = useCallback(() => {
    setOpened(false);
  }, [setOpened]);

  const show = useCallback(
    (chatInfo?: ShowHandlerChatInfo) => {
      if (!chatInfo) return;

      const { activeChatId, activeProviderId } = chatInfo;

      if (activeChatId) setActiveChatId(activeChatId);

      if (activeProviderId) setActiveProviderId(activeProviderId);

      setOpened(true);
    },
    [setOpened, setActiveChatId, setActiveProviderId]
  );

  const openPage = useCallback(() => setPageOpened(true), [setPageOpened]);
  const closePage = useCallback(() => setPageOpened(false), [setPageOpened]);

  useDidUpdate(() => {
    if (!opened) setActiveChatId(null);
  }, [opened]);

  return useMemo(
    () => ({
      opened,
      pageOpened,
      activeChatId,
      activeProviderId,
      hide,
      show,
      toggle,
      openPage,
      closePage,
      setActiveChatId,
      setActiveProviderId,
      editMessageId,
      setEditMessageId,
      replyToId,
      setReplyToId,
    }),
    [
      activeChatId,
      activeProviderId,
      closePage,
      hide,
      openPage,
      opened,
      pageOpened,
      setActiveChatId,
      setActiveProviderId,
      show,
      toggle,
      editMessageId,
      setEditMessageId,
      replyToId,
      setReplyToId,
    ]
  );
};
