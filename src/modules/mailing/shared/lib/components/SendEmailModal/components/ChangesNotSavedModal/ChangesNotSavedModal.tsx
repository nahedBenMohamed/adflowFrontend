import { WarningModal } from '@/shared';
import { useTranslation } from 'react-i18next';
interface Props {
  isOpened: boolean;
  onClose: () => void;
  onSendEmailModalClose: (result: boolean) => void;
}

const ChangesNotSavedModal = (props: Props) => {
  const { isOpened, onClose, onSendEmailModalClose } = props;

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.modals.send_email_modal.components.changes_not_saved_modal',
  });

  const handleApprove = () => {
    onClose();
    onSendEmailModalClose(false);
  };

  return (
    <WarningModal
      isDanger
      icon="warning"
      maxHeight="100%"
      title={t('title')}
      isOpened={isOpened}
      height="fit-content"
      approveTitle={t('approve')}
      annotation={t('annotation')}
      onClose={onClose}
      onApprove={handleApprove}
    />
  );
};

export { ChangesNotSavedModal };
