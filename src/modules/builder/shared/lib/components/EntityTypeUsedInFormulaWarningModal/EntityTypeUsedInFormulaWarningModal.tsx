import { WarningModal } from '@/shared';
import { useTranslation } from 'react-i18next';

interface Props {
  opened: boolean;
  onClose: () => void;
}

const EntityTypeUsedInFormulaWarningModal = (props: Props) => {
  const { opened, onClose } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.et_section_builder_page.entity_type_used_in_formula_warning_modal',
  });

  return (
    <WarningModal
      isDanger
      hideApprove
      width="464px"
      icon="warning"
      maxHeight="100%"
      isOpened={opened}
      height="fit-content"
      title={t('title')}
      annotation={t('annotation')}
      onClose={onClose}
    />
  );
};

export { EntityTypeUsedInFormulaWarningModal };
