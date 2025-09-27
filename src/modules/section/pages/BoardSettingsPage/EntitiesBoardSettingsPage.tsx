import { appStore, boardApiUtil, routes } from '@/app';
import { AutomationStore } from '@/modules/automation';
import {
  BoardType,
  DefaultHeader,
  EntitiesBoardSettingsTab,
  PREV_PAGE_QUERY_PARAM,
  PageTemplateWithSubheader,
  SectionView,
  UriCodingUtil,
  WholePageLoaderWithLogo,
  useTypedParams,
} from '@/shared';
import { Tabs } from '@mantine/core';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEntitiesBoardSettingsPageTabs } from '../../shared';
import { BoardSettingsStore } from '../../store';
import { BoardSettings, BoardSettingsHeader } from './components';

const EntitiesBoardSettingsPage = observer(() => {
  const { entityTypeId, boardId, tab } = useTypedParams<{
    boardId: number;
    entityTypeId: number;
    tab: EntitiesBoardSettingsTab;
  }>();

  const { t } = useTranslation('page.board-settings', {
    keyPrefix: 'board_settings.entity_type_board_settings_page',
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const prevPageFromParams = searchParams.get(PREV_PAGE_QUERY_PARAM);
  const prevPage = prevPageFromParams ? UriCodingUtil.decode(prevPageFromParams) : null;

  const { data: boards } = boardApiUtil.useGetBoardsByEntityTypeId({ entityTypeId });

  const automationStore = useMemo(
    () => new AutomationStore({ entityTypeId, boardId }),
    [entityTypeId, boardId]
  );

  const boardSettingsStore = useMemo(() => new BoardSettingsStore(boardId), [boardId]);

  const { areLoaded: areAutomationsLoaded, loadData: loadAutomations } = automationStore;

  const { initStageSettingsGroups } = boardSettingsStore;

  const isAutomationTab = tab === EntitiesBoardSettingsTab.AUTOMATION;

  useEffect(() => {
    when(
      () => appStore.isLoaded,
      () => {
        if (isAutomationTab) loadAutomations();

        initStageSettingsGroups();
      }
    );
  }, [isAutomationTab, loadAutomations, initStageSettingsGroups]);

  const handleNavigateBack = useCallback(() => {
    if (prevPage) {
      navigate(prevPage);

      return;
    }

    navigate(routes.entitiesSection({ entityTypeId, boardId, tab: SectionView.BOARD }));
  }, [prevPage, entityTypeId, boardId, navigate]);

  const handleDelete = useCallback(async () => {
    await boardApiUtil.deleteBoard(boardId);

    navigate(
      routes.entitiesSection({
        entityTypeId,
        tab: SectionView.BOARD,
      })
    );
  }, [boardId, entityTypeId, navigate]);

  const tabs = useEntitiesBoardSettingsPageTabs({ boardId, entityTypeId, prevPage });

  if (!appStore.isLoaded)
    return (
      <PageTemplateWithSubheader tabs={tabs} Header={<DefaultHeader />}>
        <WholePageLoaderWithLogo ensureSubheaderWithOffset />
      </PageTemplateWithSubheader>
    );

  return (
    <PageTemplateWithSubheader
      tabs={tabs}
      Header={
        <BoardSettingsHeader
          boards={boards}
          boardId={boardId}
          entityTypeId={entityTypeId}
          canDelete={boards && boards.length > 1}
          deleteLastWarningTitle={t('warning_title')}
          deleteLastWarningAnnotation={t('warning_annotation')}
          onDelete={handleDelete}
          onCancel={handleNavigateBack}
        />
      }
    >
      {areAutomationsLoaded ? (
        <Tabs.Panel value={EntitiesBoardSettingsTab.AUTOMATION}>
          <BoardSettings
            boardType={BoardType.ENTITY_TYPE}
            automationStore={automationStore}
            boardSettingsStore={boardSettingsStore}
          />
        </Tabs.Panel>
      ) : (
        <WholePageLoaderWithLogo ensureSubheaderWithOffset />
      )}
    </PageTemplateWithSubheader>
  );
});

EntitiesBoardSettingsPage.displayName = 'EntitiesBoardSettingsPage';
export { EntitiesBoardSettingsPage };
