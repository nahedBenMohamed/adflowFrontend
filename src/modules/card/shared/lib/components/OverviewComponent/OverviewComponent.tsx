import { iconStore, routes } from '@/app';
import {
  CardFieldHelperContext,
  DuplicatesContext,
  MakeCallProvider,
  SendEmailContext,
  type CardFieldHelperContextValue,
  type DuplicatesContextValue,
  type SendEmailContextValue,
} from '@/modules/fields';
import { SendEmailModal } from '@/modules/mailing';
import { clearChatEntityInCache, useGetChatProviders } from '@/modules/multichat';
import {
  ChangesUnsavedBlocker,
  EntityApiUtil,
  SectionView,
  UriCodingUtil,
  useGetEntityEmailOptions,
  useSendEmail,
  type EntityType,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { FeedStore, type CardStore } from '../../../../store';
import { CardComponent } from '../CardComponent/CardComponent';
import { FieldFormulaCircularDependencyWarningModal } from '../WarningModals/FieldFormulaCircularDependencyWarningModal/FieldFormulaCircularDependencyWarningModal';
import { FieldUsedInFormulaWarningModal } from '../WarningModals/FieldUsedInFormulaWarningModal/FieldUsedInFormulaWarningModal';
import { MutationWarningModal } from '../WarningModals/MutationWarningModal/MutationWarningModal';

interface Props {
  entityType: EntityType;
  cardStore: CardStore;
  isAfterAdd: boolean;
  mutationWarningShown: boolean;
  fieldUsedInFormulaWarningShown: boolean;
  fieldFormulaCircularDependencyWarningShown: boolean;
  entityId?: number;
  backLink?: string;
  ensureSubheader?: boolean;
  hideMutationWarning: () => void;
  hideFieldUsedInFormulaWarning: () => void;
  hideFieldFormulaCircularDependencyWarning: () => void;
}

const OverviewComponent = observer((props: Props) => {
  const {
    entityId,
    entityType,
    cardStore,
    mutationWarningShown,
    fieldUsedInFormulaWarningShown,
    fieldFormulaCircularDependencyWarningShown,
    isAfterAdd,
    ensureSubheader,
    backLink,
    hideMutationWarning,
    hideFieldUsedInFormulaWarning,
    hideFieldFormulaCircularDependencyWarning,
  } = props;

  const { pathname } = useLocation();

  const {
    entity,
    fieldsStore,
    activeFilter,
    entityStageId,
    linkedEntityStore,
    fieldUsedInFormulaId,
    fieldFormulaCircularDependencyId,
    cancel,
    setMutationWarningCode,
    setFieldUsedInFormulaId,
    invalidateEntityInCache,
    setFieldFormulaCircularDependencyId,
  } = cardStore;

  const feedStore = useMemo(() => new FeedStore(), []);

  const { emailModalData, isSendEmailModalOpened, openSendEmailModal, hideSendEmailModal } =
    useSendEmail();

  const entityEmailOptions = useGetEntityEmailOptions({ entity, fieldsStore, linkedEntityStore });

  const { data: providers, isLoading: areProvidersLoading } = useGetChatProviders();

  // when we are selecting duplicate entity in phone or email field
  const changeEntityCb = useCallback(
    async (duplicateId: number): Promise<void> => {
      if (!entity) throw new Error('Failed to changeEntityCb, entity must be defined');

      await EntityApiUtil.delete(entity.id);
      clearChatEntityInCache(entity.id);

      // we can not use navigate here because router will invoke useBlocker hook
      // which is used to show a warning to prevent user from leaving with unsaved changes
      window.location.href = routes.card({ entityTypeId: entityType.id, entityId: duplicateId });
    },
    [entity, entityType]
  );

  const reloadFeed = useCallback(
    () => (entityId ? feedStore.getFeedItems({ entityId, activeFilter }) : null),
    [activeFilter, entityId, feedStore]
  );

  const sendEmailContextValue = useMemo<SendEmailContextValue>(
    () => ({ openSendEmailModal }),
    [openSendEmailModal]
  );

  const duplicatesContextValue = useMemo<DuplicatesContextValue>(
    () => ({
      entityTypeId: entityType.id,
      searchDuplicates: isAfterAdd,
      excludeEntitiesIds: entityId ? [entityId] : [],
      changeEntityCb,
    }),
    [entityId, entityType, isAfterAdd, changeEntityCb]
  );

  const cardFieldHelperContextValue = useMemo<CardFieldHelperContextValue>(
    () => ({
      entityId,
      providers,
      stageId: entityStageId,
      entityName: entity?.name,
      isListView: entityType.section.view === SectionView.LIST,
      reloadFeed,
      invalidateEntityInCache: () => (entityId ? invalidateEntityInCache(entityId) : null),
    }),
    [entityId, entity, entityStageId, entityType, providers, reloadFeed, invalidateEntityInCache]
  );

  const handleCloseMutationWarning = useCallback(() => {
    hideMutationWarning();

    setMutationWarningCode(null);
  }, [hideMutationWarning, setMutationWarningCode]);

  const handleCloseFieldUsedInFormulaWarning = useCallback(() => {
    hideFieldUsedInFormulaWarning();

    setFieldUsedInFormulaId(null);
  }, [hideFieldUsedInFormulaWarning, setFieldUsedInFormulaId]);

  const handleCloseFieldFormulaCircularDependencyWarning = useCallback(() => {
    hideFieldFormulaCircularDependencyWarning();

    setFieldFormulaCircularDependencyId(null);
  }, [hideFieldFormulaCircularDependencyWarning, setFieldFormulaCircularDependencyId]);

  const handleSendEmail = useCallback(
    (result: boolean) => {
      if (!entity) throw new Error('Failed to handleSendEmail, entity must be defined');

      hideSendEmailModal();

      if (result)
        feedStore.getFeedItems({ entityId: entity.id, activeFilter: cardStore.activeFilter });
    },
    [cardStore.activeFilter, entity, feedStore, hideSendEmailModal]
  );

  const currentPageEncodedUrl = UriCodingUtil.encode(pathname);

  const entityIcon = iconStore.getByName(entityType.section.icon).icon;

  const entityColor = iconStore.getEntityColorByEntityCategory(entityType.entityCategory);

  const emailToArray = useMemo<string[]>(
    () => (emailModalData.email ? [emailModalData.email] : []),
    [emailModalData.email]
  );

  return (
    <>
      <ChangesUnsavedBlocker
        shouldBlock={cardStore.isJsonStateChanged()}
        handleSaveChanges={cardStore.save}
      />

      {mutationWarningShown && cardStore.mutationWarningCode && (
        <MutationWarningModal
          opened={mutationWarningShown}
          code={cardStore.mutationWarningCode}
          onClose={handleCloseMutationWarning}
        />
      )}

      {fieldUsedInFormulaWarningShown && fieldUsedInFormulaId && (
        <FieldUsedInFormulaWarningModal
          entityTypeId={entityType.id}
          opened={fieldUsedInFormulaWarningShown}
          fieldUsedInFormulaId={fieldUsedInFormulaId}
          onCancelChanges={cancel}
          onClose={handleCloseFieldUsedInFormulaWarning}
        />
      )}

      {fieldFormulaCircularDependencyId && fieldFormulaCircularDependencyWarningShown && (
        <FieldFormulaCircularDependencyWarningModal
          entityTypeId={entityType.id}
          opened={fieldFormulaCircularDependencyWarningShown}
          fieldFormulaCircularDependencyId={fieldFormulaCircularDependencyId}
          onCancelChanges={cancel}
          onClose={handleCloseFieldFormulaCircularDependencyWarning}
        />
      )}

      <MakeCallProvider>
        <CardFieldHelperContext.Provider value={cardFieldHelperContextValue}>
          <SendEmailContext.Provider value={sendEmailContextValue}>
            <DuplicatesContext.Provider value={duplicatesContextValue}>
              <CardComponent
                backLink={backLink}
                cardStore={cardStore}
                providers={providers}
                feedStore={feedStore}
                isAfterAdd={isAfterAdd}
                ensureSubheader={ensureSubheader}
                entityEmailOptions={entityEmailOptions}
                areProvidersLoading={areProvidersLoading}
                currentPageEncodedUrl={currentPageEncodedUrl}
                reloadFeed={reloadFeed}
              />
            </DuplicatesContext.Provider>
          </SendEmailContext.Provider>
        </CardFieldHelperContext.Provider>
      </MakeCallProvider>

      {entity && isSendEmailModalOpened && (
        <SendEmailModal
          to={emailToArray}
          entityId={entity.id}
          entityIcon={entityIcon}
          entityName={entity.name}
          entityIconColor={entityColor}
          isOpened={isSendEmailModalOpened}
          entityEmailOptions={entityEmailOptions}
          onClose={handleSendEmail}
        />
      )}
    </>
  );
});

OverviewComponent.displayName = 'OverviewComponent';
export { OverviewComponent };
