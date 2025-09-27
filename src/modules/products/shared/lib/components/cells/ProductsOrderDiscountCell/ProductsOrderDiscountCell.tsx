import { InputWithPercent, MyPopover, type InputModel, type Nullable } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { type CSSProperties } from 'styled-components';

const InputWrapper = styled.div`
  position: relative;
`;

const Hint = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-primary-text);

  padding: 8px;
`;

interface Props {
  discountModel: InputModel;
  maxDiscount: Nullable<number>;
  width?: CSSProperties['width'];
}

const ProductsOrderDiscountCell = memo((props: Props) => {
  const { discountModel, maxDiscount, width } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.card_products_order_page.common',
  });

  const [hintOpened, { close: hideHint, open: showHint }] = useDisclosure(false);

  const validateValue = useCallback(
    (v: string) => {
      const sanitizedValue = v.replace(',', '.');

      const isValidValue = !v.length || !maxDiscount || parseFloat(sanitizedValue) <= maxDiscount;

      if (!isValidValue) showHint();

      return isValidValue;
    },
    [maxDiscount, showHint]
  );

  const handleChange = useCallback(() => {
    if (hintOpened) hideHint();
  }, [hintOpened, hideHint]);

  return (
    <MyPopover
      opened={hintOpened}
      withinPortal
      Target={
        <InputWrapper>
          <InputWithPercent
            model={discountModel}
            placeholder="0"
            width={width ?? '92px'}
            validateValue={validateValue}
            handleChange={handleChange}
          />
        </InputWrapper>
      }
    >
      <Hint>
        {t('products_order_max_discount_hint')} {maxDiscount}%
      </Hint>
    </MyPopover>
  );
});

ProductsOrderDiscountCell.displayName = 'ProductsOrderDiscountCell';
export { ProductsOrderDiscountCell };
