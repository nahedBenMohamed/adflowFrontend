import { WarningModal } from '@/shared';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpened: boolean;
  phoneNumber: string;
  onClose: () => void;
  onApprove: () => void;
}

const DeleteVoximplantNumberWarningModal = (props: Props) => {
  const { isOpened, phoneNumber, onClose, onApprove } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.pages.calls_settings_account_page.delete_warning_modal',
  });

  return (
    <WarningModal
      icon="trashbin"
      isOpened={isOpened}
      height="fit-content"
      maxHeight="fit-content"
      annotation={t('annotation')}
      title={t('title', { phoneNumber })}
      onClose={onClose}
      onApprove={onApprove}
    />
  );
};

export { DeleteVoximplantNumberWarningModal };
