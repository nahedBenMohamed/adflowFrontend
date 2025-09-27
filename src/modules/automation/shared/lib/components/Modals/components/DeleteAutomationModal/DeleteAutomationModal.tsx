import { WarningModal } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpened: boolean;
  onClose: () => void;
  onApprove: () => Promise<void>;
}

const DeleteAutomationModal = observer((props: Props) => {
  const { isOpened, onClose, onApprove } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.delete_automation_modal',
  });

  const [loading, setLoading] = useState(false);

  const handleDelete = async (): Promise<void> => {
    try {
      setLoading(true);

      await onApprove();
    } catch (e) {
      throw new Error(`Error while deleting automation: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WarningModal
      isDanger
      icon="trashbin"
      title={t('title')}
      isOpened={isOpened}
      approveLoading={loading}
      annotation={t('annotation')}
      onClose={onClose}
      onApprove={handleDelete}
    />
  );
});

DeleteAutomationModal.displayName = 'DeleteAutomationModal';
export { DeleteAutomationModal };
