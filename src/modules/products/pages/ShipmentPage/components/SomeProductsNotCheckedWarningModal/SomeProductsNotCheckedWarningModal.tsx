import { WarningModal, type ModalControl } from '@/shared';
import { useTranslation } from 'react-i18next';

interface Props {
  control: ModalControl;
  onApprove: () => void;
  onCancel: () => void;
}

const SomeProductsNotCheckedWarningModal = (props: Props) => {
  const { control, onApprove, onCancel } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.shipment_page.ui.some_products_not_checked_warning_modal',
  });

  return (
    <WarningModal
      width="420px"
      maxHeight="360px"
      title={t('title')}
      isOpened={control.opened}
      annotation={t('annotation')}
      approveTitle={t('approve_title')}
      onClose={onCancel}
      onApprove={onApprove}
    />
  );
};

export { SomeProductsNotCheckedWarningModal };
