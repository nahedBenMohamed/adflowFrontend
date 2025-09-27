import { routes } from '@/app';
import { CardTab } from '@/modules/card';
import { WarningModal } from '@/shared';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDeleteEntityProductOrder } from '../../../../../../../../../api';

interface Props {
  opened: boolean;
  orderId: number;
  entityId: number;
  sectionId: number;
  entityTypeId: number;
  navigateAfterSuccess?: boolean;
  onClose: () => void;
  onApprove?: (returnStocks?: boolean) => Promise<void>;
}

const ReturnOrderStocksWarningModal = (props: Props) => {
  const {
    opened,
    orderId,
    entityId,
    sectionId,
    entityTypeId,
    navigateAfterSuccess,
    onClose,
    onApprove,
  } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.components.common.return_stocks_warning_modal',
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const { mutateAsync } = useDeleteEntityProductOrder({ orderId, sectionId, entityId });

  const handleDelete = async (returnStocks: boolean): Promise<void> => {
    try {
      setLoading(true);

      if (onApprove) {
        await onApprove(returnStocks);
      } else {
        await mutateAsync({ returnStocks });
      }

      onClose();

      if (navigateAfterSuccess)
        navigate(routes.card({ entityTypeId, entityId, tab: CardTab.ORDERS }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <WarningModal
      width="464px"
      icon="warning"
      isDanger={false}
      isOpened={opened}
      title={t('title')}
      cancelOnClose={false}
      cancelDisabled={loading}
      approveDisabled={loading}
      annotation={t('annotation')}
      cancelTitle={t('cancel_title')}
      approveTitle={t('approve_title')}
      onClose={onClose}
      onCancel={() => handleDelete(false)}
      onApprove={() => handleDelete(true)}
    />
  );
};

export { ReturnOrderStocksWarningModal };
