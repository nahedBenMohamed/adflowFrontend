import { HeaderRoundButton, MyIndicator, UnseenCount, truncateNumber } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { notificationsStore, toastNotificationsStore } from '../../../../store';
import { BellIcon } from '../../../assets';
import { NotificationsPanelDrawer } from '../NotificationsPanelDrawer/NotificationsPanelDrawer';

const NotificationsButton = observer(() => {
  const { unseenCount } = notificationsStore;
  const { dismissAllNotifications, setDrawerOpened } = toastNotificationsStore;

  const { t } = useTranslation();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const [panelOpened, { toggle: togglePanelOpened, close: hidePanel }] = useDisclosure(false);

  const moreThanTwoDigits = unseenCount > 99;

  const handleOpenDrawer = useCallback(() => {
    togglePanelOpened();

    if (!panelOpened) {
      dismissAllNotifications();
      setDrawerOpened(true);
    } else {
      setDrawerOpened(false);
    }
  }, [panelOpened, dismissAllNotifications, setDrawerOpened, togglePanelOpened]);

  return (
    <>
      <MyIndicator
        size={19}
        withBorder
        disabled={unseenCount === 0}
        offset={moreThanTwoDigits ? 2 : 3}
        label={
          <UnseenCount $small={moreThanTwoDigits}>
            {truncateNumber({ num: unseenCount, precision: 3 })}
          </UnseenCount>
        }
      >
        <HeaderRoundButton
          ref={buttonRef}
          active={panelOpened}
          label={t('notifications')}
          onClick={handleOpenDrawer}
        >
          <BellIcon />
        </HeaderRoundButton>
      </MyIndicator>

      <NotificationsPanelDrawer opened={panelOpened} buttonRef={buttonRef} hide={hidePanel} />
    </>
  );
});

NotificationsButton.displayName = 'NotificationsButton';
export { NotificationsButton };
