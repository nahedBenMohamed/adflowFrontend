import { authStore } from '@/modules/auth';
import { CurrencySelect, DeleteButton, debounce } from '@/shared';
import { InputWithPercent, MyInput, MyTooltip } from '@/shared/lib';
import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { PriceForm } from '../../../../../shared';

const Root = styled.div`
  display: grid;

  grid-template-columns: 1fr 25% 35% 56px 20px;
  justify-content: flex-start;
  gap: 8px;
`;

interface Props {
  form: PriceForm;
  isSingleItem: boolean;
  onUpdate?: (form: PriceForm) => Promise<void>;
  onDelete?: () => Promise<void>;
}

const ProductPriceBlock = observer((props: Props) => {
  const { form, isSingleItem, onDelete, onUpdate } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.product_page.ui.product_feed',
  });

  const { user: currentUser } = authStore;

  const [deleting, setDeleting] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const update = useCallback(
    debounce(() => {
      if (!onUpdate) return;

      if (!form.validate()) return;

      onUpdate(form);
    }, 500),
    []
  );

  const handleDelete = async (): Promise<void> => {
    try {
      setDeleting(true);

      await onDelete?.();
    } finally {
      setDeleting(false);
    }
  };

  const validatePercentageValue = useCallback(
    (value: string): boolean => {
      return !value.length || (form.maxDiscount.validate() && parseFloat(value) <= 100);
    },
    [form.maxDiscount]
  );

  const canEditMaxDiscount = currentUser?.isAdmin() || currentUser?.isOwner();

  return (
    <Root>
      <MyInput
        height="26px"
        model={form.name}
        variant="outlined"
        placeholder={t('placeholders.name')}
        handleChange={update}
      />

      <MyTooltip label={t('labels.product_cost')}>
        <MyInput
          variant="outlined"
          model={form.unitPrice}
          placeholder={t('placeholders.unit_price')}
          handleChange={update}
        />
      </MyTooltip>

      <CurrencySelect model={form.currency} handleChange={update} />

      <InputWithPercent
        placeholder="0"
        model={form.maxDiscount}
        disabled={!canEditMaxDiscount}
        label={t('labels.maximum_discount')}
        handleChange={update}
        validateValue={validatePercentageValue}
      />

      {!isSingleItem && <DeleteButton deleting={deleting} onClick={handleDelete} />}
    </Root>
  );
});

ProductPriceBlock.displayName = 'ProductPriceBlock';
export { ProductPriceBlock };
