import { AddItemForm } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CreateProductCategoryDto } from '../../../../../../api';
import type { ProductCategoryStore } from '../../../../../../store';
import type { ProductCategory } from '../../../../models';
import { SubcategoryBlock } from '../SubcategoryBlock/SubcategoryBlock';

const Root = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

interface Props {
  parentId: number;
  subcategories: ProductCategory[];
  productCategoryStore: ProductCategoryStore;
  onAdd: (dto: CreateProductCategoryDto) => Promise<void>;
}

const SubcategoryList = observer((props: Props) => {
  const { parentId, productCategoryStore, subcategories, onAdd } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.product_categories_page',
  });

  const onCategoryAdd = useCallback(
    async (name: string): Promise<void> => {
      const dto = new CreateProductCategoryDto({ name, parentId });

      await onAdd(dto);
    },
    [parentId, onAdd]
  );

  return (
    <Root>
      {subcategories.map(sc => (
        <SubcategoryBlock key={sc.id} category={sc} productCategoryStore={productCategoryStore} />
      ))}

      <AddItemForm
        buttonText={t('buttons.add_subcategory')}
        placeholder={t('placeholders.subcategory_name')}
        onAdd={onCategoryAdd}
      />
    </Root>
  );
});

SubcategoryList.displayName = 'SubcategoryList';
export { SubcategoryList };
