import { ProductsSectionType } from '@/modules/products';
import {
  CRMBuilderCardIcon,
  CompaniesBuilderCardIcon,
  ContactsBuilderCardIcon,
  ContractorsBuilderCardIcon,
  FinancesBuilderCardIcon,
  HRBuilderCardIcon,
  MarketingBuilderCardIcon,
  PartnersBuilderCardIcon,
  ProductionBuilderCardIcon,
  ProjectsBuilderCardIcon,
  RentBuilderCardIcon,
  SchedulerBuilderCardIcon,
  SuppliersBuilderCardIcon,
  UniversalBuilderCardIcon,
  WarehouseBuilderCardIcon,
  envUtil,
  type Option,
} from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ModuleCategory, type ModuleOptionExtra } from '../models';

// Colors are represented in hex codes intentionally for color opacity to work
export const useModulesCategoriesOptions = (): Option<ModuleCategory, ModuleOptionExtra>[] => {
  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.builder_journey_picker_page.module_names',
  });

  return useMemo(() => {
    let options = Object.values(ModuleCategory)
      // BPMN Automatisation is in builder marketplace options now
      .map<Option<ModuleCategory, ModuleOptionExtra>>(v => {
        switch (v) {
          case ModuleCategory.CRM:
            return {
              value: v,
              label: t(ModuleCategory.CRM),
              extra: {
                icon: <CRMBuilderCardIcon />,
                color: '#F45288',
              },
            };

          case ModuleCategory.PROJECT_MANAGEMENT:
            return {
              value: v,
              label: t(ModuleCategory.PROJECT_MANAGEMENT),
              extra: {
                icon: <ProjectsBuilderCardIcon />,
                color: '#5293F4',
              },
            };

          case ModuleCategory.PRODUCTION:
            return {
              value: v,
              label: t(ModuleCategory.PRODUCTION),
              extra: {
                icon: <ProductionBuilderCardIcon />,
                color: '#1DD7D7',
              },
            };

          case ModuleCategory.PRODUCT_MANAGEMENT_FOR_SALES:
            return {
              value: v,
              label: t(ModuleCategory.PRODUCT_MANAGEMENT_FOR_SALES),
              extra: {
                icon: <WarehouseBuilderCardIcon />,
                color: '#B0E228',
                productsSectionType: ProductsSectionType.SALE,
              },
            };

          case ModuleCategory.PRODUCT_MANAGEMENT_RENTALS:
            return {
              value: v,
              label: t(ModuleCategory.PRODUCT_MANAGEMENT_RENTALS),
              extra: {
                icon: <RentBuilderCardIcon />,
                color: '#23E664',
                productsSectionType: ProductsSectionType.RENTAL,
              },
            };

          case ModuleCategory.SCHEDULER:
            return {
              value: v,
              label: t(ModuleCategory.SCHEDULER),
              extra: {
                icon: <SchedulerBuilderCardIcon />,
                color: '#E561B9',
              },
            };

          case ModuleCategory.SUPPLIER_MANAGEMENT:
            return {
              value: v,
              label: t(ModuleCategory.SUPPLIER_MANAGEMENT),
              extra: {
                icon: <SuppliersBuilderCardIcon />,
                color: '#A770D7',
              },
            };

          case ModuleCategory.CONTRACTOR_MANAGEMENT:
            return {
              value: v,
              label: t(ModuleCategory.CONTRACTOR_MANAGEMENT),
              extra: {
                icon: <ContractorsBuilderCardIcon />,
                color: '#A770D7',
              },
            };

          case ModuleCategory.HR_MANAGEMENT:
            return {
              value: v,
              label: t(ModuleCategory.HR_MANAGEMENT),
              extra: {
                icon: <HRBuilderCardIcon />,
                color: '#7E70D7',
              },
            };

          case ModuleCategory.CONTACT:
            return {
              value: v,
              label: t(ModuleCategory.CONTACT),
              extra: {
                icon: <ContactsBuilderCardIcon />,
                color: '#2CBDF2',
              },
            };

          case ModuleCategory.COMPANY:
            return {
              value: v,
              label: t(ModuleCategory.COMPANY),
              extra: {
                icon: <CompaniesBuilderCardIcon />,
                color: '#F68828',
              },
            };

          case ModuleCategory.UNIVERSAL_MODULE:
            return {
              value: v,
              label: t(ModuleCategory.UNIVERSAL_MODULE),
              extra: {
                icon: <UniversalBuilderCardIcon />,
                color: '#DBDFE5',
              },
            };

          case ModuleCategory.PARTNER_MANAGEMENT:
            return {
              value: v,
              label: t(ModuleCategory.PARTNER_MANAGEMENT),
              extra: {
                icon: <PartnersBuilderCardIcon />,
                color: '#A770D7',
              },
            };

          case ModuleCategory.FINANCES:
            return {
              value: v,
              label: t(ModuleCategory.FINANCES),
              extra: {
                icon: <FinancesBuilderCardIcon />,
                color: '#23E7B2',
                comingSoon: true,
              },
            };

          case ModuleCategory.MARKETING:
            return {
              value: v,
              label: t(ModuleCategory.MARKETING),
              extra: {
                icon: <MarketingBuilderCardIcon />,
                color: '#F8654F',
                comingSoon: true,
              },
            };

          default:
            throw new Error(`Failed to generate module category option for category ${v}`);
        }
      });

    if (envUtil.builderHideMarketing)
      options = options.filter(o => o.value !== ModuleCategory.MARKETING);

    if (envUtil.builderHideFinances)
      options = options.filter(o => o.value !== ModuleCategory.FINANCES);

    return options;
  }, [t]);
};
