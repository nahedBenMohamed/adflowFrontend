import { authStore } from '@/modules/auth';
import {
  ChatProviderTransport,
  CreateGroupChatDto,
  useCreateGroupChat,
  useGetChatExists,
  useGetChatProviders,
  useMultichatContext,
} from '@/modules/multichat';
import type { Schedule } from '@/modules/scheduler';
import type { CreateActivityDto } from '@/modules/tasks';
import {
  FeatureCode,
  HideScrollbarMixin,
  MiniLoader,
  MyFloatingTooltip,
  PermissionObjectType,
  envUtil,
  useTransformScroll,
  type Entity,
  type EntityType,
  type FeedItemFilter,
  type FileLink,
  type Nullable,
  type User,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import type { CreateNoteDto } from '../../../../../../api';
import { CreateDocumentStore, type FeedStore } from '../../../../../../store';
import {
  FeedControlActivityIcon,
  FeedControlChatIcon,
  FeedControlNoteIcon,
  FeedControlTaskIcon,
  FeedControlVisitIcon,
} from '../../../../../assets';
import {
  ActualFeedTabs,
  AddActivityTabPanel,
  AddNoteTabPanel,
  CreateDocumentsTab,
  FEED_CONTROL_DATA_TAB_ATTRIBUTE,
  FeedControlTab,
  MoreTabsDropdown,
  type SimpleTabOption,
} from './components';

const Root = styled.div<{ $disabled: boolean }>`
  position: relative;

  width: calc(100% - 52px);

  display: flex;
  flex-direction: column;

  border-radius: var(--border-radius-block);
  background-color: var(--primary-statuses-white-0);
  box-shadow:
    0px 1px 2px 0px rgba(172, 181, 195, 0.48),
    0px 0px 4px 0px rgba(219, 223, 229, 0.24);

  ${p =>
    p.$disabled &&
    css`
      opacity: 0.6;

      * {
        pointer-events: none;
      }
    `}
`;

const TabsListWrapper = styled.div`
  height: 46px;

  display: flex;

  padding: 8px 16px 0;
  border-bottom: 1px solid var(--graphite-graphite-80);
`;

const TabsList = styled.div<{ $hasHiddenTabs: boolean }>`
  height: 100%;

  display: flex;
  align-items: flex-start;
  gap: 8px;

  overflow-x: auto;
  overflow-y: hidden;

  ${p =>
    p.$hasHiddenTabs &&
    css`
      padding-right: 24px;

      // fade effect for the right overflow
      mask-image: linear-gradient(to left, transparent, var(--primary-statuses-white-0) 24px);
    `}

  ${HideScrollbarMixin}
`;

const MiniLoaderWrapper = styled.div`
  padding-top: 6px;
`;

interface Props {
  entity: Nullable<Entity>;
  currentUser: User;
  disabled: boolean;
  feedStore: FeedStore;
  entityType: EntityType;
  activeFilter: FeedItemFilter;
  availableSchedules?: Schedule[];
  reloadFeed: () => void;
  showEmailModal: (files: FileLink[]) => void;
  showAddTaskModal: () => void;
  showAddAppointmentDrawer: () => void;
}

const FeedControl = (props: Props) => {
  const {
    entity,
    currentUser,
    disabled,
    feedStore,
    entityType,
    activeFilter,
    availableSchedules,
    reloadFeed,
    showEmailModal,
    showAddTaskModal,
    showAddAppointmentDrawer,
  } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed',
  });

  const tabsListRef = useRef<HTMLDivElement>(null);

  const createDocumentStore = useMemo(() => new CreateDocumentStore(), []);

  const [hiddenTabs, setHiddenTabs] = useState<ActualFeedTabs[]>([]);
  const [activeTab, setActiveTab] = useState<ActualFeedTabs.NOTE | ActualFeedTabs.ACTIVITY>(
    ActualFeedTabs.NOTE
  );

  const {
    data: isChatCreated,
    isLoading: isChatCreatedLoading,
    refetch: refetchIsChatCreated,
  } = useGetChatExists(entity?.id ?? -1);

  const handleAddNote = useCallback(
    async (dto: CreateNoteDto): Promise<boolean> =>
      await feedStore.addNote({ entityId: entity?.id ?? -1, dto, activeFilter }),
    [activeFilter, entity, feedStore]
  );

  const handleAddActivity = useCallback(
    async (dto: CreateActivityDto): Promise<boolean> =>
      await feedStore.addActivity({ dto, activeFilter }),
    [activeFilter, feedStore]
  );

  const handleSetNoteTab = useCallback(() => setActiveTab(ActualFeedTabs.NOTE), []);
  const handleSetActivityTab = useCallback(() => setActiveTab(ActualFeedTabs.ACTIVITY), []);

  const { show: showMultichatModal } = useMultichatContext();
  const { data: providers } = useGetChatProviders();

  const { mutateAsync: createChat, isPending: chatCreating } = useCreateGroupChat();

  const handleCreateChat = useCallback(async (): Promise<void> => {
    if (!providers || !entity) return;

    const amworkProvider = providers.find(p => p.transport === ChatProviderTransport.AMWORK);

    if (!amworkProvider) return;

    const currentUserId = authStore.user?.id;

    const dto = new CreateGroupChatDto({
      title: entity.name,
      entityId: entity.id,
      providerId: amworkProvider.id,
      participantIds: currentUserId === entity.responsibleUserId ? [] : [entity.responsibleUserId],
    });

    const createdChat = await createChat(dto);

    showMultichatModal({ activeChatId: createdChat.id, activeProviderId: createdChat.providerId });

    refetchIsChatCreated();
  }, [entity, providers, createChat, showMultichatModal, refetchIsChatCreated]);

  const [
    createDocumentsDrawerOpened,
    { close: hideCreateDocumentsDrawer, open: showCreateDocumentsDrawer },
  ] = useDisclosure(false);

  useEffect(() => {
    const tabsList = tabsListRef.current;

    if (!tabsList) return;

    const tabs = tabsList.querySelectorAll('.workspace__FeedControlTab--Root');

    if (tabs) {
      const tabsArray = Array.from(tabs);

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            const tab = entry.target.getAttribute(
              FEED_CONTROL_DATA_TAB_ATTRIBUTE
            ) as ActualFeedTabs;

            if (entry.isIntersecting) {
              setHiddenTabs(prev => prev.filter(t => t !== tab));
            } else {
              setHiddenTabs(prev => [...prev.filter(t => t !== tab), tab]);
            }
          });
        },
        {
          // there is an unknown issues occurring when the threshold is set to 1 in Safari
          // so we temporarily set it to 0.99 until further investigation
          threshold: 0.99,
          root: tabsList,
          rootMargin: '110% 0px 110% 0px',
        }
      );

      tabsArray.forEach(t => observer.observe(t));

      return () => tabsArray.forEach(t => observer.unobserve(t));
    }
  }, [availableSchedules]);

  useTransformScroll(tabsListRef);

  const tabTitleMap = useMemo<Record<ActualFeedTabs, string>>(
    () => ({
      [ActualFeedTabs.NOTE]: t('notes'),
      [ActualFeedTabs.TASK]: t('tasks'),
      [ActualFeedTabs.CHAT]: isChatCreated
        ? t('amwork_messenger', { company: envUtil.appName })
        : t('create_chat'),
      [ActualFeedTabs.DOCUMENTS]:
        createDocumentStore.entityDocuments.length > 0 ? t('documents') : t('create_documents_tab'),
      [ActualFeedTabs.VISIT]: t('add_visit'),
      [ActualFeedTabs.ACTIVITY]: t('activities'),
    }),
    [createDocumentStore.entityDocuments, isChatCreated, t]
  );

  const tabOnClickMap = useMemo<Record<ActualFeedTabs, () => void>>(
    () => ({
      [ActualFeedTabs.NOTE]: handleSetNoteTab,
      [ActualFeedTabs.TASK]: showAddTaskModal,
      [ActualFeedTabs.CHAT]: handleCreateChat,
      [ActualFeedTabs.DOCUMENTS]: showCreateDocumentsDrawer,
      [ActualFeedTabs.VISIT]: showAddAppointmentDrawer,
      [ActualFeedTabs.ACTIVITY]: handleSetActivityTab,
    }),
    [
      showAddTaskModal,
      handleCreateChat,
      handleSetNoteTab,
      handleSetActivityTab,
      showAddAppointmentDrawer,
      showCreateDocumentsDrawer,
    ]
  );

  const generateSimpleTabsOptions = useCallback(
    (): SimpleTabOption[] =>
      hiddenTabs.map<SimpleTabOption>(ht => ({
        title: tabTitleMap[ht],
        onClick: tabOnClickMap[ht],
      })),
    [hiddenTabs, tabOnClickMap, tabTitleMap]
  );

  const simpleTabsOptions = useMemo(() => generateSimpleTabsOptions(), [generateSimpleTabsOptions]);

  const hasHiddenTabs = hiddenTabs.length > 0;

  return (
    <MyFloatingTooltip withinPortal disabled={Boolean(entity)} label={t('disabled_while_adding')}>
      <Root $disabled={disabled} title={disabled && Boolean(entity) ? t('readonly') : undefined}>
        <TabsListWrapper>
          <TabsList ref={tabsListRef} $hasHiddenTabs={hasHiddenTabs}>
            {entityType.hasFeature(FeatureCode.NOTE) && (
              <FeedControlTab
                tab={ActualFeedTabs.NOTE}
                Icon={<FeedControlNoteIcon />}
                text={tabTitleMap[ActualFeedTabs.NOTE]}
                active={activeTab === ActualFeedTabs.NOTE}
                onClick={tabOnClickMap[ActualFeedTabs.NOTE]}
              />
            )}

            {entityType.hasFeature(FeatureCode.ACTIVITY) &&
              currentUser.canCreate(PermissionObjectType.ACTIVITY) && (
                <FeedControlTab
                  tab={ActualFeedTabs.ACTIVITY}
                  Icon={<FeedControlActivityIcon />}
                  text={tabTitleMap[ActualFeedTabs.ACTIVITY]}
                  active={activeTab === ActualFeedTabs.ACTIVITY}
                  onClick={tabOnClickMap[ActualFeedTabs.ACTIVITY]}
                />
              )}

            {entityType.hasFeature(FeatureCode.TASK) &&
              currentUser.canCreate(PermissionObjectType.TASK) && (
                <FeedControlTab
                  tab={ActualFeedTabs.TASK}
                  Icon={<FeedControlTaskIcon />}
                  text={tabTitleMap[ActualFeedTabs.TASK]}
                  onClick={tabOnClickMap[ActualFeedTabs.TASK]}
                />
              )}

            {entity && entityType.hasFeature(FeatureCode.ENTITY_DOCUMENTS) && (
              <CreateDocumentsTab
                entityId={entity.id}
                entityTypeId={entityType.id}
                createDocumentStore={createDocumentStore}
                text={tabTitleMap[ActualFeedTabs.DOCUMENTS]}
                createDocumentsDrawerOpened={createDocumentsDrawerOpened}
                reloadFeed={reloadFeed}
                showEmailModal={showEmailModal}
                hideCreateDocumentsDrawer={hideCreateDocumentsDrawer}
                showCreateDocumentsDrawer={tabOnClickMap[ActualFeedTabs.DOCUMENTS]}
              />
            )}

            {availableSchedules && availableSchedules.length > 0 && (
              <FeedControlTab
                tab={ActualFeedTabs.VISIT}
                Icon={<FeedControlVisitIcon />}
                text={tabTitleMap[ActualFeedTabs.VISIT]}
                onClick={tabOnClickMap[ActualFeedTabs.VISIT]}
              />
            )}

            {entityType.hasFeature(FeatureCode.CHAT) &&
              (isChatCreatedLoading ? (
                <MiniLoaderWrapper>
                  <MiniLoader color="var(--button-text-graphite-primary-text)" />
                </MiniLoaderWrapper>
              ) : (
                <FeedControlTab
                  disabled={chatCreating}
                  tab={ActualFeedTabs.CHAT}
                  Icon={<FeedControlChatIcon />}
                  text={tabTitleMap[ActualFeedTabs.CHAT]}
                  onClick={tabOnClickMap[ActualFeedTabs.CHAT]}
                />
              ))}
          </TabsList>

          {hasHiddenTabs && <MoreTabsDropdown options={simpleTabsOptions} />}
        </TabsListWrapper>

        <div>
          {activeTab === ActualFeedTabs.NOTE && (
            <AddNoteTabPanel handleAddMessage={handleAddNote} />
          )}

          {activeTab === ActualFeedTabs.ACTIVITY && (
            <AddActivityTabPanel
              entityId={entity?.id ?? -1}
              currentUser={currentUser}
              addActivity={handleAddActivity}
            />
          )}
        </div>
      </Root>
    </MyFloatingTooltip>
  );
};

export { FeedControl };
