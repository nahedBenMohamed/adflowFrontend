import { WarningModal } from '@/shared';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProductCategory } from '../../../../models';

interface Props {
  category: ProductCategory;
  opened: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
}

const DeleteCategoryWarningModal = (props: Props) => {
  const { category, opened, onClose, onDelete } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.product_categories_page.ui.delete_category_warning_modal',
  });

  const [deleting, setDeleting] = useState(false);

  const handleApproveDelete = async (): Promise<void> => {
    try {
      setDeleting(true);

      await onDelete();
    } finally {
      setDeleting(false);
    }

    onClose();
  };

  return (
    <WarningModal
      isDanger
      maxHeight="350px"
      isOpened={opened}
      approveLoading={deleting}
      approveDisabled={deleting}
      title={t('title', { name: category.name })}
      annotation={category.parentId ? t('cannot_be_undone') : t('annotation')}
      onClose={onClose}
      onApprove={handleApproveDelete}
    />
  );
};

export { DeleteCategoryWarningModal };
