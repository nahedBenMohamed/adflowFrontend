import { routes } from '@/app';
import type { ProductsSectionType } from '@/modules/products';
import {
  AdditionalModuleCategory,
  BuilderAdditionalStorageCategory,
  BuilderMarketplaceCategory,
  ModuleCategory,
} from '../models';

export const getJourneyLink = ({
  moduleCategory,
  productsSectionType,
}: {
  moduleCategory:
    | ModuleCategory
    | AdditionalModuleCategory
    | BuilderMarketplaceCategory
    | BuilderAdditionalStorageCategory;
  productsSectionType?: ProductsSectionType;
}): string => {
  switch (moduleCategory) {
    // Scheduler
    case ModuleCategory.SCHEDULER:
      return routes.builderCreateScheduler();

    // Entity types
    case ModuleCategory.COMPANY:
    case ModuleCategory.CONTACT:
    case ModuleCategory.CRM:
    case ModuleCategory.CONTRACTOR_MANAGEMENT:
    case ModuleCategory.HR_MANAGEMENT:
    case ModuleCategory.PARTNER_MANAGEMENT:
    case ModuleCategory.PROJECT_MANAGEMENT:
    case ModuleCategory.PRODUCTION:
    case ModuleCategory.SUPPLIER_MANAGEMENT:
    case ModuleCategory.UNIVERSAL_MODULE:
      return routes.builderCreateEt(moduleCategory);

    // Products
    case ModuleCategory.PRODUCT_MANAGEMENT_RENTALS:
    case ModuleCategory.PRODUCT_MANAGEMENT_FOR_SALES: {
      if (!productsSectionType)
        throw new Error(
          `productsSectionType must be specified to get products module creation journey link, received ${productsSectionType}`
        );

      return routes.builderCreateProductsSection(productsSectionType);
    }

    // Site forms
    case AdditionalModuleCategory.SITE_FORMS:
      return routes.builderCreateSiteForm();

    case AdditionalModuleCategory.HEADLESS_SITE_FORMS:
      return routes.builderCreateHeadlessSiteForm();

    case AdditionalModuleCategory.ONLINE_BOOKING:
      return routes.builderCreateOnlineBookingSiteForm();

    // Coming soon products, builder marketplace and additional products
    case ModuleCategory.FINANCES:
    case ModuleCategory.MARKETING:
    case AdditionalModuleCategory.DOCUMENTS:
    case AdditionalModuleCategory.MAILING:
    case AdditionalModuleCategory.MESSENGER:
    case AdditionalModuleCategory.WEBSITE_CHAT:
    case BuilderMarketplaceCategory.WAZZUP:
    case BuilderMarketplaceCategory.TELEPHONY:
    case BuilderMarketplaceCategory.AUTOMATISATION:
    case BuilderMarketplaceCategory.TILDA:
    case BuilderMarketplaceCategory.WORDPRESS:
    case BuilderMarketplaceCategory.TWILIO:
    case BuilderMarketplaceCategory.FB_MESSENGER:
    case BuilderMarketplaceCategory.SALESFORCE:
    case BuilderMarketplaceCategory.MAKE:
    case BuilderMarketplaceCategory.APIX_DRIVE:
    case BuilderMarketplaceCategory.ALBATO:
    case BuilderMarketplaceCategory.ONE_C:
    case BuilderAdditionalStorageCategory.TEN_GB:
    case BuilderAdditionalStorageCategory.ONE_HUNDRED_GB:
    case BuilderAdditionalStorageCategory.ONE_TB:
      throw new Error(
        'Attempted to create a coming soon module or a module which can no be possibly created. Not ready yet.'
      );
  }
};
