import { entityTypeStore } from '@/app';
import { WarningModal } from '@/shared';
import { useTranslation } from 'react-i18next';

interface Props {
  opened: boolean;
  entityTypeId: number;
  fieldFormulaCircularDependencyId: number;
  onClose: () => void;
  onCancelChanges: () => void;
}

const FieldFormulaCircularDependencyWarningModal = (props: Props) => {
  const { opened, entityTypeId, fieldFormulaCircularDependencyId, onClose, onCancelChanges } =
    props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.field_formula_circular_dependency_warning',
  });

  const fieldName = entityTypeStore
    .getById(entityTypeId)
    .getFieldById(fieldFormulaCircularDependencyId).name;

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
};

export { FieldFormulaCircularDependencyWarningModal };
