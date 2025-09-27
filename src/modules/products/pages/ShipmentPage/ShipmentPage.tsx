import { appStore } from '@/app';
import {
  UriCodingUtil,
  WholePageLoaderWithLogo,
  useTitle,
  useTypedParams,
  type CommonFields,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetProductsSection } from '../../api';
import { ProductsSectionType } from '../../shared';
import { ProductPageTemplate } from '../../templates';
import {
  RentalShipmentComponent,
  ShipmentComponent,
  type RentalShipmentComponentProps,
  type ShipmentComponentProps,
} from './components';

const ShipmentPage = observer(() => {
  const { shipmentId, sectionId, sectionType } = useTypedParams<{
    shipmentId: number;
    sectionId: number;
    sectionType: ProductsSectionType;
  }>();

  const { pathname, search } = useLocation();
  const currentPageEncodedUrl = UriCodingUtil.encode(`${pathname}${search}`);

  const [shipmentName, setShipmentName] = useState('');

  const { data: productsSection } = useGetProductsSection(sectionId);

  useTitle({
    dynamicTitle: productsSection ? `${shipmentName} | ${productsSection?.name}` : undefined,
  });

  if (!appStore.isLoaded)
    return (
      <ProductPageTemplate>
        <WholePageLoaderWithLogo />
      </ProductPageTemplate>
    );

  const commonProps = {
    sectionId,
    shipmentId,
    productsSection,
    currentPageEncodedUrl,
    setShipmentName,
  } satisfies CommonFields<ShipmentComponentProps, RentalShipmentComponentProps>;

  return (
    <ProductPageTemplate productsSection={productsSection} productName={shipmentName}>
      {sectionType === ProductsSectionType.SALE ? (
        <ShipmentComponent {...commonProps} />
      ) : (
        <RentalShipmentComponent {...commonProps} />
      )}
    </ProductPageTemplate>
  );
});

ShipmentPage.displayName = 'ShipmentPage';
export { ShipmentPage };
