import { BuilderStepTitle } from '@/modules/builder';
import { AddItemForm } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CreateProductCategoryDto } from '../../../../api';
import type { ProductCategoryStore } from '../../../../store';
import { CategoryBlock, CategoryBlockSkeleton } from './components';

const Root = styled.div`
  padding: 24px;

  padding: 16px;
  background: var(--primary-statuses-white-0);
  border: 1px solid var(--graphite-graphite-80);
  border-radius: var(--border-radius-block);
`;

const CategoriesBlockList = styled.div`
  max-width: 600px;

  display: flex;
  flex-direction: column;
  gap: 16px;

  padding-top: 16px;
`;

interface Props {
  productCategoryStore: ProductCategoryStore;
  showSkeleton?: boolean;
}

const ProductCategoriesBlock = observer((props: Props) => {
  const { productCategoryStore, showSkeleton } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.product_categories_page',
  });

  const { categories, isLoaded, addCategory } = productCategoryStore;

  const onCategoryAdd = useCallback(
    async (name: string): Promise<void> => {
      const dto = new CreateProductCategoryDto({ name, parentId: null });

      await addCategory(dto);
    },
    [addCategory]
  );

  return (
    <Root>
      <BuilderStepTitle>{t('title')}</BuilderStepTitle>

      <CategoriesBlockList>
        <AddItemForm
          placeholder={t('placeholders.category_name')}
          buttonText={t('buttons.add_category')}
          onAdd={onCategoryAdd}
        />

        {isLoaded
          ? categories.map((c, idx) => (
              <CategoryBlock
                key={c.id}
                category={c}
                defaultOpened={idx === 0 || idx === 1}
                productCategoryStore={productCategoryStore}
              />
            ))
          : showSkeleton &&
            new Array(3)
              .fill(0)
              .map((_, idx) => <CategoryBlockSkeleton key={idx} $delay={idx * 300} />)}
      </CategoriesBlockList>
    </Root>
  );
});

export { ProductCategoriesBlock };
