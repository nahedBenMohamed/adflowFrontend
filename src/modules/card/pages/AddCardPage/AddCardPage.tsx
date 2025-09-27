import { appStore, entityTypeStore, routes } from '@/app';
import {
  DefaultHeader,
  LeftNavTemplate,
  PREV_PAGE_QUERY_PARAM,
  UriCodingUtil,
  WholePageLoaderWithLogo,
  useTitle,
  useTypedParams,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  CardPageHeader,
  type CardPageHeaderControlsProps,
  CardTab,
  OverviewComponent,
} from '../../shared';
import { CardStore } from '../../store';

const AddCardPage = observer(() => {
  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui',
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { entityTypeId } = useTypedParams<{
    entityTypeId: number;
  }>();

  const prevPageFromParams = searchParams.get(PREV_PAGE_QUERY_PARAM);
  const boardId = searchParams.get('boardId');

  const [mutationWarningShown, { open: showMutationWarning, close: hideMutationWarning }] =
    useDisclosure(false);
  const [
    fieldUsedInFormulaWarningShown,
    { open: showFieldUsedInFormulaWarning, close: hideFieldUsedInFormulaWarning },
  ] = useDisclosure(false);
  const [
    fieldFormulaCircularDependencyWarningShown,
    {
      open: showFieldFormulaCircularDependencyWarning,
      close: hideFieldFormulaCircularDependencyWarning,
    },
  ] = useDisclosure(false);

  const cardStore = useMemo(
    () =>
      new CardStore({
        entityTypeId,
        analyticsGroupName: t('analytics'),
        requisitesGroupName: t('requisites'),
        showMutationWarning,
        showFieldUsedInFormulaWarning,
        showFieldFormulaCircularDependencyWarning,
        boardId: boardId ? Number(boardId) : undefined,
        backLinkUrl: prevPageFromParams ? UriCodingUtil.decode(prevPageFromParams) : undefined,
        navigate,
        t,
      }),
    [
      boardId,
      entityTypeId,
      prevPageFromParams,
      showMutationWarning,
      showFieldUsedInFormulaWarning,
      showFieldFormulaCircularDependencyWarning,
      navigate,
      t,
    ]
  );

  const { entity, isLoaded: cardStoreLoaded, entityStageId, changeEntityBoard } = cardStore;

  useTitle({ dynamicTitle: entity?.name });

  useEffect(() => {
    if (!appStore.isLoaded) return;

    if (!cardStore.isLoaded) cardStore.loadDataWithoutEntity();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardStore, appStore.isLoaded]);

  const cardPageHeaderControlsProps = useMemo<CardPageHeaderControlsProps>(
    () => ({
      tab: CardTab.AFTER_ADD,
      entityId: -1,
      orderId: null,
      identifier: null,
      taskBoardId: null,
      timeAllocation: [],
      handleCreateNewOrder: () => {},
      handleAddTask: async () => {},
    }),
    []
  );

  if (!appStore.isLoaded || !cardStoreLoaded)
    return (
      <LeftNavTemplate Header={<DefaultHeader />}>
        <WholePageLoaderWithLogo ensureHeaderWithOffset />
      </LeftNavTemplate>
    );

  const entityType = entityTypeStore.getById(entityTypeId);

  const backLinkURL = prevPageFromParams
    ? UriCodingUtil.decode(prevPageFromParams)
    : routes.section({ entityType, firstBoardId: entity?.boardId });

  return (
    <LeftNavTemplate
      Header={
        <CardPageHeader
          entity={entity}
          entityTypeId={entityTypeId}
          entityStageId={entityStageId}
          controlsProps={cardPageHeaderControlsProps}
          changeEntityBoard={changeEntityBoard}
        />
      }
    >
      <OverviewComponent
        entityId={-1}
        cardStore={cardStore}
        backLink={backLinkURL}
        isAfterAdd={true}
        entityType={entityType}
        mutationWarningShown={mutationWarningShown}
        fieldUsedInFormulaWarningShown={fieldUsedInFormulaWarningShown}
        fieldFormulaCircularDependencyWarningShown={fieldFormulaCircularDependencyWarningShown}
        hideMutationWarning={hideMutationWarning}
        hideFieldUsedInFormulaWarning={hideFieldUsedInFormulaWarning}
        hideFieldFormulaCircularDependencyWarning={hideFieldFormulaCircularDependencyWarning}
      />
    </LeftNavTemplate>
  );
});

AddCardPage.displayName = 'AddCardPage';
export { AddCardPage };
