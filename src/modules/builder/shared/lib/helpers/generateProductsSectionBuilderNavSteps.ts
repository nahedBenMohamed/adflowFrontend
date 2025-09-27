import { ProductsSectionType } from '@/modules/products';
import type { TFunction } from 'i18next';
import type { BuilderNavStep } from '../models';

export const generateProductsSectionBuilderNavSteps = ({
  moduleType,
  t,
}: {
  moduleType: ProductsSectionType;
  t: TFunction;
}): BuilderNavStep[] => {
  const steps: BuilderNavStep[] = [
    {
      order: 1,
      name: t('step1.label'),
      description: t('step1.description'),
      locked: false,
    },
    {
      order: 2,
      name: t('step2.label'),
      description: t('step2.description'),
      locked: true,
    },
    {
      order: 3,
      name: t('step3.label'),
      description: t('step3.description'),
      locked: true,
    },
  ];

  if (moduleType === ProductsSectionType.SALE) {
    steps.push({
      order: 4,
      name: t('step4.sales.label'),
      description: t('step4.sales.description'),
      locked: true,
    });

    return steps;
  }

  steps.push(
    ...[
      {
        order: 4,
        name: t('step4.rentals.label'),
        description: t('step4.rentals.description'),
        locked: true,
      },
      {
        order: 5,
        name: t('step5.label'),
        description: t('step5.description'),
        locked: true,
      },
    ]
  );

  return steps;
};
