import { entityTypeStore } from '@/app';
import { WarningModal } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

interface Props {
  opened: boolean;
  entityTypeId: number;
  fieldUsedInFormulaId: number;
  onClose: () => void;
  onCancelChanges: () => void;
}

const FieldUsedInFormulaWarningModal = observer((props: Props) => {
  const { opened, entityTypeId, fieldUsedInFormulaId, onClose, onCancelChanges } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.field_used_in_formula_warning',
  });

  const fieldName = entityTypeStore.getById(entityTypeId).getFieldById(fieldUsedInFormulaId).name;

  const handleApprove = () => {
    onCancelChanges();
    onClose();
  };

  return (
    <WarningModal
      isDanger
      width="464px"
      icon="warning"
      isOpened={opened}
      height="fit-content"
      maxHeight="fit-content"
      title={t('warning_title')}
      cancelTitle={t('continue')}
      approveTitle={t('cancel_changes')}
      annotation={t('warning_annotation', { fieldName })}
      onClose={onClose}
      onCancel={onClose}
      onApprove={handleApprove}
    />
  );
});

export { FieldUsedInFormulaWarningModal };
