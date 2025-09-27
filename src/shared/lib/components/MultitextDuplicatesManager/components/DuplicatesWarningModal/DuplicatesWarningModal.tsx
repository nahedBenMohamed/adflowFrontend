import { useTranslation } from 'react-i18next';
import { WarningModal } from '../../../Modals/WarningModal/WarningModal';

interface Props {
  opened: boolean;
  onCancel: () => void;
  onApprove: () => void;
}

const DuplicatesWarningModal = (props: Props) => {
  const { opened, onCancel, onApprove } = props;

  const { t } = useTranslation();

  return (
    <WarningModal
      zIndex={1500}
      icon="warning"
      width="456px"
      isDanger={false}
      isOpened={opened}
      maxHeight="356px"
      title={t('duplicate_title')}
      approveTitle={t('select_existing')}
      annotation={t('duplicate_warning_annotation')}
      cancelTitle={t('duplicate_warning_cancel_title')}
      onClose={onCancel}
      onCancel={onCancel}
      onApprove={onApprove}
    />
  );
};

export { DuplicatesWarningModal };
