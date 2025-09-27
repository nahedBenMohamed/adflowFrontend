import { SettingsStore } from '@/app';
import { MySwitch, MyTooltip } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { SoundIcon } from '../../../../../assets';
import { NOTIFICATIONS_SETTINGS_LS_KEY, type NotificationLocalSettings } from '../../../../models';

const Root = styled.button<{ $mute?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const { settings } = SettingsStore.getSettingsStore<NotificationLocalSettings>(
  NOTIFICATIONS_SETTINGS_LS_KEY
);

const SoundButton = observer(() => {
  const { t } = useTranslation('module.notifications', {
    keyPrefix: 'notifications.components.notifications_panel',
  });

  const toggleSound = useCallback(() => {
    settings.muteSound = !settings.muteSound;
  }, []);

  return (
    <MyTooltip
      withinPortal
      openDelay={300}
      label={settings.muteSound ? t('unmute_notifications') : t('mute_notifications')}
    >
      <Root>
        <SoundIcon />

        <MySwitch checked={settings.muteSound} onChange={toggleSound} />
      </Root>
    </MyTooltip>
  );
});

SoundButton.displayName = 'SoundButton';
export { SoundButton };
