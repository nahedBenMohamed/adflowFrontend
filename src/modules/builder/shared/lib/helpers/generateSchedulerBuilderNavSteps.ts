import type { TFunction } from 'i18next';
import type { BuilderNavStep } from '../models';

export const generateSchedulerBuilderNavSteps = (t: TFunction): BuilderNavStep[] => [
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
