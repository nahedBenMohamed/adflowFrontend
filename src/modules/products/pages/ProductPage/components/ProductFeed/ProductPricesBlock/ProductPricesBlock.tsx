import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback } from 'react';
import styled from 'styled-components';
import { productPriceApi } from '../../../../../api';
import { PriceForm, type ProductPrice } from '../../../../../shared';
import { AddPriceForm } from './AddPriceForm';
import { ProductPriceBlock } from './ProductPriceBlock';

const Root = styled.div<{ $disabled: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 16px;

  ${p => p.$disabled && `pointer-events: none`};
`;

interface Props {
  disabled: boolean;
  sectionId: number;
  productId: number;
  prices: ProductPrice[];
}

const ProductPricesBlock = observer((props: Props) => {
  const { disabled, sectionId, productId, prices } = props;

  const priceForms = useLocalObservable(() => prices.map(p => PriceForm.fromPrice(p)));

  const addPrice = useCallback(
    async (priceForm: PriceForm): Promise<void> => {
      const price = await productPriceApi.addPrice({
        sectionId,
        productId,
        dto: priceForm.toDto(),
      });

      priceForms.push(PriceForm.fromPrice(price));
    },
    [productId, sectionId, priceForms]
  );

  const update = useCallback(
    async (priceForm: PriceForm): Promise<void> => {
      if (!priceForm.id)
        throw new Error(
          `Failed to update price form, priceForm.id does not exist, received: ${priceForm.id}`
        );

      const updatedPrice = await productPriceApi.updatePrice({
        sectionId,
        productId,
        priceId: priceForm.id,
        dto: priceForm.toDto(),
      });

      priceForm.unitPrice.setNumberValue(updatedPrice.unitPrice);
    },
    [productId, sectionId]
  );

  const onDelete = useCallback(
    async (idx: number): Promise<void> => {
      const priceForm = priceForms[idx];

      if (priceForm && priceForm.id !== null) {
        await productPriceApi.deletePrice({ sectionId, productId, priceId: priceForm.id });
      }

      priceForms.splice(idx, 1);
    },
    [productId, sectionId, priceForms]
  );

  return (
    <Root $disabled={disabled}>
      {priceForms.map((p, idx) => (
        <ProductPriceBlock
          key={idx}
          form={p}
          isSingleItem={priceForms.length === 1}
          onUpdate={update}
          onDelete={() => onDelete(idx)}
        />
      ))}

      {!disabled && <AddPriceForm onAdd={addPrice} />}
    </Root>
  );
});

ProductPricesBlock.displayName = 'ProductPricesBlock';
export { ProductPricesBlock };
