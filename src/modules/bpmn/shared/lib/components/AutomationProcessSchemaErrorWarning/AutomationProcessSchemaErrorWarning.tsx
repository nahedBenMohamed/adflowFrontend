import { WarningModal } from '@/shared';
import { useTranslation } from 'react-i18next';

interface Props {
  name: string;
  isOpened: boolean;
  onClose: () => void;
}

const AutomationProcessSchemaErrorWarning = (props: Props) => {
  const { name, isOpened, onClose } = props;

  const { t } = useTranslation('module.bpmn', {
    keyPrefix: 'bpmn.pages.bpmn_automations_page.automation_process_schema_error_warning',
  });

  return (
    <WarningModal
      hideApprove
      icon="warning"
      maxHeight="100%"
      isOpened={isOpened}
      height="fit-content"
      title={t('title', { name })}
      approveTitle={t('continue')}
      annotation={t('annotation')}
      // to be over all fixed and absolute bpmn modeler elements
      zIndex="calc(var(--modal-z-index) + 2)"
      onClose={onClose}
    />
  );
};

export { AutomationProcessSchemaErrorWarning };
