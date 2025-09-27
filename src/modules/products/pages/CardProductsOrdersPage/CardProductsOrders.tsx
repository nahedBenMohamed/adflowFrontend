import styled from 'styled-components';
import { useGetEntityProductOrders } from '../../api';
import { ProductsSectionType, type ProductsSection } from '../../shared';
import { ProductSectionOrdersItem, RentalProductSectionOrdersItem } from './components';

const Root = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 16px 0;
`;

interface Props {
  etId: number;
  entityId: number;
  fromEncoded?: string;
  linkedProductSections?: ProductsSection[];
}

const CardProductsOrders = (props: Props) => {
  const { etId, entityId, fromEncoded, linkedProductSections } = props;

  const { data: productOrders, isLoading: areEntityProductsOrdersLoading } =
    useGetEntityProductOrders(entityId);

  return (
    <Root>
      {linkedProductSections &&
        linkedProductSections.map(ps =>
          ps.type === ProductsSectionType.SALE ? (
            <ProductSectionOrdersItem
              key={ps.id}
              entityId={entityId}
              entityTypeId={etId}
              productsSection={ps}
              fromEncoded={fromEncoded}
              isLoading={areEntityProductsOrdersLoading}
              productOrders={productOrders?.filter(o => o.sectionId === ps.id)}
            />
          ) : (
            <RentalProductSectionOrdersItem
              key={ps.id}
              entityId={entityId}
              entityTypeId={etId}
              productsSection={ps}
              fromEncoded={fromEncoded}
            />
          )
        )}
    </Root>
  );
};

export { CardProductsOrders };
