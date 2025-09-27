import { useGetProductsSections, type ProductsSection } from '@/modules/products';
import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import {
  generateCompositeProductsReportValue,
  productsGeneralReportSections,
  reportSectionToProductsReportTypeMap,
  type ProductsReportType,
  type RenderTabs,
} from '../../../../../../../shared';
import { CollapsibleGroup, StyledTab } from '../components';

interface Props {
  entityTypeId: number;
  setProductsGeneralReportTabs: Dispatch<SetStateAction<RenderTabs<ProductsReportType>[]>>;
}

const ProductsGeneralReportTabListEntity = (props: Props) => {
  const { entityTypeId, setProductsGeneralReportTabs } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.reports_page.components.reports_navigation_sidebar',
  });

  const { data: productsSections } = useGetProductsSections();

  useEffect(() => {
    if (!productsSections) return;

    const tabs = productsSections.flatMap<RenderTabs<ProductsReportType>>(s =>
      reportSectionToProductsReportTypeMap.map(d => ({
        value: generateCompositeProductsReportValue({
          entityTypeId,
          reportSection: d.value,
          productsSectionId: s.id,
          productsSectionType: s.type,
        }),
        reportType: d.reportType,
      }))
    );

    setProductsGeneralReportTabs(prev => {
      const oldTabs = prev.filter(t => !tabs.map(t => t.value).includes(t.value));

      return [...oldTabs, ...tabs];
    });
  }, [productsSections, entityTypeId, setProductsGeneralReportTabs]);

  if (!productsSections) return null;

  const linkedProductsSections: ProductsSection[] = productsSections.filter(s =>
    s.entityTypeIds.includes(entityTypeId)
  );

  return linkedProductsSections.map(ps => (
    <CollapsibleGroup key={ps.id} title={ps.name}>
      {productsGeneralReportSections.map(s => (
        <StyledTab
          key={s}
          value={generateCompositeProductsReportValue({
            entityTypeId,
            reportSection: s,
            productsSectionId: ps.id,
            productsSectionType: ps.type,
          })}
        >
          {t(s)}
        </StyledTab>
      ))}
    </CollapsibleGroup>
  ));
};

export { ProductsGeneralReportTabListEntity };
