import { truncateNumber } from '@/shared';
import { Tabs } from '@mantine/core';
import { memo } from 'react';
import styled from 'styled-components';
import type { ChatProvider, ChatProviderTransport } from '../../../../../models';
import { ProviderIcon } from '../ProviderIcon/ProviderIcon';
import { UnseenCountTagSmallView } from '../UnseenCountTagSmallView/UnseenCountTagSmallView';

const StyledTab = styled(Tabs.Tab)`
  border: none;

  width: 80px;

  padding: 8px 0 0;

  z-index: 1;

  span {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;

    white-space: pre-wrap;

    font-weight: 600;
    font-size: 12px;
    line-height: 15px;
    color: var(--button-text-graphite-secondary-text);
    transition: var(--transition-200);
  }

  &:hover {
    background-color: var(--graphite-graphite-20);
    border-radius: var(--border-radius-element);
    border-color: var(--graphite-graphite-80);
  }

  &[data-active] {
    color: var(--primary-statuses-green-520);
  }
`;

const TabContent = styled.div`
  max-width: 80px;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  text-align: center;
  word-break: break-all;

  padding: 0 2px;
`;

const IconWrapper = styled.div`
  position: relative;
`;

interface Props {
  value: string;
  title: string;
  unseenCount: number;
  transport: ChatProviderTransport | 'all';
  provider?: ChatProvider;
  activeProvider?: ChatProvider;
}

const ChatsSmallProvidersTab = memo((props: Props) => {
  const { value, title, unseenCount, transport, provider, activeProvider } = props;

  return (
    <StyledTab value={value}>
      <IconWrapper>
        {unseenCount > 0 && (
          <UnseenCountTagSmallView>
            {truncateNumber({ num: unseenCount, precision: 3 })}
          </UnseenCountTagSmallView>
        )}

        {transport === 'all' ? (
          <ProviderIcon transport="all" active={activeProvider ? false : true} />
        ) : (
          <ProviderIcon transport={transport} active={activeProvider?.id === provider?.id} />
        )}
      </IconWrapper>

      <TabContent>{title}</TabContent>
    </StyledTab>
  );
});

ChatsSmallProvidersTab.displayName = 'ChatsSmallProvidersTab';
export { ChatsSmallProvidersTab };
