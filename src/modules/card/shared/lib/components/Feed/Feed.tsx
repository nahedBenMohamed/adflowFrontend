import { authStore } from '@/modules/auth';
import { SendEmailModal } from '@/modules/mailing';
import { AddAppointmentDrawer, useGetSchedules } from '@/modules/scheduler';
import { TaskSettingsIdentifier } from '@/modules/tasks';
import {
  EntityCategory,
  PermissionObjectType,
  useModalControl,
  type Entity,
  type EntityType,
  type FeedItemFilter,
  type FileLink,
  type Nullable,
  type Option,
  type Optional,
} from '@/shared';
import autoAnimate from '@formkit/auto-animate';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useIntersectionObserver } from 'usehooks-ts';
import type { FeedStore } from '../../../../store';
import { DocumentIcon, FeedControlFilterIcon, FeedControlPlusIcon } from '../../../assets';
import { useGetProjectTaskBoardId } from '../../hooks';
import {
  AddTaskModal,
  FeedControl,
  FeedGroupList,
  FeedItemLeftBlock,
  FeedSkeleton,
  FiltersBlock,
  OpenedFrom,
} from './components';
import { FeedVerticalLine } from './components/FeedItem';

const Timeline = styled.div`
  position: relative;
`;

const LoadMoreObserver = styled.div`
  position: absolute;
  bottom: 10px;

  height: 450px;
  width: 100%;

  pointer-events: none;
`;

const FeedControlWrapper = styled.div`
  max-width: 100%;
  width: 100%;

  display: flex;

  // to align with FeedItemWrapper
  padding-right: 2px;
`;

const FeedControlConnector = styled.hr`
  height: 1px;
  width: 16px;

  flex-shrink: 0;

  margin-top: 26px;
  background-color: var(--graphite-graphite-120);
`;

const LineWrapper = styled.div`
  width: 36px;

  flex-shrink: 0;
  display: flex;
  justify-content: center;
`;

const FiltersBlockWrapper = styled.div`
  position: sticky;
  top: -3px;
  left: 0;

  width: 100%;
  max-width: 100%;

  display: flex;
  gap: 16px;

  // lower than sidebar z-index, so on mobile it hides underneath it
  z-index: 98;
  background-color: var(--graphite-graphite-20);
`;

const DocumentIconWrapper = styled.div`
  width: 20px;
  height: 20px;
`;

