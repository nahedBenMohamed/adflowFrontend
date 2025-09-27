import { invalidateChatProvidersInCache, type WazzupProvider } from '@/modules/multichat';
import { envUtil, type ModalControl, type Nullable } from '@/shared';
import { useTranslation } from 'react-i18next';
import { WazzupSmallIcon, type IntegrationSettingsAccount } from '../../../../../../../shared';
import { wazzupProviderSettingsStore } from '../../../../../../../store';
import { IntegrationManageModalTemplate } from '../../../../IntegrationManageModalTemplate/IntegrationManageModalTemplate';

interface Props {
  control: ModalControl;
  providersSettings: WazzupProvider[];
  openEditModal: (providerSettings: Nullable<WazzupProvider>) => void;
}

const WazzupManageModal = (props: Props) => {
  const { control, providersSettings, openEditModal } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.wazzup.wazzup_manage_modal',
  });

  const { loadProviderSettingsById, deleteProviderSettings } = wazzupProviderSettingsStore;

  const handleEdit = async (id: number): Promise<void> => {
    const providerSettings = await loadProviderSettingsById(id);

    openEditModal(providerSettings);
  };

  const accounts = providersSettings.map<IntegrationSettingsAccount>(ps => ({
    id: ps.id,
    title: ps.title,
    status: ps.status,
    onEdit: () => handleEdit(ps.id),
    onDelete: () => deleteProviderSettings(ps.id),
  }));

  const handleOpenAddAccountModal = () => {
    openEditModal(null);
  };

  const handleCloseModal = () => {
    control.close();

    invalidateChatProvidersInCache();
  };

  return (
    <IntegrationManageModalTemplate
      accounts={accounts}
      isOpened={control.opened}
      Icon={<WazzupSmallIcon />}
      headerTitle={t('title', { company: envUtil.appName })}
      onClose={handleCloseModal}
      openAddAccountModal={handleOpenAddAccountModal}
    />
  );
};

export { WazzupManageModal };
