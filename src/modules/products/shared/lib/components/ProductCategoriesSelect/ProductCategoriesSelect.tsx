import {
  DropdownScrollbarMixin,
  GroupIcon,
  MiniLoader,
  MultiselectCheckIcon,
  MultiselectModel,
  MySelectCustomTemplate,
  NoOptionsMessage,
  SpanWithEllipsis,
  SubgroupIcon,
  useDropdownWidth,
  type MySelectTitleRootVariant,
  type Nullable,
  type Optional,
  type SelectModel,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { ProductCategoryStore } from '../../../../store';

const CategoriesList = styled.div<{ $maxHeight: CSSProperties['maxHeight'] }>`
  max-height: ${p => p.$maxHeight};

  ${DropdownScrollbarMixin}

  padding: 0;
`;

const CategoryBlock = styled.ul`
  display: flex;
  flex-direction: column;
`;

const CategoryItem = styled.li<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 8px;

  &:hover {
    cursor: pointer;

    background-color: ${p => (p.$active ? '#e6fbda' : '#f3fded')};
  }

  ${p => p.$active && `background-color: #e6fbda`};
`;

const SubcategoryItem = styled(CategoryItem)`
  padding-left: 32px;
`;

const IconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

type MultiselectChangeHandler = (categoryIds: number[]) => void;
type SelectChangeHandler = (categoryId: Nullable<number>) => void;

export interface ProductCategoriesSelectProps<
  M extends SelectModel | MultiselectModel<number> = SelectModel,
> {
  model: M;
  productCategoryStore: ProductCategoryStore;
  disabled?: boolean;
  clearable?: boolean;
  titleWidth?: CSSProperties['width'];
  maxHeight?: CSSProperties['maxHeight'];
  dropdownMinWidth?: CSSProperties['minWidth'];
  variant?: MySelectTitleRootVariant;
  handleChange?: M extends SelectModel ? SelectChangeHandler : MultiselectChangeHandler;
}

const ProductCategoriesSelect = observer(
  <M extends SelectModel | MultiselectModel<number> = SelectModel>(
    props: ProductCategoriesSelectProps<M>
  ) => {
    const {
      model,
      titleWidth,
      productCategoryStore,
      maxHeight = '332px',
      dropdownMinWidth,
      clearable,
      disabled,
      variant = 'outlined',
      handleChange,
    } = props;

    const { t } = useTranslation('module.products', {
      keyPrefix: 'products.components.common.products_category_select',
    });

    const [opened, { close, open }] = useDisclosure(false);

    const { categories, isLoaded, getCategoryById } = productCategoryStore;

    const [dropdownWidth, ref] = useDropdownWidth();

    const isMultiselect = model instanceof MultiselectModel;

    const getHandleSelectHandler = useCallback<(categoryId: number) => () => void>(
      (categoryId: number) => () => {
        if (isMultiselect) {
          const categoryIds = model.values.includes(categoryId)
            ? model.values.filter(id => id !== categoryId)
            : [...model.values, categoryId];

          model.setValue(categoryIds);

          (handleChange as Optional<MultiselectChangeHandler>)?.(categoryIds);
        } else {
          if (model.value === categoryId) return;

          model.setValue(categoryId);

          (handleChange as Optional<SelectChangeHandler>)?.(categoryId);
        }
      },
      [model, isMultiselect, handleChange]
    );

    const generateLabel = useCallback((): Optional<string> => {
      if (!isLoaded) return;

      if (isMultiselect) {
        if (model.values.length === 0) return;

        const categories = model.values.map(id => getCategoryById(id)).map(c => c.name);

        return categories.join(', ');
      } else {
        if (!model.value) return;

        return getCategoryById(model.value).name;
      }
    }, [isLoaded, model, isMultiselect, getCategoryById]);

    const label = generateLabel();

    const getClearHandler = useCallback<() => Optional<() => void>>(
      () =>
        clearable && label
          ? () => {
              if (isMultiselect) {
                model.values = [];

                (handleChange as Optional<MultiselectChangeHandler>)?.([]);
              } else {
                model.value = null;

                (handleChange as Optional<SelectChangeHandler>)?.(null);
              }
            }
          : undefined,
      [model, clearable, label, isMultiselect, handleChange]
    );

    const isCategorySelected = useCallback(
      (categoryId: number) => {
        if (isMultiselect) return model.values.includes(categoryId);

        return model.value === categoryId;
      },
      [model, isMultiselect]
    );

    return (
      <MySelectCustomTemplate
        ref={ref}
        withinPortal
        label={label}
        opened={opened}
        variant={variant}
        disabled={disabled}
        width={dropdownWidth}
        titleWidth={titleWidth}
        dropdownMinWidth={dropdownMinWidth}
        placeholder={t('placeholders.select_category')}
        show={open}
        hide={close}
        onClear={getClearHandler()}
      >
        <CategoriesList $maxHeight={maxHeight}>
          {categories.length > 0 ? (
            categories.map(c => (
              <CategoryBlock key={c.id}>
                <CategoryItem
                  $active={isMultiselect ? false : isCategorySelected(c.id)}
                  onClick={getHandleSelectHandler(c.id)}
                >
                  {isMultiselect && <MultiselectCheckIcon visible={isCategorySelected(c.id)} />}

                  <IconWrapper>
                    <GroupIcon />
                  </IconWrapper>

                  <SpanWithEllipsis text={c.name} />
                </CategoryItem>

                {c.children.map(sc => (
                  <SubcategoryItem
                    key={sc.id}
                    $active={isMultiselect ? false : isCategorySelected(sc.id)}
                    onClick={getHandleSelectHandler(sc.id)}
                  >
                    {isMultiselect && <MultiselectCheckIcon visible={isCategorySelected(sc.id)} />}

                    <IconWrapper>
                      <SubgroupIcon />
                    </IconWrapper>

                    <SpanWithEllipsis text={sc.name} />
                  </SubcategoryItem>
                ))}
              </CategoryBlock>
            ))
          ) : (
            <NoOptionsMessage>
              {isLoaded ? (
                t('no_categories')
              ) : (
                <MiniLoader color="var(--primary-statuses-green-520)" />
              )}
            </NoOptionsMessage>
          )}
        </CategoriesList>
      </MySelectCustomTemplate>
    );
  }
);

ProductCategoriesSelect.displayName = 'ProductCategoriesSelect';
export { ProductCategoriesSelect };
