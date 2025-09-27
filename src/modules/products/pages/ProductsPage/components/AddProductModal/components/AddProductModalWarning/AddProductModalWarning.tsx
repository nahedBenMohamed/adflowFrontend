import { WarningModal } from '@/shared';
import { useTranslation } from 'react-i18next';

interface Props {
  opened: boolean;
  hide: () => void;
  onApprove: () => void;
}

const AddProductModalWarning = (props: Props) => {
  const { opened, hide, onApprove } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.products_page.ui.add_product_modal',
  });

  return (
    <WarningModal
      width="440px"
      icon="warning"
      maxHeight="360px"
      isOpened={opened}
      title={t('changes_not_saved_warning_title')}
      annotation={t('changes_not_saved_warning_annotation')}
      approveTitle={t('changes_not_saved_warning_approve_title')}
      onClose={hide}
      onApprove={onApprove}
    />
  );
};

export { AddProductModalWarning };
