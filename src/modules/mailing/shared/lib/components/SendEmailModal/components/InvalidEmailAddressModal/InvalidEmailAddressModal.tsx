import { WarningModal } from '@/shared';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpened: boolean;
  isSending: boolean;
  invalidEmails: string[];
  onClose: () => void;
  onApprove: () => Promise<void>;
  onSendEmailModalClose: (result: boolean) => void;
}

const InvalidEmailAddressModal = (props: Props) => {
  const { isOpened, isSending, invalidEmails, onClose, onSendEmailModalClose, onApprove } = props;

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.modals.send_email_modal.components.invalid_email_address_modal',
  });

  const handleApprove = useCallback(async (): Promise<void> => {
    try {
      await onApprove();

      onSendEmailModalClose(true);
    } catch (e) {
      console.error(`Error while sending message, ${e}`);
    } finally {
      onClose();
    }
  }, [onApprove, onClose, onSendEmailModalClose]);

  return (
    <WarningModal
      width="470px"
      icon="warning"
      maxHeight="100%"
      isDanger={false}
      isOpened={isOpened}
      height="fit-content"
      approveLoading={isSending}
      approveTitle={t('approve')}
      annotation={t('annotation')}
      title={t('title', { email: invalidEmails[0] })}
      onClose={onClose}
      onApprove={handleApprove}
    />
  );
};

export { InvalidEmailAddressModal };
