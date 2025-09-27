import { WarningModal } from '@/shared';
import { useTranslation } from 'react-i18next';

interface Props {
  opened: boolean;
  onClose: () => void;
}

const EntityTypeFieldUsedInFormulaWarningModal = (props: Props) => {
  const { opened, onClose } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix:
      'builder.pages.workspace_editor_page.entity_type_field_used_in_formula_warning_modal',
  });

  return (
    <WarningModal
      icon="warning"
      isDanger={false}
      isOpened={opened}
      title={t('title')}
      height="fit-content"
      maxHeight="fit-content"
      approveTitle={t('continue')}
      annotation={t('annotation')}
      onClose={onClose}
    />
  );
};

export { EntityTypeFieldUsedInFormulaWarningModal };
