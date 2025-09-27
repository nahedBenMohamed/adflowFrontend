import { useQueryParamModalControl } from '@/shared';
import { useTranslation } from 'react-i18next';
import { useGetGoogleCalendarIntegrations } from '../../../../../../api';
import {
  GOOGLE_CALENDAR_CONNECT_MODAL_QUERY_PARAM,
  GOOGLE_CALENDAR_MANAGE_MODAL_QUERY_PARAM,
  GoogleCalendarIcon,
} from '../../../../../../shared';
import { IntegrationItem } from '../../../IntegrationItem/IntegrationItem';
import { GoogleCalendarModalsQueue } from '../modals/GoogleCalendarModalsQueue/GoogleCalendarModalsQueue';

const GoogleCalendarItem = () => {
  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.google_calendar.google_calendar_item',
  });

  const connectModalControl = useQueryParamModalControl(GOOGLE_CALENDAR_CONNECT_MODAL_QUERY_PARAM);
  const manageModalControl = useQueryParamModalControl(GOOGLE_CALENDAR_MANAGE_MODAL_QUERY_PARAM);

  const { data: calendars } = useGetGoogleCalendarIntegrations();

  const count = calendars?.length;

  return (
    <>
      <IntegrationItem
        Icon={<GoogleCalendarIcon />}
        description={t('description')}
        onInstall={connectModalControl.open}
        onManage={count ? manageModalControl.open : undefined}
      />

      {calendars && (
        <GoogleCalendarModalsQueue
          calendars={calendars}
          manageModalControl={manageModalControl}
          connectModalControl={connectModalControl}
        />
      )}
    </>
  );
};

export { GoogleCalendarItem };
