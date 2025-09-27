import { routes } from '@/app';
import { authStore } from '@/modules/auth';
import { DefaultLoader, LinkedEntityTag, MediaBreakpoints, envUtil, type Nullable } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  AddContactIcon,
  AddEntityIcon,
  CloseIcon,
  MessageIcon,
  SendEmailModal,
  SpamHeaderIcon,
  TrashHeaderIcon,
  UnreadIcon,
  UnspamIcon,
  UntrashIcon,
  getDemoMessages,
  useMessageControls,
  type MailMessage,
} from '../../../../shared';
import { EmptyMessagePlug } from '../EmptyMessagePlug/EmptyMessagePlug';
import { MessageControlButton } from '../MessageControlButton/MessageControlButton';
import { ReplyControls } from '../ReplyControls/ReplyControls';
import { ThreadMessage } from '../ThreadMessage/ThreadMessage';

const Root = styled.div<{ $sidebarOpened: boolean }>`
  height: calc(100dvh - var(--header-with-subheader-height));
  min-width: 472px;

  display: flex;
  flex-direction: column;
  flex: 1;

  margin-left: calc(
    ${p =>
        p.$sidebarOpened
          ? 'var(--mailing-sidebar-width-opened)'
          : 'var(--mailing-sidebar-width-closed)'} +
      var(--mailing-message-panel-width)
  );

  transition: var(--transition-200);

  @media ${MediaBreakpoints.SM} {
    margin-left: 0;
  }
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 16px;
`;

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;

  padding: 0 16px 16px;

  overflow-y: auto;
`;

const CloseIconWrapper = styled.div`
  margin-left: auto;
`;

const LinkedEntityTagWrapper = styled.div`
  flex: 1;
`;

interface Props {
  showDemoMessage: boolean;
  loading: boolean;
  isSidebarOpened: boolean;
  messages: MailMessage[];
  search: Nullable<string>;
  spamThreadLoading: boolean;
  trashThreadLoading: boolean;
  spamHandlers: {
    isInSpam: boolean;
    spamAction: (mailboxId: number, messageId: number) => void;
  };
  trashHandlers: {
    isInTrash: boolean;
    trashAction: (mailboxId: number, messageId: number) => void;
  };
  messagesLoading: boolean;
  canThreadBeUnseen: boolean;
  onClose: () => void;
  onUnseen: (mailboxId: number, messageId: number) => void;
  onAddContact: (mailboxId: number, messageId: number) => void;
  onAddTask: (description: string) => void;
}

const Thread = (props: Props) => {
  const {
    showDemoMessage,
    loading,
    isSidebarOpened,
    messages,
    search,
    spamThreadLoading,
    trashThreadLoading,
    spamHandlers,
    trashHandlers,
    messagesLoading,
    canThreadBeUnseen,
    onUnseen,
    onAddContact,
    onAddTask,
    onClose,
  } = props;

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.pages.mailing_page.components.thread',
  });

  const { user: currentUser } = authStore;

  const demoMessages = getDemoMessages({ currentUserName: currentUser?.fullName || t('user'), t });

  const [isSendEmailModalOpened, { close: hideSendEmailModal, open: showSendEmailModal }] =
    useDisclosure(false);

  const firstMessage = messages[0] ?? null;
  const firstMessageInThread = messages.at(-1) ?? null;

  const {
    headerTitle,
    replyTo,
    replyToMessageId,
    subject,
    toWhom,
    handleReply,
    handleReplyAll,
    handleForward,
  } = useMessageControls({
    message: firstMessage,
    firstMessageSentFrom: firstMessageInThread?.sentFrom ?? null,
    showSendEmailModal,
  });

  const messagesToDisplay = showDemoMessage ? demoMessages : messages;

  const handleThreadSpam = useCallback(() => {
    if (firstMessage) spamHandlers.spamAction(firstMessage.mailboxId, firstMessage.id);
  }, [firstMessage, spamHandlers]);

  const handleThreadTrash = useCallback(() => {
    if (firstMessage) trashHandlers.trashAction(firstMessage.mailboxId, firstMessage.id);
  }, [firstMessage, trashHandlers]);

  const handleAddContact = useCallback(() => {
    if (firstMessage && onAddContact) onAddContact(firstMessage.mailboxId, firstMessage.id);
  }, [firstMessage, onAddContact]);

  const handleThreadUnseen = useCallback(() => {
    if (firstMessage) onUnseen(firstMessage.mailboxId, firstMessage.id);
  }, [firstMessage, onUnseen]);

  const handleAddTask = useCallback(() => {
    if (firstMessage && onAddTask) {
      let text: Nullable<string> = null;

      const payloadWithHTML = firstMessage.payloads.find(
        p => p.mimeType === 'text/html' && !p.filename
      );

      if (payloadWithHTML?.content) text = payloadWithHTML.content;

      if (!text) {
        const payloadWithPlainText = firstMessage.payloads.find(
          p => p.mimeType === 'text/plain' && !p.filename
        );

        if (payloadWithPlainText) text = payloadWithPlainText.content;
      }

      onAddTask(
        `${t('from')}: ${firstMessage.sentFrom}
