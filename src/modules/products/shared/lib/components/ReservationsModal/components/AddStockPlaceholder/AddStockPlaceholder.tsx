import { routes } from '@/app';
import { useTranslation } from 'react-i18next';
import type { ProductsSectionType } from '../../../../models';
import { AddPlaceholderTemplate } from '../../../AddPlaceholderTemplate/AddPlaceholderTemplate';

interface Props {
  sectionId: number;
  sectionType: ProductsSectionType;
}

const AddStockPlaceholder = (props: Props) => {
  const { sectionId, sectionType } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix:
      'products.pages.card_products_order_page.ui.card_products_order_component.ui.add_stock_placeholder',
  });

  return (
    <AddPlaceholderTemplate
      title={t('add_stock')}
      link={routes.products({ sectionId, sectionType })}
    />
  );
};

export { AddStockPlaceholder };
