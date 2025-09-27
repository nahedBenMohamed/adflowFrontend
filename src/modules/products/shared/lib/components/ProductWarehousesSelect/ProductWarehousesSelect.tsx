import {
  DropdownScrollbarMixin,
  MiniLoader,
  MultiselectCheckIcon,
  MultiselectModel,
  MySelectCustomTemplate,
  NoOptionsMessage,
  SelectModel,
  SpanWithEllipsis,
  TruncateMixin,
  useDropdownWidth,
  type MySelectTitleRootVariant,
  type Nullable,
  type Optional,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { WarehouseStore } from '../../../../store';
import { WarehouseIcon } from '../../../assets';
import type { Warehouse } from '../../models';

const WarehousesList = styled.ul`
  max-height: 332px;

  ${DropdownScrollbarMixin}

  padding: 0;
`;

const WarehouseItem = styled.li<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
  transition: var(--transition-200);

  padding: 7px 8px;

  &:hover {
    cursor: pointer;

    background-color: ${p => (p.$active ? '#e6fbda' : '#f3fded')};
  }

  ${p => p.$active && `background-color: #e6fbda`};

  ${TruncateMixin}
`;

const IconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

type MultiselectChangeHandler = (warehouseIds: number[]) => void;
type SelectChangeHandler = (warehouseId: Nullable<number>) => void;

type ProductWarehousesSelectPropsModelVariant =
  | SelectModel
  | MultiselectModel<number>
  | Nullable<number>;

export interface ProductWarehousesSelectProps<
  M extends ProductWarehousesSelectPropsModelVariant = SelectModel,
> {
  model: M;
  warehouseStore: WarehouseStore;
  hidden?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  placeholder?: string;
  titleWidth?: CSSProperties['width'];
  dropdownMinWidth?: CSSProperties['minWidth'];
  variant?: MySelectTitleRootVariant;
  ignoreAccessible?: boolean;
  onClear?: () => void;
  handleChange?: M extends MultiselectModel<number>
    ? MultiselectChangeHandler
    : SelectChangeHandler;
}

const ProductWarehousesSelect = observer(
  <M extends ProductWarehousesSelectPropsModelVariant = SelectModel>(
    props: ProductWarehousesSelectProps<M>
  ) => {
    const { t } = useTranslation('module.products', {
      keyPrefix: 'products.components.common.products_warehouse_select',
    });

    const {
      model,
      warehouseStore,
      hidden,
      disabled,
      clearable,
      titleWidth,
      dropdownMinWidth,
      variant = 'outlined',
      placeholder = t('placeholders.select_warehouse'),
      ignoreAccessible,
      onClear,
      handleChange,
    } = props;

    const [opened, { close, open }] = useDisclosure(false);

    // We use find instead of get so that one model can be used for multiple components with different stores
    const { activeWarehouses, accessibleWarehouses, isLoaded, findWarehouseById } = warehouseStore;

    const warehouses = useMemo<Warehouse[]>(
      () => (ignoreAccessible ? activeWarehouses : accessibleWarehouses),
      [activeWarehouses, accessibleWarehouses, ignoreAccessible]
    );

    const [dropdownWidth, ref] = useDropdownWidth();

    const isMultiselect = model instanceof MultiselectModel;
    const isSelect = model instanceof SelectModel;

    const getSelectHandler = useCallback<(warehouseId: number) => () => void>(
      (warehouseId: number) => () => {
        if (isMultiselect) {
          const warehouseIds = model.values.includes(warehouseId)
            ? model.values.filter(id => id !== warehouseId)
            : [...model.values, warehouseId];

          model.setValue(warehouseIds);

          (handleChange as Optional<MultiselectChangeHandler>)?.(warehouseIds);
        } else if (isSelect) {
          if (model.value === warehouseId) return;

          model.setValue(warehouseId);

          (handleChange as Optional<SelectChangeHandler>)?.(warehouseId);
        } else {
          if (model === warehouseId) return;

          (handleChange as Optional<SelectChangeHandler>)?.(warehouseId);
        }
      },
      [model, isMultiselect, isSelect, handleChange]
    );

    const generateLabel = useCallback((): Optional<string> => {
      if (!isLoaded) return;

      if (isMultiselect) {
        if (model.values.length === 0) return;

        const warehouses = model.values
          .map(findWarehouseById)
          .filter(Boolean)
          .map<string>(w => w.name);

        return warehouses.length > 0 ? warehouses.join(', ') : undefined;
      } else if (isSelect) {
        if (!model.value) return;

        return findWarehouseById(model.value)?.name;
      } else {
        if (!model) return;

        return findWarehouseById(model)?.name;
      }
    }, [isLoaded, model, isMultiselect, isSelect, findWarehouseById]);

    const label = generateLabel();

    const getClearHandler = useCallback<() => Optional<() => void>>(
      () =>
        clearable && label
          ? () => {
              if (isMultiselect) {
                model.values = [];

                (handleChange as Optional<MultiselectChangeHandler>)?.([]);
              } else if (isSelect) {
                model.value = null;

                (handleChange as Optional<SelectChangeHandler>)?.(null);
              } else {
                (handleChange as Optional<SelectChangeHandler>)?.(null);
              }

              onClear?.();
            }
          : undefined,
      [model, clearable, label, isMultiselect, isSelect, handleChange, onClear]
    );

    const isWarehouseSelected = useCallback(
      (warehouseId: number) => {
        if (isMultiselect) return model.values.includes(warehouseId);

        if (isSelect) return model.value === warehouseId;

        return model === warehouseId;
      },
      [model, isMultiselect, isSelect]
    );

    return (
      !hidden && (
        <MySelectCustomTemplate
          ref={ref}
          withinPortal
          label={label}
          opened={opened}
          variant={variant}
          disabled={disabled}
          width={dropdownWidth}
          titleWidth={titleWidth}
          placeholder={placeholder}
          dropdownMinWidth={dropdownMinWidth}
          show={open}
          hide={close}
          onClear={disabled ? undefined : getClearHandler()}
        >
          <WarehousesList>
            {isLoaded && warehouses.length > 0 ? (
              warehouses.map(w => (
                <WarehouseItem
                  key={w.id}
                  // so that option will not be colored green when selected,
                  // for this purpose in multiselect view we use check icon
                  $active={isMultiselect ? false : isWarehouseSelected(w.id)}
                  onClick={getSelectHandler(w.id)}
                >
                  {isMultiselect && <MultiselectCheckIcon visible={isWarehouseSelected(w.id)} />}

                  <IconWrapper>
                    <WarehouseIcon />
                  </IconWrapper>

                  <SpanWithEllipsis text={w.name} />
                </WarehouseItem>
              ))
            ) : (
              <NoOptionsMessage>
                {isLoaded ? (
                  t('no_warehouses')
                ) : (
                  <MiniLoader color="var(--primary-statuses-green-520)" />
                )}
              </NoOptionsMessage>
            )}
          </WarehousesList>
        </MySelectCustomTemplate>
      )
    );
  }
);

ProductWarehousesSelect.displayName = 'ProductWarehousesSelect';
export { ProductWarehousesSelect };
