import { routes } from '@/app';
import { useTranslation } from 'react-i18next';
import type { ProductsSectionType } from '../../../../shared';
import { AddPlaceholderTemplate } from '../../../../shared';

interface Props {
  sectionId: number;
  sectionType: ProductsSectionType;
}

const AddWarehousePlaceholder = (props: Props) => {
  const { sectionId, sectionType } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.product_page.ui.add_warehouse_placeholder',
  });

  return (
    <AddPlaceholderTemplate
      title={t('add_warehouse')}
      link={routes.builderUpdateProductsSection({ moduleId: sectionId, moduleType: sectionType })}
    />
  );
};

export { AddWarehousePlaceholder };
