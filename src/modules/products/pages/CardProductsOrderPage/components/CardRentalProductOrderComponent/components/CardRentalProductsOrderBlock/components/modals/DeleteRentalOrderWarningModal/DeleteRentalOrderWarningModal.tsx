import { routes } from '@/app';
import { CardTab } from '@/modules/card';
import { WarningModal } from '@/shared';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDeleteEntityRentalProductOrder } from '../../../../../../../../../api';

interface Props {
  opened: boolean;
  orderId: number;
  sectionId: number;
  entityId: number;
  entityTypeId: number;
  onClose: () => void;
}

const DeleteRentalOrderWarningModal = (props: Props) => {
  const { opened, orderId, sectionId, entityId, entityTypeId, onClose } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.components.common.delete_order_warning_modal',
  });

  const navigate = useNavigate();

  const { mutateAsync, isPending } = useDeleteEntityRentalProductOrder({
    orderId,
    sectionId,
    entityId,
  });

  const handleDeleteOrder = async (): Promise<void> => {
    await mutateAsync();
    onClose();

    navigate(routes.card({ entityTypeId, entityId, tab: CardTab.ORDERS }));
  };

  return (
    <WarningModal
      width="464px"
      icon="trashbin"
      maxHeight="356px"
      isOpened={opened}
      title={t('title')}
      cancelDisabled={isPending}
      approveLoading={isPending}
      approveDisabled={isPending}
      annotation={t('annotation')}
      onClose={onClose}
      onApprove={handleDeleteOrder}
    />
  );
};

export { DeleteRentalOrderWarningModal };
