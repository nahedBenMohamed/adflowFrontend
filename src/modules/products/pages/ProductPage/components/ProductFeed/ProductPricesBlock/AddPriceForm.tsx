import { PlusIconButton, SaveCancelButtons, validateForm } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PriceForm } from '../../../../../shared';
import { ProductPriceBlock } from './ProductPriceBlock';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface Props {
  onAdd: (form: PriceForm) => Promise<void>;
}

const AddPriceForm = observer((props: Props) => {
  const { onAdd } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.product_page.ui.product_feed',
  });

  const priceForm = useLocalObservable(() => PriceForm.create());
  const [opened, { close: hide, open }] = useDisclosure(false);

  const [adding, setAdding] = useState(false);

  const handleAdd = async (): Promise<void> => {
    if (!validateForm(priceForm)) return;

    try {
      setAdding(true);

      await onAdd(priceForm);
      priceForm.reset();
      hide();
    } finally {
      setAdding(false);
    }
  };

  const handleCancel = async (): Promise<void> => {
    priceForm.reset();

    hide();
  };

  return (
    <Root>
      {opened && <ProductPriceBlock form={priceForm} isSingleItem={true} />}

      {opened ? (
        <SaveCancelButtons
          saveLoading={adding}
          handleSave={handleAdd}
          handleCancel={handleCancel}
        />
      ) : (
        <PlusIconButton text={t('add_price')} onClick={open} />
      )}
    </Root>
  );
});

AddPriceForm.displayName = 'AddPriceForm';
export { AddPriceForm };
