import { EntityCategory } from '@/shared';
import { ModuleCategory } from '../models';

export const mapModuleCategoryToEntityCategory = (
  moduleCategory: ModuleCategory
): EntityCategory => {
  switch (moduleCategory) {
    case ModuleCategory.COMPANY:
      return EntityCategory.COMPANY;

    case ModuleCategory.CONTACT:
      return EntityCategory.CONTACT;

    case ModuleCategory.CRM:
      return EntityCategory.DEAL;

    case ModuleCategory.CONTRACTOR_MANAGEMENT:
      return EntityCategory.CONTRACTOR;

    case ModuleCategory.HR_MANAGEMENT:
      return EntityCategory.HR;

    case ModuleCategory.PARTNER_MANAGEMENT:
      return EntityCategory.PARTNER;

    case ModuleCategory.PROJECT_MANAGEMENT:
      return EntityCategory.PROJECT;

    case ModuleCategory.SUPPLIER_MANAGEMENT:
      return EntityCategory.SUPPLIER;

    case ModuleCategory.UNIVERSAL_MODULE:
      return EntityCategory.UNIVERSAL;

    case ModuleCategory.PRODUCTION:
      return EntityCategory.PROJECT;

    default:
      throw new Error(`Failed to map module category ${moduleCategory} to entity category`);
  }
};
