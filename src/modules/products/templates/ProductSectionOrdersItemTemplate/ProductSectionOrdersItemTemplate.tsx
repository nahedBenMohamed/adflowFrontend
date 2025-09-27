import { iconStore } from '@/app';
import { EmptyTableBlock, TableSkeleton, TotalTag } from '@/shared';
import { observer } from 'mobx-react-lite';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { Order, ProductsSection, RentalOrder } from '../../shared';

const Root = styled.li`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const IconWrapper = styled.div<{ $iconColor: string }>`
  width: 32px;
  height: 32px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  svg rect,
  svg circle,
  svg ellipse,
  svg path {
    fill: ${p => p.$iconColor};
  }
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  Table: ReactNode;
  productsSection: ProductsSection;
  productOrdersLoaded: boolean;
  productOrders?: Order[] | RentalOrder[];
}

const ProductSectionOrdersItemTemplate = observer((props: Props) => {
  const { Table, productsSection, productOrdersLoaded, productOrders } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.card_products_orders_page.ui',
  });

  return (
    <Root>
      <TitleWrapper>
        <IconWrapper $iconColor={iconStore.productsColor}>
          {iconStore.getByName(productsSection.icon).icon}
        </IconWrapper>

        <Title>{productsSection.name}</Title>

        <TotalTag total={productOrders ? productOrders.length : 0} />
      </TitleWrapper>

      {productOrdersLoaded ? (
        productOrders && productOrders.length > 0 ? (
          Table
        ) : (
          <EmptyTableBlock $height="160px">{t('empty')}</EmptyTableBlock>
        )
      ) : (
        <TableSkeleton
          headRowProps={{
            $backgroundColor: 'var(--graphite-graphite-20)',
          }}
        />
      )}
    </Root>
  );
});

ProductSectionOrdersItemTemplate.displayName = 'ProductSectionOrdersItemTemplate';
export { ProductSectionOrdersItemTemplate };
