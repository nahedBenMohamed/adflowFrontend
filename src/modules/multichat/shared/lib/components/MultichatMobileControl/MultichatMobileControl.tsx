import type { Nullable, Optional } from '@/shared';
import autoAnimate from '@formkit/auto-animate';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { useGetChatProviders } from '../../../../api';
import { useMultichatContext } from '../../../../context';
import type { ChatProvider } from '../../models';
import { ChatMessagesPanel, ChatsSidebar } from '../MultichatControl/components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MultichatMobileControl = () => {
  const { activeChatId, activeProviderId, setActiveChatId, setActiveProviderId } =
    useMultichatContext();

  const rootRef = useRef<HTMLDivElement>(null);

  const { data: providers, isLoading: areProvidersLoading } = useGetChatProviders(0);

  const activeProvider = useMemo<Optional<ChatProvider>>(
    () => providers?.find(p => p.id === activeProviderId),
    [activeProviderId, providers]
  );

  useEffect(() => {
    rootRef.current && autoAnimate(rootRef.current);
  }, []);

  const [isChatPanelOpened, { open: openChatPanel, close: closeChatPanel }] = useDisclosure(false);

  useEffect(() => {
    if (activeChatId && !isChatPanelOpened) openChatPanel();
  }, [activeChatId, isChatPanelOpened, openChatPanel]);

  const handleOpenChat = (id: Nullable<number>) => {
    setActiveChatId(id);

    openChatPanel();
  };

  const handleCloseChat = () => {
    setActiveChatId(null);

    closeChatPanel();
  };

  return (
    <Root ref={rootRef}>
      {!isChatPanelOpened || !activeChatId ? (
        <ChatsSidebar
          mobileView
          providers={providers}
          activeChatId={activeChatId}
          activeProvider={activeProvider}
          areProvidersLoading={areProvidersLoading}
          setActiveChatId={handleOpenChat}
          setActiveProviderId={setActiveProviderId}
        />
      ) : (
        <ChatMessagesPanel
          mobileView
          key={activeChatId}
          providers={providers}
          activeChatId={activeChatId}
          activeProvider={activeProvider}
          onBack={handleCloseChat}
        />
      )}
    </Root>
  );
};
