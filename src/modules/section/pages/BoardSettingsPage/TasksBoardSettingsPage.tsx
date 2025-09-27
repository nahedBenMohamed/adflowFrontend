import { appStore, boardApiUtil, routes } from '@/app';
import { CardTab } from '@/modules/card';
import {
  DefaultHeader,
  LeftNavTemplate,
  PREV_PAGE_QUERY_PARAM,
  WholePageLoaderWithLogo,
  useCheckProjectOwnerOrAdmin,
  useTypedParams,
} from '@/shared';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BoardSettingsStore } from '../../store';
import { BoardSettings, BoardSettingsHeader } from './components';

const TasksBoardSettingsPage = observer(() => {
  const { boardId } = useTypedParams<{ boardId: number }>();

  const { t } = useTranslation('page.board-settings', {
    keyPrefix: 'board_settings.task_board_settings_page',
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const fromPage = searchParams.get(PREV_PAGE_QUERY_PARAM);
  const entityIdFromParams = searchParams.get('entityId');
  const entityTypeIdFromParams = searchParams.get('entityTypeId');

  const entityId = entityIdFromParams ? Number(entityIdFromParams) : null;
  const entityTypeId = entityTypeIdFromParams ? Number(entityTypeIdFromParams) : null;

  const boardSettingsStore = useMemo(() => new BoardSettingsStore(boardId), [boardId]);

  const { data: board } = boardApiUtil.useGetBoard(boardId);

  useCheckProjectOwnerOrAdmin({ boardId, navigateToForbidden: true });

  const handleNavigateBack = useCallback(() => {
    if (fromPage) {
      navigate(fromPage);

      return;
    }

    navigate(routes.tasksBoard(boardId));
  }, [fromPage, boardId, navigate]);

  const onDelete = useCallback(() => {
    // entityId and entityTypeId should be provided if this is a project board,
    // so that after deletion we can navigate back to project overview
    if (entityId && entityTypeId) {
      navigate(
        routes.card({
          entityId,
          entityTypeId,
          tab: CardTab.OVERVIEW,
        })
      );
    } else {
      navigate(routes.timeBoard());
    }

    boardApiUtil.deleteBoard(boardId);
  }, [boardId, entityId, entityTypeId, navigate]);

  useEffect(() => {
    when(
      () => appStore.isLoaded,
      async (): Promise<void> => await boardSettingsStore.initStageSettingsGroups()
    );
  }, [boardSettingsStore]);

  if (!appStore.isLoaded || !board)
    return (
      <LeftNavTemplate Header={<DefaultHeader />}>
        <WholePageLoaderWithLogo ensureHeader />
      </LeftNavTemplate>
    );

  return (
    <LeftNavTemplate
      Header={
        <BoardSettingsHeader
          boardId={boardId}
          canDelete={!board.isSystem}
          deleteLastWarningTitle={t('warning_title')}
          deleteLastWarningAnnotation={t('warning_annotation')}
          onDelete={onDelete}
          onCancel={handleNavigateBack}
        />
      }
    >
      <BoardSettings boardSettingsStore={boardSettingsStore} boardType={board.type} />
    </LeftNavTemplate>
  );
});

TasksBoardSettingsPage.displayName = 'TasksBoardSettingsPage';
export { TasksBoardSettingsPage };
