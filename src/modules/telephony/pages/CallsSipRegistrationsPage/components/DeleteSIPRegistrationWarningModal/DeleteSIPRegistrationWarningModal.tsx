import { WarningModal } from '@/shared';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpened: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onApprove: () => void;
}

const DeleteSIPRegistrationWarningModal = (props: Props) => {
  const { isOpened, isDeleting, onClose, onApprove } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.pages.calls_sip_registrations_page.delete_warning',
  });

  return (
    <WarningModal
      width="440px"
      icon="trashbin"
      title={t('title')}
      isOpened={isOpened}
      height="fit-content"
      maxHeight="fit-content"
      cancelDisabled={isDeleting}
      approveLoading={isDeleting}
      approveDisabled={isDeleting}
      annotation={t('annotation')}
      onClose={onClose}
      onApprove={onApprove}
    />
  );
};

export { DeleteSIPRegistrationWarningModal };
