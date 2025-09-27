import { Tabs } from '@mantine/core';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useTelephonyContext } from '../../../../../../../../context';
import { OutgoingCallInitializerTabs } from '../../../../../../models';

const Root = styled(Tabs.List)<{ $folded: boolean }>`
  position: sticky;
  top: 0px;

  height: var(--telephony-call-initializer-header-height);

  flex-shrink: 0;

  z-index: 1;

  border-bottom: 1px solid var(--graphite-graphite-80);
  background-color: ${p => (p.$folded ? 'transparent' : 'var(--primary-statuses-white-0)')};

  .mantine-Tabs-tab {
    flex: 0.5;

    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: var(--button-text-graphite-primary-text);
    transition: var(--transition-200);

    padding: 8px;
    border-radius: 0;

    &[data-active] {
      color: var(--graphite-graphite-840);

      border-color: var(--button-text-green-active);
    }

    &:focus {
      outline: none;
    }

    &:hover {
      background-color: var(--graphite-graphite-20);
    }

    &:not([data-active]) {
      &:hover {
        border-color: var(--button-text-graphite-secondary-text);
      }
    }
  }

  ${p => p.$folded && `transition: background-color var(--transition-200)`};
`;

const OutgoingCallInitializerTabsListHeader = memo(() => {
  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.components.telephony_modal.outgoing_call_initializer',
  });

  const { folded } = useTelephonyContext();

  return (
    <Root $folded={folded}>
      <Tabs.Tab value={OutgoingCallInitializerTabs.KEYS}>{t('keys')}</Tabs.Tab>
      <Tabs.Tab value={OutgoingCallInitializerTabs.RECENT}>{t('recent')}</Tabs.Tab>
    </Root>
  );
});

OutgoingCallInitializerTabsListHeader.displayName = 'OutgoingCallInitializerTabsListHeader';
export { OutgoingCallInitializerTabsListHeader };
