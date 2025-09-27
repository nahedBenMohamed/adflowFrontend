import { HideScrollbarMixin, useTransformScroll } from '@/shared';
import { memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { useGetMultichatUnseenCount } from '../../../../../../../api';
import { generateRandomWidthInRange } from '../../../../../helpers';
import type { ChatProvider } from '../../../../../models';
import { ChatHeaderProviderTab } from '../ChatsHeaderProvidersTab/ChatHeaderProviderTab';
import { ChatsSmallProvidersTab } from '../ChatsSmallProvidersTab/ChatsSmallProvidersTab';
import { ChatsHeaderProvidersTabSkeleton } from '../Skeletons/ChatsHeaderProvidersTabSkeleton';

const Root = styled.div<{ $smallView: boolean }>`
  position: relative;

  height: ${p => (p.$smallView ? `100%` : 'var(--chats-header-providers-tabs-height)')};

  &::after {
    content: '';

    position: absolute;
    bottom: 0;
    left: 0;

    height: ${p => (p.$smallView ? 0 : '1px')};
    width: 100%;

    background-color: var(--graphite-graphite-80);
  }
`;

const TabsWrapper = styled.div<{ $smallView: boolean }>`
  height: 100%;

  display: flex;
  gap: 16px;

  padding: 0 16px;

  overflow-y: ${p => p.$smallView && 'auto'};
  overflow-x: ${p => !p.$smallView && 'auto'};

  ${HideScrollbarMixin}

  ${p =>
    p.$smallView &&
    css`
      flex-direction: column;

      padding: 6px 0 6px 8px;
    `}
`;

interface Props {
  loading: boolean;
  smallView: boolean;
  activeProvider?: ChatProvider;
  providers?: ChatProvider[];
}

export enum ProviderTabs {
  ALL_CHATS = 'all_chats',
}

const ChatsHeaderProvidersTabs = memo((props: Props) => {
  const { providers, loading, smallView, activeProvider } = props;

  const { t } = useTranslation('module.multichat', {
    keyPrefix: 'multichat.components.multichat_control.ui.chats_header_providers_tabs',
  });

  const ref = useRef<HTMLDivElement>(null);

  useTransformScroll(ref, smallView);

  const { data: allUnseenCount } = useGetMultichatUnseenCount();

  useEffect(() => {
    const tabsWrapper = ref.current;
    const tabs = document.querySelectorAll('.workspace__ChatHeaderProviderTab--StyledTab');

    // find tab with data-active="true"
    const activeTab =
      tabs && Array.from(tabs).find(tab => tab.getAttribute('data-active') === 'true');

    if (activeTab && tabsWrapper) {
      const containerRect = tabsWrapper.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();

      const scrollLeft = tabRect.left - containerRect.left + tabsWrapper.scrollLeft;
      const scrollCenter = scrollLeft - containerRect.width / 2 + tabRect.width / 2;

      // if active tab is not in the center of the container and it is possible for it to be in the center
      // then scroll to the center of the active tab
      tabsWrapper.scrollTo({
        left: scrollCenter,
        behavior: 'smooth',
      });
    }
  }, [activeProvider]);

  return (
    <Root $smallView={smallView}>
      <TabsWrapper ref={ref} $smallView={smallView}>
        {loading
          ? new Array(4)
              .fill(0)
              .map((_, idx) => (
                <ChatsHeaderProvidersTabSkeleton
                  key={idx}
                  $delay={idx * 300}
                  $width={generateRandomWidthInRange({ min: 80, max: 168 })}
                />
              ))
          : providers &&
            !smallView && (
              <>
                <ChatHeaderProviderTab
                  title={t('all_chats')}
                  unseenCount={allUnseenCount}
                  value={ProviderTabs.ALL_CHATS}
                />

                {providers.map(p => (
                  <ChatHeaderProviderTab
                    key={p.id}
                    title={p.title}
                    value={String(p.id)}
                    unseenCount={p.unseenCount}
                  />
                ))}
              </>
            )}

        {smallView && providers && (
          <>
            <ChatsSmallProvidersTab
              transport="all"
              title={t('all_chats')}
              unseenCount={allUnseenCount}
              value={ProviderTabs.ALL_CHATS}
              activeProvider={activeProvider}
            />

            {providers.map(p => (
              <ChatsSmallProvidersTab
                key={p.id}
                provider={p}
                title={p.title}
                value={String(p.id)}
                transport={p.transport}
                unseenCount={p.unseenCount}
                activeProvider={activeProvider}
              />
            ))}
          </>
        )}
      </TabsWrapper>
    </Root>
  );
});

ChatsHeaderProvidersTabs.displayName = 'ChatsHeaderProvidersTabs';
export { ChatsHeaderProvidersTabs };
