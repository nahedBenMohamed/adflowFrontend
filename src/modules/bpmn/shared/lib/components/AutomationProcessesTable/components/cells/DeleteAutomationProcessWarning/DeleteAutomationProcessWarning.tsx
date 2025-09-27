import { WarningModal } from '@/shared';
import { useTranslation } from 'react-i18next';

interface Props {
  name: string;
  isOpened: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onApprove: () => void;
}

const DeleteAutomationProcessWarning = (props: Props) => {
  const { name, isOpened, isDeleting, onClose, onApprove } = props;

  const { t } = useTranslation('module.bpmn', {
    keyPrefix: 'bpmn.pages.bpmn_automations_page.delete_bpmn_automation_warning_modal',
  });

  return (
    <WarningModal
      width="420px"
      maxHeight="100%"
      isOpened={isOpened}
      height="fit-content"
      cancelDisabled={isDeleting}
      approveLoading={isDeleting}
      approveDisabled={isDeleting}
      annotation={t('annotation')}
      title={t('title', { name })}
      onClose={onClose}
      onApprove={onApprove}
    />
  );
};

export { DeleteAutomationProcessWarning };
