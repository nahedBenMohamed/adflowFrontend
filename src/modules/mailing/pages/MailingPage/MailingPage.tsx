import { SettingsStore, appStore, iconStore, routes, type CreateContactAndLeadDto } from '@/app';
import { AddTaskModal } from '@/modules/card';
import { TaskSettingsIdentifier, taskApi, type CreateTaskDto } from '@/modules/tasks';
import {
  CreateContactModal,
  DefaultHeader,
  IconName,
  MailingAndChatPageTemplate,
  MediaBreakpoints,
  TutorialProductType,
  UriCodingUtil,
  WholePageLoaderWithLogo,
  batchRequest,
  useTitle,
  type DefaultHeaderModuleIconProps,
  type Nullable,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MailboxFolderType, type MailMessageInfo, type MailingPageSettings } from '../../shared';
import { MailMessageStore, MailboxStore, SidebarStore } from '../../store';
import { MessagePanel, Sidebar, Thread } from './components';

const Root = styled.div`
  display: flex;

  @media ${MediaBreakpoints.SM} {
    overflow-x: auto;
  }
`;

const { settings } = SettingsStore.getSettingsStore<MailingPageSettings>('MailingPage');

const emptyCallback = () => {};

const MailingPage = observer(() => {
  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.pages.mailing_page',
  });

  useTitle({ titleTranslationKey: 'mailing' });

  const navigate = useNavigate();
  const { pathname, search: searchParams } = useLocation();
  const currentPageEncodedUrl = UriCodingUtil.encode(`${pathname}${searchParams}`);

  const sidebarStore = useMemo(() => new SidebarStore(settings), []);

  const {
    isOpened: isSidebarOpened,
    activeSectionType,
    activeSectionMailboxId,
    activeMailboxId,
    activeMailboxFolderId,
  } = sidebarStore;

  const mailboxStore = useMemo(() => new MailboxStore(), []);
  const mailMessageStore = useMemo(
    () => new MailMessageStore(),
    // we want to clear messages when mailbox (or inner folder) or section (or inner mailbox) changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeMailboxId, activeSectionType, activeMailboxFolderId, activeSectionMailboxId]
  );

  const [isCreateContactOpened, { close: hideCreateContactModal, open: showCreateContactModal }] =
    useDisclosure(false);
  const [isCreateTaskOpened, { close: hideCreateTaskModal, open: showCreateTaskModal }] =
    useDisclosure(false);

  const [taskDescription, setTaskDescription] = useState<string>();

  const {
    search,
    sections,
    mailboxes,
    mailThreadInfos,
    currentThreadId,
    isMailboxInfoLoaded,
    isSpamThreadLoading,
    isMailboxInfoLoading,
    isTrashThreadLoading,
    isMailThreadInfosLoaded,
    isMailThreadInfosLoading,
    isMailThreadInfosLoadingMore,
    setSearch,
    seenThread,
    unseenThread,
    clearThreads,
    spamThreadHandler,
    setCurrentThreadId,
    trashThreadHandler,
    loadSectionMailThreadInfo,
    loadMailboxMailThreadInfo,
    loadMoreSectionMailThreadInfo,
    loadMoreMailboxMailThreadInfo,
  } = mailboxStore;

  const {
    messages,
    isLoading: areMessagesLoading,
    loadMessages,
    clearMessages,
    createContact,
    invalidateMessagesInCache,
  } = mailMessageStore;

  useEffect(() => {
    mailboxStore.loadMailboxInfo();
  }, [mailboxStore]);

  const handleLoadThreadInfos = useCallback(() => {
    if (activeSectionType) {
      loadSectionMailThreadInfo({ type: activeSectionType, mailboxId: activeSectionMailboxId });

      return;
    }

    if (activeMailboxId)
      loadMailboxMailThreadInfo({ mailboxId: activeMailboxId, folderId: activeMailboxFolderId });
  }, [
    activeMailboxId,
    activeSectionType,
    activeMailboxFolderId,
    activeSectionMailboxId,
    loadSectionMailThreadInfo,
    loadMailboxMailThreadInfo,
  ]);

  const handleLoadMoreThreadInfos = useCallback(() => {
    if (activeSectionType) {
      loadMoreSectionMailThreadInfo({ type: activeSectionType, mailboxId: activeSectionMailboxId });

      return;
    }

    if (activeMailboxId)
      loadMoreMailboxMailThreadInfo({
        mailboxId: activeMailboxId,
        folderId: activeMailboxFolderId,
      });
  }, [
    activeSectionMailboxId,
    activeSectionType,
    activeMailboxFolderId,
    activeMailboxId,
    loadMoreSectionMailThreadInfo,
    loadMoreMailboxMailThreadInfo,
  ]);

  const [isThreadInSpam, setIsThreadInSpam] = useState(false);
  const [isThreadInTrash, setIsThreadInTrash] = useState(false);

  useEffect(() => {
    const activeMailboxFolderInfo = mailboxes
      .find(mb => mb.id === activeMailboxId)
      ?.folders.find(f => f.id === activeMailboxFolderId);

    if (
      activeSectionType === MailboxFolderType.JUNK ||
      activeMailboxFolderInfo?.type === MailboxFolderType.JUNK
    ) {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setIsThreadInSpam(true);
    } else {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setIsThreadInSpam(false);
    }

    if (
      activeSectionType === MailboxFolderType.TRASH ||
      activeMailboxFolderInfo?.type === MailboxFolderType.TRASH
    ) {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setIsThreadInTrash(true);
    } else {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setIsThreadInTrash(false);
    }
  }, [activeMailboxFolderId, activeSectionType, activeMailboxId, mailboxes]);

  const spamHandlers = useMemo(
    () => ({
      isInSpam: isThreadInSpam,
      spamAction: (mailboxId: number, messageId: number) => {
        spamThreadHandler({
          mailboxId,
          messageId,
          type: isThreadInSpam ? 'unspam' : 'spam',
          clearMessages,
        });
      },
    }),
    [isThreadInSpam, spamThreadHandler, clearMessages]
  );

  const trashHandlers = useMemo(
    () => ({
      isInTrash: isThreadInTrash,
      trashAction: (mailboxId: number, messageId: number) => {
        trashThreadHandler({
          mailboxId,
          messageId,
          type: isThreadInTrash ? 'untrash' : 'trash',
          clearMessages,
        });
      },
    }),
    [isThreadInTrash, trashThreadHandler, clearMessages]
  );

  const [createContactData, setCreateContactData] = useState<{
    mailboxId: Nullable<number>;
    messageId: Nullable<number>;
  }>({
    mailboxId: null,
    messageId: null,
  });

  const handleOpenCreateContactModal = async (
    mailboxId: number,
    messageId: number
  ): Promise<void> => {
    setCreateContactData({ mailboxId, messageId });

    showCreateContactModal();
  };

  const handleCloseCreateContactModal = () => {
    hideCreateContactModal();

    setCreateContactData({ mailboxId: null, messageId: null });
  };

  const handleCreateContact = async ({
    dto,
    navigateToCard,
  }: {
    navigateToCard: boolean;
    dto: CreateContactAndLeadDto;
  }): Promise<void> => {
    const { mailboxId, messageId } = createContactData;

    if (!mailboxId || !messageId)
      throw new Error(
        `mailboxId and messageId are required for creating contact from message, but got mailboxId: ${mailboxId} and messageId: ${messageId}`
      );

    const result = await createContact({ mailboxId, messageId, dto });

    if (navigateToCard) {
      navigate(
        routes.cardAfterAdd({
          entityId: result.id,
          entityTypeId: result.entityTypeId,
          from: currentPageEncodedUrl,
        })
      );
    } else {
      invalidateMessagesInCache({ mailboxId, messageId });
    }

    hideCreateContactModal();
    setCreateContactData({ mailboxId: null, messageId: null });
  };

  const handleAddTask = async (description: string): Promise<void> => {
    setTaskDescription(description);
    showCreateTaskModal();
  };

  const onCreateTask = async (task: CreateTaskDto): Promise<boolean> => {
    const createdTask = await taskApi.addTask(task);
    hideCreateTaskModal();

    return Boolean(createdTask);
  };

  const onCreateRepeatingTask = async (dtos: CreateTaskDto[]): Promise<boolean> => {
    let success: boolean = false;

    await batchRequest({
      array: dtos,
      cb: async (dto): Promise<void> => {
        success = await onCreateTask(dto);
      },
    });

    return success;
  };

  const showDemo = !mailboxes.length && isMailboxInfoLoaded;

  const currentThread = mailThreadInfos.find(t => t.id === currentThreadId);

  const messagesInfos = useLocalObservable<MailMessageInfo[]>(() => []);

  useEffect(() => {
    // clear messagesInfos when mailbox or section is changed
    messagesInfos.splice(0, messagesInfos.length);
  }, [activeSectionType, activeMailboxFolderId, messagesInfos]);

  useEffect(() => {
    const getFirstMessageFromEveryThread = (): MailMessageInfo[] =>
      mailThreadInfos.map<MailMessageInfo>(t => t.firstMessage);

    if (isMailThreadInfosLoaded)
      messagesInfos.splice(0, messagesInfos.length, ...getFirstMessageFromEveryThread());
  }, [isMailThreadInfosLoaded, mailThreadInfos, messagesInfos]);

  const handleUnseenThread = (mailboxId: number, messageId: number) => {
    unseenThread({ mailboxId, messageId });

    const messageInfo = messagesInfos.find(m => m.id === messageId);

    if (messageInfo) messageInfo.isSeen = false;
  };

  const canThreadBeUnseen = Boolean(currentThread?.firstMessage.isSeen);

  const handleClearSearch = () => {
    setSearch(null);

    clearThreads();
    handleLoadMoreThreadInfos();
  };

  const moduleIconProps = useMemo<DefaultHeaderModuleIconProps>(
    () => ({
      color: iconStore.systemModuleColor,
      icon: iconStore.getByName(IconName.MAIL).icon,
    }),
    []
  );

  return (
    <MailingAndChatPageTemplate
      Header={
        <DefaultHeader
          moduleName={t('title')}
          moduleIconProps={moduleIconProps}
          productType={TutorialProductType.MAIL}
        />
      }
    >
      {appStore.isLoaded ? (
        <Root>
          <Sidebar
            sections={sections}
            mailboxes={mailboxes}
            noMailboxes={showDemo}
            sidebarStore={sidebarStore}
            loaded={isMailboxInfoLoaded}
            loading={isMailboxInfoLoading}
            setCurrentThreadId={setCurrentThreadId}
            loadSectionMailThreadInfos={loadSectionMailThreadInfo}
            loadMailboxMailThreadInfos={loadMailboxMailThreadInfo}
          />

          <MessagePanel
            search={search}
            showDemoMessage={showDemo}
            messagesInfos={messagesInfos}
            isSidebarOpened={isSidebarOpened}
            loading={isMailThreadInfosLoading}
            currentThreadId={currentThreadId}
            loadingMore={isMailThreadInfosLoadingMore}
            searchProps={{
              setSearch,
              clearThreads,
              handleClearSearch,
              loadThreads: handleLoadThreadInfos,
            }}
            setCurrentThreadId={setCurrentThreadId}
            onSeenThread={showDemo ? emptyCallback : seenThread}
            loadMessages={showDemo ? emptyCallback : loadMessages}
            loadMoreThreads={showDemo ? emptyCallback : handleLoadMoreThreadInfos}
          />

          <Thread
            search={search}
            messages={messages}
            showDemoMessage={showDemo}
            spamHandlers={spamHandlers}
            loading={areMessagesLoading}
            trashHandlers={trashHandlers}
            isSidebarOpened={isSidebarOpened}
            messagesLoading={areMessagesLoading}
            canThreadBeUnseen={canThreadBeUnseen}
            spamThreadLoading={isSpamThreadLoading}
            trashThreadLoading={isTrashThreadLoading}
            onAddTask={handleAddTask}
            onUnseen={handleUnseenThread}
            onAddContact={handleOpenCreateContactModal}
            onClose={showDemo ? emptyCallback : clearMessages}
          />

          {isCreateContactOpened && (
            <CreateContactModal
              isOpened={isCreateContactOpened}
              createContact={handleCreateContact}
              onClose={handleCloseCreateContactModal}
            />
          )}

          {isCreateTaskOpened && (
            <AddTaskModal
              entityId={null}
              isOpened={isCreateTaskOpened}
              initialText={taskDescription}
              identifier={TaskSettingsIdentifier.forTimeBoard()}
              onTaskAdd={onCreateTask}
              onRepeatingTaskAdd={onCreateRepeatingTask}
              onClose={hideCreateTaskModal}
            />
          )}
        </Root>
      ) : (
        <WholePageLoaderWithLogo ensureSubheaderWithOffset />
      )}
    </MailingAndChatPageTemplate>
  );
});

MailingPage.displayName = 'MailingPage';
export { MailingPage };
