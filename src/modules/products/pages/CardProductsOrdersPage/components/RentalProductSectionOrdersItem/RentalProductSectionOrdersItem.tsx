import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useGetEntityRentalProductOrders } from '../../../../api';
import {
  useRentalProductsSectionOrdersColumns,
  type ProductsSection,
  type RentalOrder,
} from '../../../../shared';
import { ProductSectionOrdersItemTemplate } from '../../../../templates';
import { RentalProductSectionOrdersItemTable } from '../RentalProductSectionOrdersItemTable/RentalProductSectionOrdersItemTable';

interface Props {
  entityId: number;
  entityTypeId: number;
  productsSection: ProductsSection;
  fromEncoded?: string;
}

const RentalProductSectionOrdersItem = (props: Props) => {
  const { entityId, entityTypeId, productsSection, fromEncoded } = props;

  const { data: productOrders, isLoading } = useGetEntityRentalProductOrders({
    sectionId: productsSection.id,
    entityId,
  });

  const columns = useRentalProductsSectionOrdersColumns({
    fromEncoded,
    type: 'order',
    sectionId: productsSection.id,
    orderNameLinkProps: {
      entityTypeId,
      entityId,
    },
  });

  const productsSectionOrdersTable = useReactTable<RentalOrder>({
    data: productOrders ?? [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <ProductSectionOrdersItemTemplate
      productOrders={productOrders}
      productOrdersLoaded={!isLoading}
      productsSection={productsSection}
      Table={
        <RentalProductSectionOrdersItemTable
          productsSectionOrdersTable={productsSectionOrdersTable}
        />
      }
    />
  );
};

export { RentalProductSectionOrdersItem };
