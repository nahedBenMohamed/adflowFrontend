import { MyInput, type InputModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ScanBarcodeIcon } from '../../../../../../shared';
import { AddProductModalFormGroup } from '../AddProductModalFormGroup/AddProductModalFormGroup';

const SkuWrapper = styled.div`
  position: relative;

  input {
    padding-right: 26px;
  }
`;

const ScanBarcodeIconWrapper = styled.div`
  position: absolute;
  right: 8px;
  top: 5px;

  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

interface Props {
  sku: InputModel;
  checkingSku: boolean;
  barcodesEnabled: boolean;
  checkDuplicateSku: (sku: string) => void;
}

const AddProductModalSkuField = observer((props: Props) => {
  const { sku, checkingSku, barcodesEnabled, checkDuplicateSku } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.products_page.ui.add_product_modal',
  });

  return (
    <AddProductModalFormGroup
      text={t('sku')}
      hintText={barcodesEnabled ? t('barcodes_hint') : undefined}
    >
      <SkuWrapper>
        <MyInput
          model={sku}
          variant="outlined"
          loading={checkingSku}
          handleChange={checkDuplicateSku}
        />

        {barcodesEnabled && !checkingSku && (
          <ScanBarcodeIconWrapper>
            <ScanBarcodeIcon />
          </ScanBarcodeIconWrapper>
        )}
      </SkuWrapper>
    </AddProductModalFormGroup>
  );
});

AddProductModalSkuField.displayName = 'AddProductModalSkuField';
export { AddProductModalSkuField };
