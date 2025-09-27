import { entityTypeStore } from '@/app';
import type { ProductsSection } from '@/modules/products';
import type { EntityType } from '@/shared';
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
  productsSection: ProductsSection;
  setProductsGeneralReportTabs: Dispatch<SetStateAction<RenderTabs<ProductsReportType>[]>>;
}

const ProductsGeneralReportTabListSection = (props: Props) => {
  const { productsSection, setProductsGeneralReportTabs } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.reports_page.components.reports_navigation_sidebar',
  });

  const linkedEntityTypes = productsSection.entityTypeIds.map<EntityType>(id =>
    entityTypeStore.getById(id)
  );

  useEffect(() => {
    const tabs = linkedEntityTypes.flatMap<RenderTabs<ProductsReportType>>(et =>
      reportSectionToProductsReportTypeMap.map<RenderTabs<ProductsReportType>>(s => ({
        reportType: s.reportType,
        value: generateCompositeProductsReportValue({
          entityTypeId: et.id,
          reportSection: s.value,
          productsSectionId: productsSection.id,
          productsSectionType: productsSection.type,
        }),
      }))
    );

    setProductsGeneralReportTabs(prev => {
      const oldTabs = prev.filter(t => !tabs.map<string>(t => t.value).includes(t.value));

      return [...oldTabs, ...tabs];
    });
  });

  return linkedEntityTypes.map(et => (
    <CollapsibleGroup key={et.id} title={et.name}>
      {productsGeneralReportSections.map(s => (
        <StyledTab
          key={s}
          value={generateCompositeProductsReportValue({
            reportSection: s,
            entityTypeId: et.id,
            productsSectionId: productsSection.id,
            productsSectionType: productsSection.type,
          })}
        >
          {t(s)}
        </StyledTab>
      ))}
    </CollapsibleGroup>
  ));
};

export { ProductsGeneralReportTabListSection };
