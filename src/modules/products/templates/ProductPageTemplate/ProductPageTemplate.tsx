import { iconStore } from '@/app';
import {
  DefaultHeader,
  LeftNavTemplate,
  TruncateMixin,
  TutorialProductType,
  WholePageLoaderWithLogo,
  useTypedParams,
  type DefaultHeaderModuleIconProps,
  type Optional,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, type ReactNode } from 'react';
import styled from 'styled-components';
import {
  ProductsSettingsButton,
  type ProductsSection,
  type ProductsSectionType,
} from '../../shared';
import { productsModuleStore } from '../../store';

const ProductNameWrapper = styled.div`
  max-width: 100%;

  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProductName = styled.span`
  max-width: 100%;

  font-size: 18px;
  font-weight: 600;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

interface Props {
  children: ReactNode;
  productName?: string;
  headerControls?: ReactNode;
  productsSection?: ProductsSection;
  ExtraSettings?: ReactNode;
}

const ProductPageTemplate = observer((props: Props) => {
  const { children, productName, ExtraSettings, headerControls, productsSection } = props;

  const { sectionId, sectionType } = useTypedParams<{
    sectionId: number;
    sectionType: ProductsSectionType;
  }>();

  const { isLoaded, loadData } = productsModuleStore;

  useEffect(() => {
    loadData();
  }, [loadData]);

  const moduleIconProps = useMemo<Optional<DefaultHeaderModuleIconProps>>(
    () =>
      productsSection
        ? {
            icon: iconStore.getByName(productsSection?.icon).icon,
            color: iconStore.productsColor,
          }
        : undefined,
    [productsSection]
  );

  return (
    <LeftNavTemplate
      rootWidth="100%"
      Header={
        <DefaultHeader
          objectId={sectionId}
          unlimitedCentralContent
          moduleIconProps={moduleIconProps}
          moduleName={productsSection?.name}
          productType={TutorialProductType.PRODUCTS_SECTION}
          Controls={
            <>
              {headerControls}

              <ProductsSettingsButton
                sectionId={sectionId}
                sectionType={sectionType}
                ExtraSettings={ExtraSettings}
              />
            </>
          }
          CentralContent={
            productName && (
              <ProductNameWrapper>
                <ProductName>{productName}</ProductName>
              </ProductNameWrapper>
            )
          }
        />
      }
    >
      {isLoaded ? children : <WholePageLoaderWithLogo ensureHeader />}
    </LeftNavTemplate>
  );
});

ProductPageTemplate.displayName = 'ProductPageTemplate';
export { ProductPageTemplate };