const EmptyFeed = styled.div`
  width: 100%;
  height: 100px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

interface Props {
  entity: Nullable<Entity>;
  scrolled: boolean;
  feedStore: FeedStore;
  showSkeleton: boolean;
  entityType: EntityType;
  activeFilter: FeedItemFilter;
  entityEmailOptions: Option<string>[];
  reloadFeed: () => void;
  handleChangeFilter: (value: FeedItemFilter) => void;
}

const Feed = observer((props: Props) => {
  const {
    entity,
    entityType,
    activeFilter,
    feedStore,
    showSkeleton,
    entityEmailOptions,
    scrolled,
    reloadFeed,
    handleChangeFilter,
  } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed',
  });

  const [timelineRef, setTimelineRef] = useState<Nullable<HTMLDivElement>>(null);

  const [drawerKey, rerenderDrawer] = useReducer(x => ++x, 0);

  const addAppointmentModalControl = useModalControl(false);

  const [isAddTaskModalOpened, { close: hideAddTaskModal, open: showAddTaskModal }] =
    useDisclosure(false);

  const feedGroups = feedStore.getFeedGroups();

  const { data: schedules } = useGetSchedules({
    entityTypeId: entityType.id,
  });

  const entityId = useMemo<Optional<number>>(() => (entity ? entity.id : undefined), [entity]);

  useEffect(() => {
    feedStore.clearFeedItems();

    if (entityId) feedStore.getFeedItems({ entityId: entityId, activeFilter });
  }, [activeFilter, entityId, feedStore]);

  const { isIntersecting, ref: lastElement } = useIntersectionObserver({});

  useEffect(() => {
    if (entityId && isIntersecting)
      feedStore.loadMoreFeedItems({ entityId: entityId, activeFilter });
  }, [isIntersecting, feedStore, entityId, activeFilter]);

  const taskBoardId = useGetProjectTaskBoardId(entity?.boardId ?? null);

  const currentUser = authStore.user;

  if (!currentUser) throw new Error('currentUser is not defined, failed to render Feed');

  const taskSettingsIdentifier = TaskSettingsIdentifier.forEntityType(entityType.id);

  const [emailModalOpened, { close: hideEmailModal, open: showEmailModal }] = useDisclosure(false);
  const [selectedDocuments, setSelectedDocuments] = useState<FileLink[]>([]);

  const handleShowEmailModal = (documents: FileLink[]) => {
    setSelectedDocuments(documents);
    showEmailModal();
  };

  const getTaskBoardId = () => {
    if (entityType.entityCategory === EntityCategory.PROJECT)
      return entity?.stageId ? taskBoardId : null;

    return null;
  };

  const handleSendEmail = (result: boolean) => {
    hideEmailModal();

    if (result) reloadFeed();
  };

  const availableSchedules = useMemo(
    () => schedules?.filter(s => currentUser.canCreate(PermissionObjectType.SCHEDULE, s.id)),
    [schedules, currentUser]
  );

  useEffect(() => {
    timelineRef && autoAnimate(timelineRef);
  }, [timelineRef]);

  const canEdit = entity
    ? currentUser.canEdit(PermissionObjectType.ENTITY_TYPE, entity.entityTypeId)
    : false;

  return (
    <>
      <FeedControlWrapper>
        <FeedItemLeftBlock paddingTop="8px" hideTopLine Icon={<FeedControlPlusIcon />} />

        <FeedControlConnector />

        <FeedControl
          entity={entity}
          disabled={!canEdit}
          feedStore={feedStore}
          entityType={entityType}
          currentUser={currentUser}
          activeFilter={activeFilter}
          availableSchedules={availableSchedules}
          reloadFeed={reloadFeed}
          showAddTaskModal={showAddTaskModal}
          showEmailModal={handleShowEmailModal}
          showAddAppointmentDrawer={addAppointmentModalControl.open}
        />
      </FeedControlWrapper>

      {entity && emailModalOpened && (
        <SendEmailModal
          entityEmailOptions={entityEmailOptions}
          entityId={entity.id}
          isOpened={emailModalOpened}
          headerTitle={
            <>
              <DocumentIconWrapper>
                <DocumentIcon />
              </DocumentIconWrapper>

              {t('share_documents')}
            </>
          }
          subject={entity.name}
          fileLinks={selectedDocuments}
          onClose={handleSendEmail}
        />
      )}

      {entity && isAddTaskModalOpened && (
        <AddTaskModal
          entityId={entity.id}
          boardId={getTaskBoardId()}
          isOpened={isAddTaskModalOpened}
          identifier={taskSettingsIdentifier}
          onTaskAdd={dto => feedStore.addTask({ dto, activeFilter })}
          onRepeatingTaskAdd={dtos => feedStore.addRepeatingTask({ dtos, activeFilter })}
          openedFrom={
            entityType.entityCategory === EntityCategory.PROJECT
              ? OpenedFrom.PROJECT_ENTITY_CARD
              : OpenedFrom.COMMON_ENTITY_CARD
          }
          onClose={hideAddTaskModal}
        />
      )}

      {entity && availableSchedules && availableSchedules.length > 0 && (
        <AddAppointmentDrawer
          key={drawerKey}
          entity={entity}
          schedules={availableSchedules}
          opened={addAppointmentModalControl.opened}
          killDrawerState={rerenderDrawer}
          hide={addAppointmentModalControl.close}
        />
      )}

      <LineWrapper>
        <FeedVerticalLine $height={2} />
      </LineWrapper>

      <FiltersBlockWrapper>
        <FeedItemLeftBlock
          topLineHeight={14}
          hideBottomLine={!Boolean(feedStore.isLoading || feedGroups.length > 0)}
          Icon={<FeedControlFilterIcon />}
        />

        <FiltersBlock
          isScrolled={scrolled}
          entityType={entityType}
          activeType={activeFilter}
          activeFeatureCodes={entityType.featureCodes}
          onChange={handleChangeFilter}
        />
      </FiltersBlockWrapper>

      <Timeline>
        {feedStore.isLoading ? (
          showSkeleton && <FeedSkeleton />
        ) : (
          <div ref={setTimelineRef}>
            {feedStore.isLoaded && feedGroups.length === 0 && <EmptyFeed>{t('empty')}</EmptyFeed>}

            <FeedGroupList
              feedGroups={feedGroups}
              feedStore={feedStore}
              entityEmailOptions={entityEmailOptions}
            />
          </div>
        )}

        <LoadMoreObserver ref={lastElement} />
      </Timeline>
    </>
  );
});

Feed.displayName = 'Feed';
export { Feed };
