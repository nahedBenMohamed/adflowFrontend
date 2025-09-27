import { WarningModal } from '@/shared';
import { useTranslation } from 'react-i18next';

interface Props {
  opened: boolean;
  hide: () => void;
  onApprove: () => void;
}

const ChangesNotSavedWarningModal = (props: Props) => {
  const { opened, hide, onApprove } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.common.modals.changes_not_saved_warning_modal',
  });

  return (
    <WarningModal
      isOpened={opened}
      title={t('title')}
      approveTitle={t('close')}
      annotation={t('annotation')}
      onClose={hide}
      onApprove={onApprove}
    />
  );
};

export { ChangesNotSavedWarningModal };
