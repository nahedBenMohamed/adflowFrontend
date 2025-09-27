import { routes } from '@/app';
import { AutomationBpmnTabIcon, AutomationNewTabIcon } from '@/modules/section';
import { envUtil, type TabModel } from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useEntitiesListAutomationPageTabs = (entityTypeId: number) => {
  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.section_header_with_boards',
  });

  return useMemo<TabModel[]>(
    () => [
      {
        title: t('automation'),
        Icon: <AutomationNewTabIcon />,
        href: routes.listSectionAutomation(entityTypeId),
      },
      {
        title: envUtil.automationHideBpmn ? t('bpmn_2_0_soon') : t('bpmn_2_0'),
        Icon: <AutomationBpmnTabIcon />,
        disabled: envUtil.automationHideBpmn,
        href: routes.listSectionBpmn(entityTypeId),
      },
    ],
    [entityTypeId, t]
  );
};
