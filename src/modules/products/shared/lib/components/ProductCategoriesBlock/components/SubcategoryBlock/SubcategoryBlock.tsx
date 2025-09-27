import { DeleteButton, InputModel, MyInput, SubgroupIcon, debounce } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { UpdateProductCategoryDto } from '../../../../../../api';
import type { ProductCategoryStore } from '../../../../../../store';
import type { ProductCategory } from '../../../../models';
import { DeleteCategoryWarningModal } from '../DeleteCategoryWarningModal/DeleteCategoryWarningModal';

const Root = styled.li<{ $deleteButtonVisible: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;

  .workspace__DeleteButton--Root {
    opacity: ${p => (p.$deleteButtonVisible ? 1 : 0)};
    scale: ${p => (p.$deleteButtonVisible ? 1 : 0)};
  }

  &:hover {
    .workspace__DeleteButton--Root {
      opacity: 1;
      scale: 1;
    }
  }
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 8px;
`;

const SubgroupIconWrapper = styled.div`
  width: 16px;
  height: 16px;
`;

interface Props {
  productCategoryStore: ProductCategoryStore;
  category: ProductCategory;
}

const SubcategoryBlock = observer((props: Props) => {
  const { productCategoryStore, category } = props;

  const { updateCategory, deleteCategory } = productCategoryStore;

  const { t } = useTranslation('module.products', { keyPrefix: 'pages.product_categories_page' });

  const model = useLocalObservable(() => InputModel.create(category.name).required());

  const [updating, setUpdating] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateGroup = useCallback(
    debounce(async (): Promise<void> => {
      if (!model.validate()) {
        return;
      }

      try {
        setUpdating(true);

        const dto = new UpdateProductCategoryDto(model.value);
        await updateCategory(category.id, dto);
      } finally {
        setUpdating(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    category.name = model.value;
  }, [model.value, category]);

  const [deleteButtonVisible, { close: hideDeleteButton, open: showDeleteButton }] =
    useDisclosure(false);
  const [
    deleteWarningModalOpened,
    { close: hideDeleteWarningModal, open: showDeleteWarningModal },
  ] = useDisclosure(false);

  return (
    <Root $deleteButtonVisible={deleteButtonVisible}>
      <InputWrapper>
        <SubgroupIconWrapper>
          <SubgroupIcon />
        </SubgroupIconWrapper>

        <MyInput
          model={model}
          loading={updating}
          placeholder={t('placeholders.subcategory_name')}
          handleChange={debouncedUpdateGroup}
          onBlur={hideDeleteButton}
          onFocus={showDeleteButton}
        />
      </InputWrapper>

      <DeleteButton size="small" onClick={showDeleteWarningModal} />

      {deleteWarningModalOpened && (
        <DeleteCategoryWarningModal
          category={category}
          opened={deleteWarningModalOpened}
          onDelete={() => deleteCategory(category.id)}
          onClose={hideDeleteWarningModal}
        />
      )}
    </Root>
  );
});

SubcategoryBlock.displayName = 'SubcategoryBlock';
export { SubcategoryBlock };
