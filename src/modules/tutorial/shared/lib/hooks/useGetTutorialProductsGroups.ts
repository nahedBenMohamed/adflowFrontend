import { TutorialProductType, type MultiselectOptionsListGroup } from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useGetTutorialProductsGroups = (): MultiselectOptionsListGroup[] => {
  const { t } = useTranslation('module.tutorial', {
    keyPrefix: 'tutorial.tutorial_drawer.hooks.use_get_tutorial_products_groups.groups',
  });

  return useMemo<MultiselectOptionsListGroup[]>(
    () => [
      {
        groupId: TutorialProductType.ENTITY_TYPE,
        groupName: t(TutorialProductType.ENTITY_TYPE),
      },
      {
        groupId: TutorialProductType.PRODUCTS_SECTION,
        groupName: t(TutorialProductType.PRODUCTS_SECTION),
      },
      {
        groupId: TutorialProductType.SCHEDULER,
        groupName: t(TutorialProductType.SCHEDULER),
      },
    ],
    [t]
  );
};
