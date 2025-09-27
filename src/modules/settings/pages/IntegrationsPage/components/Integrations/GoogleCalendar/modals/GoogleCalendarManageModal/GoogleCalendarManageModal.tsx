import { ChatProviderStatus } from '@/modules/multichat';
import { envUtil, type ModalControl, type Nullable } from '@/shared';
import { useTranslation } from 'react-i18next';
import {
  googleCalendarIntegrationApi,
  invalidateGoogleCalendarIntegrationsInCache,
} from '../../../../../../../api';
import {
  GoogleCalendarSmallIcon,
  type GoogleCalendar,
  type IntegrationSettingsAccount,
} from '../../../../../../../shared';
import { IntegrationManageModalTemplate } from '../../../../IntegrationManageModalTemplate/IntegrationManageModalTemplate';

interface Props {
  control: ModalControl;
  calendars: GoogleCalendar[];
  openEditModal: (calendar: Nullable<GoogleCalendar>) => void;
}

const GoogleCalendarManageModal = (props: Props) => {
  const { control, calendars, openEditModal } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.google_calendar.google_calendar_manage_modal',
  });

  const handleEdit = async (id: number): Promise<void> => {
    try {
      const calendar = await googleCalendarIntegrationApi.getGoogleCalendarIntegration(id);

      openEditModal(calendar);
    } catch (e) {
      throw new Error(`Failed to get Google Calendar integration: ${JSON.stringify(e)}`);
    }
  };

  const accounts = calendars.map<IntegrationSettingsAccount>(c => ({
    id: c.id,
    title: c.title,
    status: ChatProviderStatus.ACTIVE,
    onEdit: () => handleEdit(c.id),
    onDelete: async (): Promise<void> => {
      try {
        await googleCalendarIntegrationApi.deleteGoogleCalendarIntegration(c.id);

        invalidateGoogleCalendarIntegrationsInCache();
      } catch (e) {
        throw new Error(`Failed to delete Google Calendar integration: ${JSON.stringify(e)}`);
      }
    },
  }));

  const handleOpenAddAccountModal = () => openEditModal(null);

  return (
    <IntegrationManageModalTemplate
      accounts={accounts}
      isOpened={control.opened}
      Icon={<GoogleCalendarSmallIcon />}
      headerTitle={t('title', { company: envUtil.appName })}
      onClose={control.close}
      openAddAccountModal={handleOpenAddAccountModal}
    />
  );
};

export { GoogleCalendarManageModal };
