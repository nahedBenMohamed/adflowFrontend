import { MyDrawer } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useEffect, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useIntersectionObserver } from 'usehooks-ts';
import { notificationsStore } from '../../../../store';
import { NotificationBlock, NotificationBlockSkeleton, PanelHeader } from './components';

const List = styled.ul`
  position: relative;

  display: flex;
  flex-direction: column;
  gap: 8px;

  overflow-x: hidden;
  padding: 12px 16px;
`;

const LoadMoreObserver = styled.div`
  position: absolute;
  bottom: 0;

  width: 100%;
  height: 600px;

  pointer-events: none;
`;

const NoNotificationsCaption = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
  color: var(--button-text-graphite-secondary-text);

  padding: 40px 8px;
`;

interface Props {
  opened: boolean;
  buttonRef: RefObject<HTMLButtonElement | null>;
  hide: () => void;
}

const NotificationsPanelDrawer = observer((props: Props) => {
  const { opened, buttonRef, hide } = props;

  const {
    isLoaded,
    isLoading,
    unseenCount,
    notifications,
    loadUnseenCount,
    loadNotifications,
    loadMoreNotifications,
    markNotificationAsSeen,
    markAllNotificationsAsSeen,
  } = notificationsStore;

  const { t } = useTranslation('module.notifications', {
    keyPrefix: 'notifications.components.notifications_panel',
  });

  const { isIntersecting, ref: lastElement } = useIntersectionObserver({});

  useEffect(() => {
    if (isIntersecting && opened) loadMoreNotifications();
  }, [opened, isIntersecting, loadMoreNotifications]);

  useEffect(() => {
    if (opened) {
      loadUnseenCount();
      loadNotifications();
    }
  }, [opened, loadNotifications, loadUnseenCount]);

  return (
    <MyDrawer
      opened={opened}
      buttonRef={buttonRef}
      Header={
        <PanelHeader
          isLoaded={isLoaded}
          readAllDisabled={unseenCount === 0}
          handleReadAll={isLoaded ? markAllNotificationsAsSeen : undefined}
        />
      }
      bgColor="var(--graphite-graphite-20)"
      hide={hide}
    >
      <List>
        {isLoading ? (
          new Array(10).fill(0).map((_, idx) => {
            if (idx === 0 || idx === 3 || idx === 5 || idx === 8)
              return <NotificationBlockSkeleton key={idx} $delay={idx * 300} $small />;

            return <NotificationBlockSkeleton key={idx} $delay={idx * 300} />;
          })
        ) : notifications.length > 0 ? (
          notifications.map(n => (
            <NotificationBlock key={n.id} notification={n} onSeen={markNotificationAsSeen} />
          ))
        ) : (
          <NoNotificationsCaption>{t('no_notifications')}</NoNotificationsCaption>
        )}

        <LoadMoreObserver ref={lastElement} />
      </List>
    </MyDrawer>
  );
});

NotificationsPanelDrawer.displayName = 'NotificationsPanelDrawer';
export { NotificationsPanelDrawer };
