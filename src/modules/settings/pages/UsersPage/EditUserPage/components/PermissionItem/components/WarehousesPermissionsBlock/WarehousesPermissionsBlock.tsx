import { ProductWarehousesSelect } from '@/modules/products';
import { FormGroup, FormItemLabel, Hint } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { EditUserStore } from '../../../../../../../store';

interface Props {
  productsSectionId: number;
  editUserStore: EditUserStore;
}

const WarehousesPermissionsBlock = observer((props: Props) => {
  const { productsSectionId, editUserStore } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.edit_user_page.ui.products_permissions_item',
  });

  const warehouseStore = useMemo(
    () => editUserStore.getWarehouseStoreByProductsSectionId(productsSectionId),
    [productsSectionId, editUserStore]
  );

  return (
    <FormGroup $gap="16px" $noEllipsis $margin={0}>
      <FormItemLabel
        $gap="4px"
        title={t('warehouses_title')}
        $color="var(--button-text-graphite-secondary-text)"
      >
        {t('warehouses_title')}

        <Hint text={t('warehouses_hint')} />
      </FormItemLabel>

      <ProductWarehousesSelect
        ignoreAccessible
        titleWidth="320px"
        warehouseStore={warehouseStore}
        variant="outlined-without-active-shadow"
        model={editUserStore.accessibleWarehouses}
        placeholder={t('placeholders.all_warehouses')}
      />
    </FormGroup>
  );
});

WarehousesPermissionsBlock.displayName = 'WarehousesPermissionsBlock';
export { WarehousesPermissionsBlock };
