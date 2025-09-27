import { useTranslation } from 'react-i18next';
import { WarningModal } from '../../../Modals/WarningModal/WarningModal';

interface Props {
  opened: boolean;
  onCancel: () => void;
  onApprove: () => void;
}

const DuplicatesForbiddenModal = (props: Props) => {
  const { opened, onCancel, onApprove } = props;

  const { t } = useTranslation();

  return (
    <WarningModal
      zIndex={1500}
      icon="warning"
      width="416px"
      isDanger={false}
      maxHeight="400px"
      title={t('duplicate_title')}
      approveTitle={t('select_existing')}
      annotation={t('duplicate_forbidden_annotation')}
      isOpened={opened}
      onClose={onCancel}
      onApprove={onApprove}
      onCancel={onCancel}
    />
  );
};

export { DuplicatesForbiddenModal };
