import { routes } from '@/app';
import { ReportsSection, generateCompositeProductsReportValue } from '@/modules/reporting';
import {
  CalendarTabIcon,
  ProductsTabIcon,
  ReportsTabIcon,
  ShipmentsTabIcon,
  type Optional,
  type TabModel,
} from '@/shared';
import { type TFunction } from 'i18next';
import { ProductsPageTabs, ProductsSectionType, type ProductsSection } from '../models';

export const getProductsPageTabs = ({
  sectionId,
  sectionType,
  hideShipments,
  canViewShipments,
  productsSection,
  t,
}: {
  sectionId: number;
  sectionType: ProductsSectionType;
  hideShipments: boolean;
  canViewShipments: Optional<boolean>;
  productsSection?: ProductsSection;
  t: TFunction;
}) => {
  const isRental = sectionType === ProductsSectionType.RENTAL;

  const tabs: TabModel[] = [
    {
      Icon: <ProductsTabIcon />,
      title: t(`tabs.${ProductsPageTabs.PRODUCTS}`),
      href: routes.products({
        sectionId,
        sectionType,
      }),
    },
  ];

  if (isRental)
    tabs.push({
      Icon: <CalendarTabIcon />,
      title: t(`tabs.${ProductsPageTabs.TIMETABLE}`),
      href: routes.products({
        sectionId,
        sectionType,
        tab: ProductsPageTabs.TIMETABLE,
      }),
    });

  if (canViewShipments && (!hideShipments || isRental))
    tabs.push({
      Icon: <ShipmentsTabIcon />,
      title: t(`tabs.${ProductsPageTabs.SHIPMENTS}`),
      href: routes.shipments({
        sectionId,
        sectionType,
      }),
    });

  if (productsSection) {
    const firstLinkedEntityTypeId = productsSection.entityTypeIds[0];

    if (firstLinkedEntityTypeId)
      tabs.push({
        Icon: <ReportsTabIcon />,
        href: routes.productsReports({
          sectionId,
          sectionType,
          reportsSection: generateCompositeProductsReportValue({
            productsSectionId: productsSection.id,
            entityTypeId: firstLinkedEntityTypeId,
            reportSection: ReportsSection.PRODUCTS,
            productsSectionType: productsSection.type,
          }),
        }),
        title: t(`tabs.${ProductsPageTabs.REPORTS}`),
      });
  }

  return tabs;
};
