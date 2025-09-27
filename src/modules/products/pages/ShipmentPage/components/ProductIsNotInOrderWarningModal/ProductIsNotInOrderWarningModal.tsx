import { routes } from '@/app';
import { WarningModal, type ModalControl } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import type { ProductsSectionType } from '../../../../shared';

interface Props {
  entityTypeId: number;
  entityId: number;
  sectionId: number;
  sectionType: ProductsSectionType;
  orderId: number;
  barcode: string;
  control: ModalControl;
  onClear: () => void;
}

const ProductIsNotInOrderWarningModal = observer((props: Props) => {
  const { control, barcode, entityId, entityTypeId, orderId, sectionId, sectionType, onClear } =
    props;

  const { t } = useTranslation('module.products', {
    keyPrefix:
      'products.pages.shipment_page.ui.product_barcodes_control.modals.product_is_not_in_order_warning_modal',
  });

  return (
    <WarningModal
      width="420px"
      icon="warning"
      isDanger={false}
      maxHeight="400px"
      title={t('title')}
      isOpened={control.opened}
      approveTitle={t('approve_title')}
      annotation={t('annotation', { barcode })}
      approveLinkProps={{
        target: '_blank',
        to: routes.cardProductsOrder({ entityTypeId, entityId, sectionId, sectionType, orderId }),
      }}
      onClose={() => {
        onClear();
        control.close();
      }}
    />
  );
});

ProductIsNotInOrderWarningModal.displayName = 'ProductIsNotInOrderWarningModal';
export { ProductIsNotInOrderWarningModal };
