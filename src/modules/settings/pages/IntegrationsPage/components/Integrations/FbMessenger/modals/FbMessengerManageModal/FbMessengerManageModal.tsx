import {
  invalidateChatProvidersInCache,
  useGetChatProviders,
  type MessengerProviderSettings,
} from '@/modules/multichat';
import type { ModalControl, Nullable } from '@/shared';
import { useTranslation } from 'react-i18next';
import { FbMessengerSmallIcon, type IntegrationSettingsAccount } from '../../../../../../../shared';
import { fbMessengerProviderSettingsStore } from '../../../../../../../store';
import { IntegrationManageModalTemplate } from '../../../../IntegrationManageModalTemplate/IntegrationManageModalTemplate';

interface Props {
  providersSettings: MessengerProviderSettings[];
  control: ModalControl;
  openEditModal: (providerSettings: Nullable<MessengerProviderSettings>) => void;
}

const FbMessengerManageModal = (props: Props) => {
  const { providersSettings, control, openEditModal } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.fb_messenger.fb_messenger_manage_modal',
  });

  useGetChatProviders();

  const { loadProviderSettingsById, deleteProviderSettings } = fbMessengerProviderSettingsStore;

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
      headerTitle={t('title')}
      isOpened={control.opened}
      Icon={<FbMessengerSmallIcon />}
      onClose={handleCloseModal}
      openAddAccountModal={handleOpenAddAccountModal}
    />
  );
};

export { FbMessengerManageModal };
