import { entityTypeStore } from '@/app';
import { useGetProductsSections } from '@/modules/products';
import { useGetSchedules } from '@/modules/scheduler';
import { TutorialProductType, type Option } from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type TutorialItemProduct } from '../models';

export const useGetTutorialProductsOptions = (): Option<TutorialItemProduct>[] => {
  const { t } = useTranslation('module.tutorial', {
    keyPrefix: 'tutorial.tutorial_drawer.hooks.use_get_tutorial_products_options.product_types',
  });

  const { entityTypes } = entityTypeStore;

  const { data: productsSections } = useGetProductsSections();
  const { data: schedulers } = useGetSchedules();

  return useMemo<Option<TutorialItemProduct>[]>(
    () => [
      {
        value: { type: TutorialProductType.BUILDER, objectId: null },
        label: t(TutorialProductType.BUILDER),
      },
      {
        value: { type: TutorialProductType.TASK, objectId: null },
        label: t(TutorialProductType.TASK),
      },
      {
        value: { type: TutorialProductType.MAIL, objectId: null },
        label: t(TutorialProductType.MAIL),
      },
      {
        value: { type: TutorialProductType.MULTI_MESSENGER, objectId: null },
        label: t(TutorialProductType.MULTI_MESSENGER),
      },
      {
        value: { type: TutorialProductType.SETTINGS, objectId: null },
        label: t(TutorialProductType.SETTINGS),
      },

      ...entityTypes.map<Option<TutorialItemProduct>>(et => ({
        value: { type: TutorialProductType.ENTITY_TYPE, objectId: et.id },
        label: et.section.name,
        extra: {
          groupId: TutorialProductType.ENTITY_TYPE,
        },
      })),

      ...(productsSections?.map<Option<TutorialItemProduct>>(ps => ({
        value: { type: TutorialProductType.PRODUCTS_SECTION, objectId: ps.id },
        label: ps.name,
        extra: {
          groupId: TutorialProductType.PRODUCTS_SECTION,
        },
      })) ?? []),

      ...(schedulers?.map<Option<TutorialItemProduct>>(s => ({
        value: { type: TutorialProductType.SCHEDULER, objectId: s.id },
        label: s.name,
        extra: {
          groupId: TutorialProductType.SCHEDULER,
        },
      })) ?? []),
    ],
    [entityTypes, productsSections, schedulers, t]
  );
};
