import { routes } from '@/app';
import {
  EntitiesBoardSettingsTab,
  envUtil,
  UriCodingUtil,
  type Nullable,
  type TabModel,
} from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AutomationBpmnTabIcon, AutomationNewTabIcon } from '../../assets';

export const useEntitiesBoardSettingsPageTabs = ({
  boardId,
  entityTypeId,
  prevPage,
}: {
  boardId: number;
  entityTypeId: number;
  prevPage: Nullable<string>;
}) => {
  const { t } = useTranslation('page.board-settings', {
    keyPrefix: 'board_settings.entity_type_board_settings_page',
  });

  return useMemo<TabModel[]>(() => {
    const tabs = [
      {
        title: t('automation_new'),
        Icon: <AutomationNewTabIcon />,
        href: routes.entityTypeBoardSettings({
          boardId,
          entityTypeId,
          tab: EntitiesBoardSettingsTab.AUTOMATION,
          from: prevPage ? UriCodingUtil.encode(prevPage) : undefined,
        }),
      },
      {
        title: envUtil.automationHideBpmn ? t('bpmn_2_0_soon') : t('bpmn_2_0'),
        Icon: <AutomationBpmnTabIcon />,
        disabled: envUtil.automationHideBpmn,
        href: routes.entityTypeBoardSettings({
          boardId,
          entityTypeId,
          tab: EntitiesBoardSettingsTab.AUTOMATION_BPMN,
          from: prevPage ? UriCodingUtil.encode(prevPage) : undefined,
        }),
      },
    ];

    return tabs;
  }, [boardId, prevPage, entityTypeId, t]);
};
