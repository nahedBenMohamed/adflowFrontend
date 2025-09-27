import { entityTypeStore, generalSettingsStore, recordSingularityStore, userStore } from '@/app';
import { authStore } from '@/modules/auth';
import {
  DATA_TAB_ATTRIBUTE,
  EditFieldsTab,
  FieldCode,
  FieldCompWrapper,
  FieldLabel,
  FIELDS_TAB,
  FieldValueFormGroupRoot,
  type NumberFieldValue,
  ProjectFieldsBlock,
  type ProjectFieldsSettings,
  ShowFieldsTab,
  ShowFiles,
  type TextFieldValue,
  useMakeCallContext,
} from '@/modules/fields';
import { type ChatProvider, clearChatEntityInCache } from '@/modules/multichat';
import {
  ArrowBackLink,
  Currency,
  EntityApiUtil,
  EntityCategory,
  FeatureCode,
  type FeedItemFilter,
  FieldGroupTabPanel,
  FieldGroupTabs,
  type Nullable,
  type Option,
  type Optional,
  SectionView,
  type Stage,
  type User,
  UserPicker,
  WarningModal,
  WholePageLoaderWithLogo,
} from '@/shared';
import { useDisclosure, useWindowEvent } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import {
  type ReactNode,
  type UIEventHandler,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import type { CardStore, FeedStore } from '../../../../store';
import { useRequisitesSuggestions } from '../../hooks';
import { ActionMenu } from '../ActionMenu/ActionMenu';
import { ActionsDropdown } from '../ActionsDropdown/ActionsDropdown';
import { CommonBudgetBlock } from '../BudgetBlock/CommonBudgetBlock';
import { ProjectBudgetBlock } from '../BudgetBlock/ProjectBudgetBlock';
import { CardNameBlock } from '../CardNameBlock/CardNameBlock';
import { CardStages } from '../CardStages/CardStages';
import { CardSystemInfoBlock } from '../CardSystemInfoBlock/CardSystemInfoBlock';
import { ChangeLinkedResponsiblesModal } from '../ChangeLinkedResponsiblesModal/ChangeLinkedResponsiblesModal';
import { EntityTypeLinksBlock } from '../EntityTypeLinksBlock/EntityTypeLinksBlock';
import { Feed } from '../Feed/Feed';
import { FocusButton } from '../FocusButton/FocusButton';
import { LinkedEntitiesBlock } from '../LinkedEntitiesBlock/LinkedEntitiesBlock';
import { LinkedEntitiesHeaderLinks } from '../LinkedEntitiesHeaderLinks/LinkedEntitiesHeaderLinks';
import { ExternalMiniCard } from '../MiniCard/ExternalMiniCard';

const Scrollbar = styled.div`
  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #aab7d442;

    border: none;
    border: 4px solid;
    border-radius: var(--border-radius-block);
    border-color: var(--graphite-graphite-20);
    transition: var(--transition-200);

    &:hover {
      background: #aab7d45f;
    }
  }
`;

const Root = styled.div<{ $hasTopPadding: boolean }>`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: var(--card-root-gap);

  padding-top: ${p => p.$hasTopPadding && 'var(--card-root-gap)'};
`;

const Content = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: minmax(490px, 700px) minmax(640px, 932px);
  gap: 16px;
`;

interface LeftBlockProps {
  $columnHeight: string;
  $hasPaddingBottom: boolean;
}

const LeftBlock = styled(Scrollbar)<LeftBlockProps>`
  height: ${p => p.$columnHeight};
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 16px;

  overflow-y: scroll;
  overflow-x: hidden;
  padding: ${p => (p.$hasPaddingBottom ? '2px 2px 56px' : '2px 2px 16px')};
`;

const RightBlock = styled(Scrollbar)<{ $columnHeight: string }>`
  position: relative;

  height: ${p => p.$columnHeight};
  width: 100%;

  display: flex;
  flex-direction: column;

  padding: 2px;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const CardHeader = styled.div<{ $project: boolean }>`
  position: relative;

  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 20px 24px;
  box-shadow:
    0px 1px 2px 0px #d0daeb,
    0px 0px 2px 0px #eef4fe;
  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
`;

const TopCardHeaderRow = styled.div`
  min-height: 24px;

  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledFieldGroupTab = styled(FieldGroupTabs.Tab)<{ $active?: boolean }>`
  ${p => p.$active && `color: var(--button-text-green-active)`};
`;

interface Props {
  isAfterAdd: boolean;
  cardStore: CardStore;
  feedStore: FeedStore;
  areProvidersLoading: boolean;
  currentPageEncodedUrl: string;
  entityEmailOptions: Option<string>[];
  adding?: boolean;
  backLink?: string;
  ensureSubheader?: boolean;
  providers?: ChatProvider[];
  reloadFeed: () => void;
}

const CardComponent = observer((props: Props) => {
  const {
    isAfterAdd,
    cardStore,
    feedStore,
    entityEmailOptions,
    currentPageEncodedUrl,
    areProvidersLoading,
    adding = false,
    backLink,
    ensureSubheader,
    providers,
    reloadFeed,
  } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card',
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const rightBlockRef = useRef<HTMLDivElement>(null);

  const telephonyContextValue = useMakeCallContext();

  const { accountSettings } = generalSettingsStore;
  const currency = accountSettings?.currency ?? Currency.USD;

  const { user: currentUser } = authStore;

  const [deletingCard, setDeletingCard] = useState(false);

  const [isCardNameEditMode, { close: hideCardNameEditMode, open: showCardNameEditMode }] =
    useDisclosure(isAfterAdd);
  const [isDeleteModalOpened, { close: hideDeleteModal, open: showDeleteModal }] =
    useDisclosure(false);
  const [
    isChangeResponsibleModalOpened,
    { close: hideChangeResponsibleModal, open: showChangeResponsibleModal },
  ] = useDisclosure(false);

  const {
    entity,
    stages,
    entityType,
    entityName,
    filesStore,
    fieldsStore,
    activeFilter,
    isSavingCard,
    entityStageId,
    isCancelingCard,
    fieldValuesStore,
    fieldGroupsStore,
    isFieldsEditMode,
    responsibleUserId,
    linkedEntityStore,
    entityTypeLinksStore,
    cancel,
    setActiveFilter,
    setEntityStageId,
    toggleFieldsEditMode,
    invalidateEntityInCache,
  } = cardStore;

  const handleChangeFilter = useCallback(
    (filter: FeedItemFilter) => {
      // to ensure that no record continue to play after changing the filter
      recordSingularityStore.clear();

      setActiveFilter(filter);
    },
    [setActiveFilter]
  );

  const isProject = Boolean(entityType?.isProjectCategory());
  const isListView = Boolean(entityType?.section.view === SectionView.LIST);

  const fieldsTabFromParams = searchParams.get(FIELDS_TAB);
  let currentFieldsTab = fieldsTabFromParams
    ? fieldsTabFromParams
    : String(fieldGroupsStore.activeFieldGroups[0]?.id);

  const headerHeight = ensureSubheader
    ? 'var(--header-with-subheader-height)'
    : 'var(--header-height)';
  const globalColumnHeight =
    stages.length !== 0
      ? `calc(100dvh - var(--card-stages-total-height) - ${headerHeight} - var(--card-root-gap))`
      : `calc(100dvh - ${headerHeight} - var(--card-root-gap))`;

  const { entityForms } = linkedEntityStore;

  useLayoutEffect(() => {
    fieldGroupsStore.activeTabKey = currentFieldsTab;
  }, [currentFieldsTab, fieldGroupsStore]);

  useEffect(() => {
    if (!entity || entity.id < 0 || !telephonyContextValue) return;

    const { setEntity: setEntityContext, setLinkedEntity: setLinkedEntityContext } =
      telephonyContextValue;

    const { entityCategory } = entityTypeStore.getById(entity.entityTypeId);

    const linkedEntities = entityForms.map(ef => ef.originalEntity);

    if ([EntityCategory.CONTACT, EntityCategory.COMPANY].includes(entityCategory)) {
      setEntityContext(entity);

      const firstLinkedDeal = linkedEntities.find(
        e => entityTypeStore.getById(e.entityTypeId).entityCategory === EntityCategory.DEAL
      );

      if (firstLinkedDeal) setLinkedEntityContext(firstLinkedDeal);

      return;
    }

    if (entityCategory === EntityCategory.DEAL) {
      const firstLinkedContactOrCompany = linkedEntities.find(e =>
        [EntityCategory.CONTACT, EntityCategory.COMPANY].includes(
          entityTypeStore.getById(e.entityTypeId).entityCategory
        )
      );

      if (firstLinkedContactOrCompany) {
        setLinkedEntityContext(entity);
        setEntityContext(firstLinkedContactOrCompany);
      }
    }
  }, [entity, entityForms, telephonyContextValue]);

  useLayoutEffect(() => {
    rightBlockRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [rightBlockRef, feedStore.isLoading]);

  const hasStages = useMemo<boolean>(() => stages.length > 0, [stages.length]);

  const currentStage = useMemo<Optional<Nullable<Stage>>>(
    () =>
      hasStages && cardStore.entity?.stageId
        ? stages.find(s => s.id === cardStore.entityStageId)
        : null,
    [cardStore.entity?.stageId, cardStore.entityStageId, hasStages, stages]
  );

  const [scrolled, setScrolled] = useState(false);

  const scrollHandler = useCallback<UIEventHandler<HTMLDivElement>>(
    e => setScrolled(e.currentTarget.scrollTop > 240),
    []
  );

  const handleToggleFieldsEditMode = useCallback(() => {
    if (!isFieldsEditMode) {
      fieldGroupsStore.activeTabKey = String(fieldGroupsStore.activeFieldGroups[0]?.id);
    }

    toggleFieldsEditMode();
  }, [fieldGroupsStore, isFieldsEditMode, toggleFieldsEditMode]);

  const deleteEntity = useCallback(
    async (goBack = true): Promise<void> => {
      if (!entity) throw new Error('Failed to delete entity which is not loaded or does not exist');

      try {
        setDeletingCard(true);

        await EntityApiUtil.delete(entity.id);
        clearChatEntityInCache(entity.id);

        if (!goBack) return;

        if (cardStore.isJsonStateChanged()) {
          // to prevent conflicts with changes not saved mechanics, this way
          // react-router-dom will not know about route change
          backLink ? (window.location.href = backLink) : window.history.back();
        } else {
          backLink ? navigate(backLink) : navigate(-1);
        }
      } finally {
        setDeletingCard(false);
      }
    },
    [entity, backLink, cardStore, navigate]
  );

  const handleChangeTab = useCallback(
    (value: Nullable<string>) => fieldGroupsStore.changeActiveTab(value),
    [fieldGroupsStore]
  );

  const handleChangeResponsibleUserId = useCallback(
    (user: User) => {
      responsibleUserId.value = user.id;

      if (entity && entityForms.length > 0) showChangeResponsibleModal();
    },
    [entity, entityForms.length, responsibleUserId, showChangeResponsibleModal]
  );

  const handleSave = useCallback(async (): Promise<void> => {
    const saved = await cardStore.save();

    if (saved) hideCardNameEditMode();
  }, [cardStore, hideCardNameEditMode]);

  const canEdit = Boolean(entity?.userRights.canEdit);

  const getExtraFields = useCallback(
    (idx: number): ReactNode => {
      if (!entity) return null;

      return idx === 0 && !isProject ? (
        <FieldValueFormGroupRoot>
          <FieldLabel>{t('owner')}</FieldLabel>

          <FieldCompWrapper
            // is list view fields can neither be mandatory nor important (because we have no stages in this view)
            // so that they won't have reserved left offset for indicator icon, that's why we don't need to
            // adjust this system field
            $padding={isListView ? undefined : '0 0 0 22px'}
          >
            <UserPicker
              withinPortal
              noActiveShadow
              disabled={!canEdit}
              users={userStore.activeUsers}
              selectedId={responsibleUserId.value}
              onSelect={handleChangeResponsibleUserId}
            />
          </FieldCompWrapper>
        </FieldValueFormGroupRoot>
      ) : null;
    },
    [entity, isProject, isListView, responsibleUserId, canEdit, handleChangeResponsibleUserId, t]
  );

  const handleChangeFieldsSettings = useCallback(
    (fieldsSettings: ProjectFieldsSettings) => {
      if (!entityType)
        throw new Error(`Failed to handleChangeFieldsSettings, entityType is not defined`);

      cardStore.updateFieldsSettings({ entityTypeId: entityType.id, fieldsSettings });
    },
    [cardStore, entityType]
  );

  const isCardJsonStateChanged = cardStore.isJsonStateChanged();

  useWindowEvent('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's' && isCardJsonStateChanged) {
      e.preventDefault();

      handleSave();
    }
  });

  const changeTextFieldModelValueByCode = useCallback(
    ({ code, value }: { code: FieldCode; value: string }): Optional<TextFieldValue> => {
      const field = fieldsStore.findByCode(code);

      if (!field) return;

      (fieldValuesStore.getOrCreateByField(field) as TextFieldValue).changeModelValue(value);
    },
    [fieldsStore, fieldValuesStore]
  );

  const setEntityName = useCallback(
    (name: string) => {
      entityName.setValue(name);
    },
    [entityName]
  );

  const { handleSelectOrgRequisitesSuggestion, handleSelectBankRequisitesSuggestion } =
    useRequisitesSuggestions({
      changeTextFieldModelValueByCode,
      setEntityName,
    });

  if (
    !entityType ||
    !entityName ||
    !currentUser ||
    !responsibleUserId ||
    !cardStore.isLoaded ||
    areProvidersLoading
  )
    return (
      <Root $hasTopPadding={false}>
        <WholePageLoaderWithLogo ensureSubheaderWithOffset />
      </Root>
    );

  const filesEnable = entityType.featureCodes.includes(FeatureCode.ENTITY_FILES);

  const budgetFieldValue = fieldValuesStore.fieldValues.find(
    fv => fv.fieldId === fieldsStore.findBudgetField()?.id
  );
  const budget = budgetFieldValue ? (budgetFieldValue as NumberFieldValue).value : undefined;

  const projectBudgetField = fieldsStore.findByCode(FieldCode.VALUE);

  const activeProjectFieldCodes = entityType.fields
    .filter(f => f.code && f.active)
    .map<Nullable<FieldCode>>(f => f.code)
    .filter(Boolean);

  const areFieldsEditable = isAfterAdd ? true : entity?.userRights.canEdit;

  const isActionMenuOpened = !entity || isCardJsonStateChanged || isSavingCard || isCancelingCard;

  return (
    <Root $hasTopPadding={!hasStages}>
      {hasStages && entityStageId && (
        <CardStages
          stages={stages}
          isAdding={!entity}
          entityStageId={entityStageId}
          disabled={!entity?.userRights.canEdit}
          onStageChange={setEntityStageId}
        />
      )}

      <Content>
        <LeftBlock
          id="workspace__Card--LeftBlock"
          $columnHeight={globalColumnHeight}
          $hasPaddingBottom={isActionMenuOpened}
        >
          <CardHeader $project={isProject}>
            <TopCardHeaderRow>
              {!ensureSubheader && <ArrowBackLink alignBaseToLeft backLink={backLink} />}

              <CardNameBlock
                model={entityName}
                chats={entity?.chats}
                saving={isSavingCard}
                providers={providers}
                isAfterAdd={isAfterAdd}
                disabled={!areFieldsEditable}
                editMode={isCardNameEditMode}
                copiedFrom={entity?.copiedFrom ?? null}
                copiedCount={entity?.copiedCount ?? null}
                entityTypeId={entity ? entity.entityTypeId : cardStore.entityTypeId}
                currentPageEncodedUrl={currentPageEncodedUrl}
                showEditMode={showCardNameEditMode}
                hideEditMode={hideCardNameEditMode}
                onSelectOrgRequisitesSuggestion={handleSelectOrgRequisitesSuggestion}
              />

              {isProject ? (
                projectBudgetField &&
                activeProjectFieldCodes.includes(FieldCode.VALUE) && (
                  <ProjectBudgetBlock
                    disabled={!canEdit}
                    budgetField={projectBudgetField}
                    budgetFieldValue={
                      fieldValuesStore.getOrCreateByField(projectBudgetField) as NumberFieldValue
                    }
                  />
                )
              ) : (
                <CommonBudgetBlock currency={currency} budget={budget} />
              )}

              <FocusButton cardStore={cardStore} />

              {(entity?.userRights.canDelete ||
                entityType.entityCategory === EntityCategory.PROJECT) && (
                <ActionsDropdown
                  canDelete={entity?.userRights.canDelete ?? false}
                  canTune={entityType.entityCategory === EntityCategory.PROJECT}
                  activeProjectFieldCodes={activeProjectFieldCodes}
                  onDelete={showDeleteModal}
                  onFieldsSettingsChange={handleChangeFieldsSettings}
                />
              )}
            </TopCardHeaderRow>

            <LinkedEntitiesHeaderLinks
              entityType={entityType}
              linkedEntityStore={linkedEntityStore}
              currentPageEncodedUrl={currentPageEncodedUrl}
            />

            {isProject && (
              <ProjectFieldsBlock
                fieldsStore={fieldsStore}
                users={userStore.activeUsers}
                fieldValuesStore={fieldValuesStore}
                responsibleUserIdModel={responsibleUserId}
                activeProjectFieldCodes={activeProjectFieldCodes}
                handleChangeResponsibleUserId={handleChangeResponsibleUserId}
              />
            )}

            {entity && (
              <CardSystemInfoBlock
                closedAt={entity.closedAt}
                createdAt={entity.createdAt}
                lastShipmentDate={entity.lastShipmentDate}
                isOnSystemStatus={currentStage ? currentStage.isSystem : false}
              />
            )}

            {isDeleteModalOpened && (
              <WarningModal
                approveLoading={deletingCard}
                isOpened={isDeleteModalOpened}
                title={t('delete_warning_title')}
                annotation={t('delete_warning_caption')}
                onApprove={deleteEntity}
                onClose={hideDeleteModal}
              />
            )}

            {entity && (
              <ChangeLinkedResponsiblesModal
                currentEntityId={entity.id}
                isOpened={isChangeResponsibleModalOpened}
                responsibleUserId={responsibleUserId.value}
                linkedEntityForms={linkedEntityStore.entityForms}
                hide={hideChangeResponsibleModal}
              />
            )}
          </CardHeader>

          {isFieldsEditMode ? (
            <EditFieldsTab
              autoFocus
              entityTypeId={entityType.id}
              isEditMode={isFieldsEditMode}
              fieldGroupsStore={fieldGroupsStore}
              fieldsStore={cardStore.fieldsStore}
              showEditButton={currentUser.isAdmin()}
              fieldSettingsStore={cardStore.fieldsSettingsStore}
              toggleEditMode={handleToggleFieldsEditMode}
              handleChangeTab={handleChangeTab}
            />
          ) : (
            <ShowFieldsTab
              isEditMode={isFieldsEditMode}
              fields={fieldsStore.activeFields}
              fieldValuesStore={fieldValuesStore}
              disabled={!areFieldsEditable}
              showEditButton={currentUser.isAdmin()}
              activeTabKey={fieldGroupsStore.activeTabKey}
              fieldGroups={fieldGroupsStore.activeFieldGroups}
              fieldSettingsStore={cardStore.fieldsSettingsStore}
              extraTabs={
                filesEnable && (
                  <StyledFieldGroupTab
                    value="files"
                    $active={fieldGroupsStore.activeTabKey === 'files'}
                    {...{ [DATA_TAB_ATTRIBUTE]: 'files' }}
                  >
                    {t('files')}
                  </StyledFieldGroupTab>
                )
              }
              extraTabPanels={
                filesEnable && (
                  <FieldGroupTabPanel
                    value="files"
                    $stack={fieldGroupsStore.activeTabKey === 'files'}
                  >
                    <ShowFiles filesStore={filesStore} readonly={!entity?.userRights.canEdit} />
                  </FieldGroupTabPanel>
                )
              }
              onChangeTab={handleChangeTab}
              getExtraFields={getExtraFields}
              toggleEditMode={handleToggleFieldsEditMode}
              onSelectOrgRequisitesSuggestion={handleSelectOrgRequisitesSuggestion}
              onSelectBankRequisitesSuggestion={handleSelectBankRequisitesSuggestion}
            />
          )}

          {entityTypeLinksStore &&
            (isFieldsEditMode ? (
              <EntityTypeLinksBlock entityTypeLinksStore={entityTypeLinksStore} />
            ) : (
              entityTypeLinksStore.sortedEntityTypeLinks.map((l, idx) => (
                <LinkedEntitiesBlock
                  key={l.targetId}
                  cardStore={cardStore}
                  providers={providers}
                  entityTypeId={l.targetId}
                  entityEmailOptions={entityEmailOptions}
                  currentPageEncodedUrl={currentPageEncodedUrl}
                  isLast={idx >= entityType.linkedEntityTypes.length - 2}
                  reloadFeed={reloadFeed}
                  invalidateEntityInCache={invalidateEntityInCache}
                />
              ))
            ))}

          {entity &&
            entity.externalEntities.length > 0 &&
            entity.externalEntities.map(e => <ExternalMiniCard key={e.id} externalEntity={e} />)}

          <ActionMenu
            saving={isSavingCard}
            canceling={isCancelingCard}
            opened={isActionMenuOpened}
            onCancel={cancel}
            onSave={handleSave}
          />
        </LeftBlock>

        <RightBlock ref={rightBlockRef} $columnHeight={globalColumnHeight} onScroll={scrollHandler}>
          <Feed
            entity={entity}
            scrolled={scrolled}
            feedStore={feedStore}
            showSkeleton={!adding}
            entityType={entityType}
            activeFilter={activeFilter}
            entityEmailOptions={entityEmailOptions}
            reloadFeed={reloadFeed}
            handleChangeFilter={handleChangeFilter}
          />
        </RightBlock>
      </Content>
    </Root>
  );
});

CardComponent.displayName = 'CardComponent';
export { CardComponent };
