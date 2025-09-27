import type { TFunction } from 'i18next';
import type { BuilderNavStep } from '../models';

export const generateSiteFormBuilderNavSteps = (t: TFunction): BuilderNavStep[] => [
  {
    order: 1,
    name: t('step1.title'),
    description: t('step1.description'),
    locked: false,
  },
  {
    order: 2,
    name: t('step2.title'),
    description: t('step2.description'),
    locked: true,
  },
  {
    order: 3,
    name: t('step3.title'),
    description: t('step3.description'),
    locked: true,
  },
  {
    order: 4,
    name: t('step4.title'),
    description: t('step4.description'),
    locked: true,
  },
  {
    order: 5,
    name: t('step5.title'),
    description: t('step5.description'),
    locked: true,
  },
];
