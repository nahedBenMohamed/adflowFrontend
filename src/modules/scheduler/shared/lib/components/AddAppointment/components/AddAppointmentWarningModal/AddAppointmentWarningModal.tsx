import { WarningModal } from '@/shared';
import { useTranslation } from 'react-i18next';

interface Props {
  isEditMode: boolean;
  opened: boolean;
  onClose: () => void;
  onApprove: () => void;
}

const AddAppointmentWarningModal = (props: Props) => {
  const { isEditMode, opened, onClose, onApprove } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page.ui.add_appointment_modal',
  });

  return (
    <WarningModal
      icon="warning"
      isOpened={opened}
      title={t('warning_title')}
      annotation={t('warning_annotation')}
      approveTitle={isEditMode ? t('close') : t('delete')}
      onClose={onClose}
      onApprove={onApprove}
    />
  );
};

export { AddAppointmentWarningModal };
