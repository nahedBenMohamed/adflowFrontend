import type { Optional } from '@/shared';
import { useMemo } from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import styled from 'styled-components';
import { useGetChatProviders } from '../../../../api';
import { useMultichatContext } from '../../../../context';
import type { ChatProvider } from '../../models';
import {
  ChatMessagesPanel,
  ChatsSidebar,
  MultichatControlHeader,
  NoSelectedChatPlug,
  StyledResizeHandler,
} from './components';

const Root = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
`;

const StyledPanelGroup = styled(PanelGroup)`
  flex: 1;
`;

interface Props {
  modalView?: boolean;
  chatId?: number;
  messageId?: number;
  modalWidth?: string;
}

const MultichatControl = (props: Props) => {
  const { modalView, modalWidth } = props;

  const { activeChatId, activeProviderId, setActiveChatId, setActiveProviderId } =
    useMultichatContext();

  const { data: providers, isLoading: areProvidersLoading } = useGetChatProviders(0);

  const activeProvider = useMemo<Optional<ChatProvider>>(
    () => providers?.find(p => p.id === activeProviderId),
    [activeProviderId, providers]
  );

  return (
    <Root className="workspace__MultichatControl--Root">
      {modalView && <MultichatControlHeader />}

      <StyledPanelGroup direction="horizontal">
        <ChatsSidebar
          providers={providers}
          modalView={modalView}
          activeChatId={activeChatId}
          activeProvider={activeProvider}
          areProvidersLoading={areProvidersLoading}
          setActiveChatId={setActiveChatId}
          setActiveProviderId={setActiveProviderId}
        />

        <StyledResizeHandler />

        <Panel defaultSize={modalView ? 70 : 62} maxSize={90} minSize={50}>
          {activeChatId ? (
            <ChatMessagesPanel
              key={activeChatId}
              providers={providers}
              modalWidth={modalWidth}
              activeChatId={activeChatId}
              activeProvider={activeProvider}
            />
          ) : (
            <NoSelectedChatPlug />
          )}
        </Panel>
      </StyledPanelGroup>
    </Root>
  );
};

export { MultichatControl };
