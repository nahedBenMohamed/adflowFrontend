import type { InputModel } from '@/shared';
import styled from 'styled-components';
import type { ChatProvider } from '../../../../../models';
import { ChatsHeaderProvidersTabs } from '../ChatsHeaderProvidersTabs/ChatsHeaderProvidersTabs';
import { ChatsHeaderSearchBlock } from '../ChatsHeaderSearchBlock/ChatsHeaderSearchBlock';

const Root = styled.div<{ $smallView: boolean }>`
  height: var(--chats-sidebar-header-height);

  display: flex;
  flex-direction: column;

  background-color: var(--primary-statuses-white-0);

  ${p => p.$smallView && `height: 100%`};
`;

interface Props {
  searchModel: InputModel;
  smallView: boolean;
  providersLoading: boolean;
  providers?: ChatProvider[];
  activeProvider?: ChatProvider;
}

const ChatsSidebarHeader = (props: Props) => {
  const { searchModel, smallView, providersLoading, providers, activeProvider } = props;

  return (
    <Root $smallView={smallView}>
      {!smallView && <ChatsHeaderSearchBlock model={searchModel} provider={activeProvider} />}

      <ChatsHeaderProvidersTabs
        providers={providers}
        smallView={smallView}
        loading={providersLoading}
        activeProvider={activeProvider}
      />
    </Root>
  );
};

export { ChatsSidebarHeader };
