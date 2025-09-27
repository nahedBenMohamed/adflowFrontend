import { DeleteButton, ExpandButton, GroupIcon, InputModel, MyInput, debounce } from '@/shared';
import { Collapse } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { UpdateProductCategoryDto } from '../../../../../../api';
import type { ProductCategoryStore } from '../../../../../../store';
import type { ProductCategory } from '../../../../models';
import { DeleteCategoryWarningModal } from '../DeleteCategoryWarningModal/DeleteCategoryWarningModal';
import { SubcategoryList } from '../SubcategoryList/SubcategoryList';

const Root = styled.li`
  display: flex;
  flex-direction: column;
  gap: 12px;

  padding: 16px;
  background: var(--primary-statuses-white-0);
  border: 1px solid var(--graphite-graphite-80);
  border-radius: var(--border-radius-block);
`;

const TopBlock = styled.div<{ $deleteButtonVisible: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const IconsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const GroupIconWrapper = styled.div`
  width: 16px;
  height: 16px;
`;

interface Props {
  category: ProductCategory;
  productCategoryStore: ProductCategoryStore;
  defaultOpened?: boolean;
}

const CategoryBlock = observer((props: Props) => {
  const { productCategoryStore, category, defaultOpened } = props;

  const { addCategory, updateCategory, deleteCategory } = productCategoryStore;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'pages.product_categories_page',
  });

  const [deleteWarningOpened, { close: hideDeleteWarning, open: showDeleteWarning }] =
    useDisclosure(false);

  const nameModel = useLocalObservable(() => InputModel.create(category.name).required());

  const [opened, { toggle }] = useDisclosure(defaultOpened);
  const [
    deleteButtonVisible,
    { toggle: toggleDeleteButton, close: hideDeleteButton, open: showDeleteButton },
  ] = useDisclosure(defaultOpened);

  const [updating, setUpdating] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateCategory = useCallback(
    debounce(async (): Promise<void> => {
      if (!nameModel.validate()) return;

      category.name = nameModel.value;

      try {
        setUpdating(true);

        const dto = new UpdateProductCategoryDto(nameModel.value);
        await updateCategory(category.id, dto);
      } finally {
        setUpdating(false);
      }
    }, 500),
    []
  );

  const handleExpand = useCallback(() => {
    toggle();
    toggleDeleteButton();
  }, [toggle, toggleDeleteButton]);

  const getDeleteCategoryHandler = useCallback(
    (categoryId: number) => () => deleteCategory(categoryId),
    [deleteCategory]
  );

  return (
    <Root>
      <TopBlock $deleteButtonVisible={deleteButtonVisible}>
        <InputWrapper>
          <GroupIconWrapper>
            <GroupIcon />
          </GroupIconWrapper>

          <MyInput
            medium
            maxLength={100}
            model={nameModel}
            loading={updating}
            whitespaceClearing
            placeholder={t('placeholders.category_name')}
            onBlur={hideDeleteButton}
            onFocus={showDeleteButton}
            handleChange={debouncedUpdateCategory}
          />
        </InputWrapper>

        <IconsWrapper>
          <DeleteButton size="small" onClick={showDeleteWarning} />

          <ExpandButton expanded={opened} onClick={handleExpand} />
        </IconsWrapper>
      </TopBlock>

      <Collapse in={opened} transitionDuration={200}>
        <SubcategoryList
          parentId={category.id}
          subcategories={category.children}
          productCategoryStore={productCategoryStore}
          onAdd={addCategory}
        />
      </Collapse>

      {deleteWarningOpened && (
        <DeleteCategoryWarningModal
          category={category}
          opened={deleteWarningOpened}
          onClose={hideDeleteWarning}
          onDelete={getDeleteCategoryHandler(category.id)}
        />
      )}
    </Root>
  );
});

CategoryBlock.displayName = 'CategoryBlock';
export { CategoryBlock };
