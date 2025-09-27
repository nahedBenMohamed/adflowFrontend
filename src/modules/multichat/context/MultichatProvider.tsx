import { appStore } from '@/app';
import type { Nullable } from '@/shared';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { chatEventHandler } from '../events';
import { MultichatContext, type MultichatContextValue } from './MultichatContext';

interface Props {
  children: ReactNode;
}

const MultichatProvider = observer((props: Props) => {
  const { children } = props;

  const [opened, setOpened] = useState<boolean>(false);
  const [pageOpened, setPageOpened] = useState<boolean>(false);
  const [activeChatId, setActiveChatId] = useState<Nullable<number>>(null);
  const [activeProviderId, setActiveProviderId] = useState<Nullable<number>>(null);
  const [editMessageId, setEditMessageId] = useState<Nullable<number>>(null);
  const [replyToId, setReplyToId] = useState<Nullable<number>>(null);

  const contextValue = useMemo<MultichatContextValue>(
    () => ({
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
    }),
    [opened, pageOpened, activeProviderId, activeChatId, editMessageId, replyToId]
  );

  useEffect(() => {
    when(
      () => appStore.isLoaded,
      () => {
        chatEventHandler.subscribe(contextValue);
      }
    );

    return () => {
      chatEventHandler.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextValue, appStore.isLoaded]);

  return <MultichatContext.Provider value={contextValue}>{children}</MultichatContext.Provider>;
});

export { MultichatProvider };
