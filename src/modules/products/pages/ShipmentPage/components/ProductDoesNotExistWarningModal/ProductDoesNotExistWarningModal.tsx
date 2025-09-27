import { routes } from '@/app';
import { WarningModal, type ModalControl } from '@/shared';
import { useTranslation } from 'react-i18next';
import type { ProductsSectionType } from '../../../../shared';

interface Props {
  control: ModalControl;
  barcode: string;
  sectionId: number;
  sectionType: ProductsSectionType;
  onClear: () => void;
}

const ProductDoesNotExistWarningModal = (props: Props) => {
  const { control, barcode, sectionId, sectionType, onClear } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix:
      'products.pages.shipment_page.ui.product_barcodes_control.modals.product_does_not_exist_warning_modal',
  });

  return (
    <WarningModal
      width="420px"
      icon="warning"
      isDanger={false}
      maxHeight="376px"
      title={t('title')}
      isOpened={control.opened}
      approveTitle={t('approve_title')}
      annotation={t('annotation', { barcode })}
      approveLinkProps={{
        to: routes.products({ sectionId, sectionType, addProduct: true, sku: barcode }),
        target: '_blank',
      }}
      onClose={() => {
        onClear();
        control.close();
      }}
    />
  );
};

export { ProductDoesNotExistWarningModal };
