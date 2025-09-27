import { useDisclosure } from '@mantine/hooks';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { CogIcon } from '../../../../../assets';
import { NotificationSettingsModal } from '../NotificationSettingsModal/NotificationSettingsModal';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: var(--button-text-graphite-priory-text);
`;

const CogIconWrapper = styled.button<{ $active: boolean }>`
  width: 24px;
  height: 24px;

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-green-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-green-active);
    }
  }

  ${p =>
    p.$active &&
    css`
      svg path {
        fill: var(--button-text-green-active);
      }
    `}
`;

const NotificationSettings = memo(() => {
  const [opened, { toggle: toggleOpened, close: hide }] = useDisclosure(false);

  const { t } = useTranslation('module.notifications', {
    keyPrefix: 'notifications.components.notifications_panel.ui.notification_settings',
  });

  return (
    <>
      <Root>
        {t('title')}

        <CogIconWrapper $active={opened} onClick={toggleOpened}>
          <CogIcon />
        </CogIconWrapper>
      </Root>

      {opened && <NotificationSettingsModal opened={opened} onClose={hide} />}
    </>
  );
});

NotificationSettings.displayName = 'NotificationSettings';
export { NotificationSettings };
