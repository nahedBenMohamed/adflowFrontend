import { EntityCategory } from '@/shared';
import { ReportsSection } from '../models';

export const getCustomerReportSections = (linkedCategories: EntityCategory[]): ReportsSection[] => {
  const customerReportSections = [];

  if (linkedCategories.includes(EntityCategory.CONTACT))
    customerReportSections.push(ReportsSection.CUSTOMER_CONTACT);

  if (linkedCategories.includes(EntityCategory.COMPANY))
    customerReportSections.push(ReportsSection.CUSTOMER_COMPANY);

  if (customerReportSections.length === 2)
    customerReportSections.push(ReportsSection.CUSTOMER_CONTACT_COMPANY);

  return customerReportSections;
};
