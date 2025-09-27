import { WarningModal } from '@/shared';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpened: boolean;
  onClose: () => void;
}

const AppointmentIntersectWarningModal = (props: Props) => {
  const { isOpened, onClose } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix:
      'scheduler.pages.scheduler_schedule_view_page.ui.add_appointment_modal.intersect_warning_modal',
  });

  return (
    <WarningModal
      hideApprove
      icon="warning"
      isOpened={isOpened}
      height="fit-content"
      maxHeight="fit-content"
      title={t('title')}
      annotation={t('annotation')}
      onClose={onClose}
    />
  );
};

export { AppointmentIntersectWarningModal };
