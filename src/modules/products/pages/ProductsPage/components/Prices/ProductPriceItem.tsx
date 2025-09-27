import { CurrencySelect, DeleteButton, MyInput } from '@/shared';
import { observer } from 'mobx-react-lite';
import styled, { css } from 'styled-components';
import type { PriceForm } from '../../../../shared';

const Root = styled.div<{ $withDeleteButton: boolean }>`
  display: grid;

  grid-template-columns: 48% 48%;
  gap: 4%;

  ${p =>
    p.$withDeleteButton &&
    css`
      grid-template-columns: 44% 44% 5%;
      gap: 3%;
    `}
`;

interface Props {
  form: PriceForm;
  isSingleItem: boolean;
  onDelete: () => void;
}

const ProductPriceItem = observer((props: Props) => {
  const { form, isSingleItem, onDelete } = props;

  return (
    <Root $withDeleteButton={!isSingleItem}>
      <MyInput variant="outlined" model={form.unitPrice} />

      <CurrencySelect
        titleMinWidth={0}
        model={form.currency}
        dropdownMinWidth="176px"
        variant="outlined-without-active-shadow"
      />

      {!isSingleItem && <DeleteButton onClick={onDelete} />}
    </Root>
  );
});

ProductPriceItem.displayName = 'ProductPriceItem';
export { ProductPriceItem };
