import type { ModalControl, Nullable } from '@/shared';
import { useState } from 'react';
import type { GoogleCalendar } from '../../../../../../../shared';
import { GoogleCalendarConnectModal } from '../GoogleCalendarConnectModal/GoogleCalendarConnectModal';
import { GoogleCalendarManageModal } from '../GoogleCalendarManageModal/GoogleCalendarManageModal';

interface Props {
  manageModalControl: ModalControl;
  connectModalControl: ModalControl;
  calendars: GoogleCalendar[];
}

const GoogleCalendarModalsQueue = (props: Props) => {
  const { manageModalControl, connectModalControl, calendars } = props;

  const [currentCalendar, setCurrentCalendar] = useState<Nullable<GoogleCalendar>>(null);

  const handleOpenEditModal = (calendar: Nullable<GoogleCalendar>) => {
    setCurrentCalendar(calendar);

    connectModalControl.open();
  };

  const handleClearCurrentCalendar = () => {
    setCurrentCalendar(null);
  };

  return (
    <>
      {manageModalControl.opened && (
        <GoogleCalendarManageModal
          calendars={calendars}
          control={manageModalControl}
          openEditModal={handleOpenEditModal}
        />
      )}

      {connectModalControl.opened && (
        <GoogleCalendarConnectModal
          control={connectModalControl}
          currentCalendar={currentCalendar}
          handleClearCurrentCalendar={handleClearCurrentCalendar}
        />
      )}
    </>
  );
};

export { GoogleCalendarModalsQueue };
