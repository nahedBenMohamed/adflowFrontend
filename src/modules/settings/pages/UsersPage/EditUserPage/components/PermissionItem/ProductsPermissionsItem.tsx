import { routes } from '@/app';
import type { ProductsSection } from '@/modules/products';
import {
  Action,
  MyRadio,
  PermissionLevel,
  PermissionObjectType,
  type InputModel,
  type MyRadioColorType,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { Fragment, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { ObjectPermissionModel } from '../../../../../shared';
import type { EditUserStore } from '../../../../../store';
import {
  PermissionItemColumnTitle,
  PermissionItemHeader,
  PermissionItemRowTitle,
  WarehousesPermissionsBlock,
} from './components';

const Root = styled.div`
  width: 100%;

  display: flex;
  grid-column: 1 / 3;
  flex-direction: column;
  gap: 16px;

  padding: 24px 32px;
  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;
`;

const ContentGrid = styled.div`
  display: grid;
  row-gap: 16px;
  align-items: center;
  justify-items: center;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: 136px repeat(6, 1fr);

  padding-right: 32px;
`;

type CellChangedFunc = ({
  value,
  model,
}: {
  value: PermissionLevel;
  model: ObjectPermissionModel;
}) => void;

interface PermissionRow {
  title: string;
  colorType: MyRadioColorType;
  value: PermissionLevel;
  cells: PermissionCell[];
}

interface PermissionCell {
  type: PermissionObjectType;
  action: Action;
  changed?: CellChangedFunc;
}

const applyToModel: CellChangedFunc = ({
  value,
  model,
}: {
  value: PermissionLevel;
  model: ObjectPermissionModel;
}): void => {
  model.create.value = value;
  model.view.value = value;
  model.edit.value = value;
  model.delete.value = value;
};

const permissionsRows: PermissionRow[] = [
  {
    title: 'denied',
    colorType: 'danger',
    value: PermissionLevel.DENIED,
    cells: [
      { type: PermissionObjectType.PRODUCTS, action: Action.CREATE },
      { type: PermissionObjectType.PRODUCTS, action: Action.VIEW },
      { type: PermissionObjectType.PRODUCTS, action: Action.EDIT },
      { type: PermissionObjectType.PRODUCTS_ORDER, action: Action.CREATE, changed: applyToModel },
      {
        type: PermissionObjectType.PRODUCTS_SHIPMENT,
        action: Action.CREATE,
        changed: applyToModel,
      },
      { type: PermissionObjectType.PRODUCTS, action: Action.DELETE },
    ],
  },
  {
    title: 'allowed',
    colorType: 'success',
    value: PermissionLevel.ALLOWED,
    cells: [
      { type: PermissionObjectType.PRODUCTS, action: Action.CREATE },
      { type: PermissionObjectType.PRODUCTS, action: Action.VIEW },
      { type: PermissionObjectType.PRODUCTS, action: Action.EDIT },
      { type: PermissionObjectType.PRODUCTS_ORDER, action: Action.CREATE, changed: applyToModel },
      {
        type: PermissionObjectType.PRODUCTS_SHIPMENT,
        action: Action.CREATE,
        changed: applyToModel,
      },
      { type: PermissionObjectType.PRODUCTS, action: Action.DELETE },
    ],
  },
];

interface Props {
  editUserStore: EditUserStore;
  productsSection: ProductsSection;
}

const ProductsPermissionsItem = observer((props: Props) => {
  const { editUserStore, productsSection } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.edit_user_page.ui.products_permissions_item',
  });

  const productsPermissionsModel = editUserStore.getObjectPermissionModel({
    objectType: PermissionObjectType.PRODUCTS,
    objectId: productsSection.id,
  });

  const orderPermissionsModel = editUserStore.getObjectPermissionModel({
    objectType: PermissionObjectType.PRODUCTS_ORDER,
    objectId: productsSection.id,
  });

  const shipmentPermissionsModel = editUserStore.getObjectPermissionModel({
    objectType: PermissionObjectType.PRODUCTS_SHIPMENT,
    objectId: productsSection.id,
  });

  const getPermissionModel = useCallback(
    (type: PermissionObjectType): ObjectPermissionModel => {
      switch (type) {
        case PermissionObjectType.PRODUCTS:
          return productsPermissionsModel;

        case PermissionObjectType.PRODUCTS_ORDER:
          return orderPermissionsModel;

        case PermissionObjectType.PRODUCTS_SHIPMENT:
          return shipmentPermissionsModel;

        default:
          throw new Error(`Incompatible object type ${type} for Product permissions`);
      }
    },
    [productsPermissionsModel, orderPermissionsModel, shipmentPermissionsModel]
  );

  const getPermissionInputModel = useCallback(
    ({ type, action }: { type: PermissionObjectType; action: Action }): InputModel => {
      const permissionModel = getPermissionModel(type);

      switch (action) {
        case Action.CREATE:
          return permissionModel.create;

        case Action.VIEW:
          return permissionModel.view;

        case Action.EDIT:
          return permissionModel.edit;

        case Action.DELETE:
          return permissionModel.delete;

        case Action.REPORT:
          return permissionModel.report;

        case Action.DASHBOARD:
          return permissionModel.dashboard;
      }
    },
    [getPermissionModel]
  );

  const getProductsSectionLink = useCallback(
    (productsSection: ProductsSection): string =>
      routes.products({ sectionId: productsSection.id, sectionType: productsSection.type }),
    []
  );

  return (
    <Root>
      <PermissionItemHeader
        hintText={t('hint')}
        title={productsSection.name}
        link={getProductsSectionLink(productsSection)}
      />

      <ContentGrid>
        <div />

        <PermissionItemColumnTitle>{t('create_product')}</PermissionItemColumnTitle>
        <PermissionItemColumnTitle>{t('view_product')}</PermissionItemColumnTitle>
        <PermissionItemColumnTitle>{t('edit_product')}</PermissionItemColumnTitle>
        <PermissionItemColumnTitle>{t('create_order')}</PermissionItemColumnTitle>
        <PermissionItemColumnTitle>{t('shipment')}</PermissionItemColumnTitle>
        <PermissionItemColumnTitle>{t('delete')}</PermissionItemColumnTitle>

        {permissionsRows.map((r, rowIdx) => (
          <Fragment key={`pm-${productsSection.id}-${rowIdx}`}>
            <PermissionItemRowTitle>{t(r.title)}</PermissionItemRowTitle>

            {r.cells.map((c, cellIdx) => (
              <MyRadio
                key={`cell-${rowIdx}-${cellIdx}`}
                value={r.value}
                colorType={r.colorType}
                model={getPermissionInputModel({ type: c.type, action: c.action })}
                handleChange={v =>
                  c.changed?.({ value: v as PermissionLevel, model: getPermissionModel(c.type) })
                }
              />
            ))}
          </Fragment>
        ))}
      </ContentGrid>

      <WarehousesPermissionsBlock
        editUserStore={editUserStore}
        productsSectionId={productsSection.id}
      />
    </Root>
  );
});

ProductsPermissionsItem.displayName = 'ProductsPermissionsItem';
export { ProductsPermissionsItem };