${t('subject')}: ${firstMessage.subject}
      
${text || ''}`
      );
    }
  }, [firstMessage, onAddTask, t]);

  const messagesLoadingOrDemo = messagesLoading || showDemoMessage;

  if (!messagesToDisplay.length && !loading)
    return (
      <EmptyMessagePlug
        pageHasMessagePanel
        sidebarOpened={isSidebarOpened}
        caption={t('no_selected_message')}
      />
    );

  return (
    <Root $sidebarOpened={isSidebarOpened}>
      {!loading && (
        <Controls>
          <ControlsRow>
            <MessageControlButton
              label={t('add_task')}
              hiddenlyDisabled={messagesLoadingOrDemo}
              onClick={handleAddTask}
            >
              <AddEntityIcon />
            </MessageControlButton>

            {(!firstMessage || !firstMessage.entityInfo) && (
              <MessageControlButton
                label={t('add_contact')}
                hiddenlyDisabled={messagesLoadingOrDemo}
                onClick={handleAddContact}
              >
                <AddContactIcon />
              </MessageControlButton>
            )}

            <MessageControlButton
              loading={spamThreadLoading}
              hiddenlyDisabled={messagesLoadingOrDemo}
              label={spamHandlers.isInSpam ? t('unspam') : t('spam')}
              onClick={handleThreadSpam}
            >
              {spamHandlers.isInSpam ? <UnspamIcon /> : <SpamHeaderIcon />}
            </MessageControlButton>

            <MessageControlButton
              label={t('unseen')}
              disabled={!canThreadBeUnseen}
              hiddenlyDisabled={messagesLoadingOrDemo}
              onClick={handleThreadUnseen}
            >
              <UnreadIcon />
            </MessageControlButton>

            <MessageControlButton
              loading={trashThreadLoading}
              danger={!trashHandlers.isInTrash}
              hiddenlyDisabled={messagesLoadingOrDemo}
              label={trashHandlers.isInTrash ? t('move_to_inbox') : t('trash')}
              onClick={handleThreadTrash}
            >
              {trashHandlers.isInTrash ? <UntrashIcon /> : <TrashHeaderIcon />}
            </MessageControlButton>

            <CloseIconWrapper>
              <MessageControlButton
                danger
                size="small"
                hasBorder={false}
                label={t('close')}
                hiddenlyDisabled={showDemoMessage}
                onClick={onClose}
              >
                <CloseIcon />
              </MessageControlButton>
            </CloseIconWrapper>
          </ControlsRow>

          <ControlsRow>
            <LinkedEntityTagWrapper>
              {firstMessage && firstMessage.entityInfo && (
                <LinkedEntityTag
                  $disabled={!firstMessage.entityInfo.hasAccess}
                  to={routes.card({
                    entityTypeId: firstMessage.entityInfo.entityTypeId,
                    entityId: firstMessage.entityInfo.id,
                  })}
                >
                  {firstMessage.entityInfo.name}
                </LinkedEntityTag>
              )}

              {showDemoMessage && (
                <LinkedEntityTag $disabled={false} to={routes.root}>
                  {t('amwork_workspace', { company: envUtil.appName })}
                </LinkedEntityTag>
              )}
            </LinkedEntityTagWrapper>

            <ReplyControls
              disabled={showDemoMessage}
              onReply={handleReply}
              onForward={handleForward}
              onReplyAll={handleReplyAll}
            />
          </ControlsRow>
        </Controls>
      )}

      {loading ? (
        <DefaultLoader />
      ) : (
        <List>
          {messagesToDisplay.map((m, idx) => (
            <ThreadMessage
              key={`${m.id}-${idx}`}
              message={m}
              search={search}
              demo={showDemoMessage}
              defaultOpened={idx === 0}
              firstMessageInThread={firstMessageInThread}
            />
          ))}
        </List>
      )}

      {isSendEmailModalOpened && firstMessage && (
        <SendEmailModal
          from={firstMessage.mailboxId}
          to={toWhom}
          isOpened={isSendEmailModalOpened}
          subject={subject}
          replyToMessageId={replyToMessageId}
          replyTo={replyTo}
          headerTitle={
            <>
              <MessageIcon />
              {headerTitle}
            </>
          }
          onClose={hideSendEmailModal}
        />
      )}
    </Root>
  );
};

export { Thread };
