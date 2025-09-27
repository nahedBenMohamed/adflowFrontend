import { routes } from '@/app';
import { CardTab } from '@/modules/card';
import { WarningModal } from '@/shared';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDeleteEntityProductOrder } from '../../../../../../../../../api';

interface Props {
  orderId: number;
  sectionId: number;
  entityId: number;
  opened: boolean;
  entityTypeId: number;
  onClose: () => void;
  onCancel: () => void;
  onApprove?: () => void;
}

const DeleteOrderOrClearItemsWarningModal = (props: Props) => {
  const { orderId, sectionId, entityId, opened, entityTypeId, onClose, onCancel, onApprove } =
    props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.components.common.delete_order_or_clear_items_warning_modal',
  });

  const navigate = useNavigate();

  const { mutateAsync: deleteOrder, isPending } = useDeleteEntityProductOrder({
    orderId,
    entityId,
    sectionId,
  });

  const handleApprove = async (): Promise<void> => {
    if (onApprove) {
      onApprove();

      return;
    }

    await deleteOrder({});
    onClose();

    navigate(routes.card({ entityTypeId, entityId, tab: CardTab.ORDERS }));
  };

  return (
    <WarningModal
      width="480px"
      icon="trashbin"
      maxHeight="356px"
      isOpened={opened}
      title={t('title')}
      cancelOnClose={false}
      cancelDisabled={isPending}
      approveLoading={isPending}
      approveDisabled={isPending}
      annotation={t('annotation')}
      cancelTitle={t('cancel_title')}
      approveTitle={t('approve_title')}
      onClose={onClose}
      onCancel={onCancel}
      onApprove={handleApprove}
    />
  );
};

export { DeleteOrderOrClearItemsWarningModal };
