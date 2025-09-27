import {
  ClipIcon,
  MailMessageBlockStore,
  MessageIcon,
  SendEmailModal,
  downloadFileFromMessage,
  mailboxSettingsStore,
  useMessageControls,
  type MailMessageInfo,
} from '@/modules/mailing';
import {
  EnvelopeIcon,
  InnerHTMLNormalizerMixin,
  SpanWithEllipsis,
  TruncateMixin,
  type Option,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import DOMPurify from 'dompurify';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { AttachmentsMailBlock, DateBlock, InfoBlock, ItemInfo } from '../../../FeedItem';
import { ReplyControls } from '../ReplyControls/ReplyControls';

const Root = styled.div`
  position: relative;

  margin-bottom: 16px;
`;

const Item = styled.div<{ $notSeen?: boolean }>`
  position: relative;

  display: flex;
  flex-direction: column;
  flex: 1;

  padding: 16px 24px;
  border-radius: var(--border-radius-block);
  background-color: var(--primary-statuses-white-0);
  box-shadow: ${p =>
    p.$notSeen
      ? `0px 1px 2px 0px rgba(44, 189, 242, 0.48), 0px 0px 4px 0px rgba(44, 189, 242, 0.24)`
      : `0px 1px 2px 0px #d0daeb, 0px 0px 2px 0px #eef4fe`};
  transition: var(--transition-200);

  z-index: 2;
`;

const DecorativeBlockCommon = css<{ $notSeen?: boolean }>`
  position: absolute;

  padding: 12px 16px;
  background: var(--primary-statuses-white-0);
  border-radius: var(--border-radius-block);
  box-shadow:
    0px 1px 2px 0px #d0daeb,
    0px 0px 2px 0px #eef4fe;

  ${p =>
    p.$notSeen &&
    `
    box-shadow: 0px 1px 2px 0px rgba(44, 189, 242, 0.48), 0px 0px 4px 0px rgba(44, 189, 242, 0.24);
  `}
`;

const FirstDecorativeBlock = styled.div<{ $notSeen?: boolean }>`
  ${DecorativeBlockCommon}

  width: 98%;
  margin: 0 1%;

  z-index: 1;

  bottom: -4px;
`;

const SecondDecorativeBlock = styled.div<{ $notSeen?: boolean }>`
  ${DecorativeBlockCommon}

  width: 96%;
  margin: 0 2%;

  z-index: 0;

  bottom: -8px;
`;

const Title = styled.span`
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: var(--button-text-graphite-priory-text);
  transition: var(--transition-200);

  ${TruncateMixin};
`;

const Subject = styled.div`
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  overflow: hidden;
  transition: var(--transition-200);
`;

const ClickableBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;

  &:hover {
    cursor: pointer;

    ${Title} {
      text-decoration: underline;
    }

    ${Subject} {
      text-decoration: underline;
    }
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  margin-top: 16px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TopHeaderBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserName = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin};
`;

const Attachments = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-primary-text);
`;

const SeenFlag = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-primary-text);

  margin-top: 2px;
`;

const Snippet = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HTMLContainer = styled.article`
  overflow-x: auto;

  ${InnerHTMLNormalizerMixin};
`;

const Text = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const ReplyControlsWrapper = styled.div`
  margin-left: auto;
`;

interface Props {
  messageInfo: MailMessageInfo;
  entityEmailOptions: Option<string>[];
  firstMessageInThread: MailMessageInfo;
  hasMailNotSeen?: boolean;
  hasDecorations?: boolean;
  isThreadOpened?: boolean;
  triggerSeenRecalculation: () => void;
  handleSeen: (mailboxId: number, messageId: number) => void;
  openThread?: () => void;
  closeThread?: () => void;
}

const MailMessageBlock = observer((props: Props) => {
  const {
    hasMailNotSeen,
    messageInfo,
    firstMessageInThread,
    entityEmailOptions,
    isThreadOpened,
    hasDecorations,
    handleSeen,
    triggerSeenRecalculation,
    openThread,
    closeThread,
  } = props;

  const { id, mailboxId, date, subject: messageInfoSubject, snippet, isSeen } = messageInfo;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed',
  });

  const mailMessageBlockStore = useMemo(() => new MailMessageBlockStore(), []);

  const {
    message,
    content,
    isOpened,
    attachments,
    isRenderingHTML,
    loadContentAndAttachments,
    toggleOpened,
  } = mailMessageBlockStore;

  const [isSendEmailModalOpened, { open: showSendEmailModal, close: hideSendEmailModal }] =
    useDisclosure(false);

  const {
    toWhom,
    replyTo,
    subject,
    headerTitle,
    replyToMessageId,
    handleReply,
    handleReplyAll,
    handleForward,
  } = useMessageControls({
    message,
    firstMessageSentFrom: firstMessageInThread.sentFrom,
    showSendEmailModal,
  });

  const { sentFrom: sentFromHeaderObject, sentTo: sentToHeaderObject } =
    mailboxSettingsStore.getParsedHeaderString({
      sentTo: messageInfo.sentTo,
      sentFrom: messageInfo.sentFrom,
    });

  const handleThreadState = () => {
    if (!openThread || !closeThread) return;

    if (isThreadOpened) {
      closeThread();

      return;
    }

    openThread();
  };

  const handleClick = async (): Promise<void> => {
    if (message) {
      toggleOpened();
      handleThreadState();

      return;
    }

    const fallbackContent = snippet ? snippet : '';
    await loadContentAndAttachments({ mailboxId, messageId: id, fallbackContent });

    if (!messageInfo.isSeen) {
      messageInfo.isSeen = true;

      triggerSeenRecalculation();
      handleSeen(mailboxId, id);
    }

    toggleOpened();
    handleThreadState();
  };

  const handleDownloadFile = useCallback(
    async ({ payloadId, fileName }: { payloadId: number; fileName: string }): Promise<void> =>
      await downloadFileFromMessage({ payloadId, fileName, mailboxId, messageId: id }),
    [id, mailboxId]
  );

  const firstFolder = messageInfo.folders[0];

  return (
    <Root>
      <Item $notSeen={!isSeen || Boolean(hasMailNotSeen !== undefined && !hasMailNotSeen)}>
        <ClickableBlock onClick={handleClick}>
          <Title>{firstFolder ?? ''}</Title>

          <ItemInfo>
            <InfoBlock
              frameVariant="outlined"
              title={t('mail_block.sender')}
              info={
                <UserName title={sentFromHeaderObject.title || t('unknown')}>
                  {sentFromHeaderObject.email}
                </UserName>
              }
            >
              <EnvelopeIcon />
            </InfoBlock>

            <InfoBlock
              frameVariant="outlined"
              title={t('mail_block.recipient')}
              info={
                <UserName title={sentToHeaderObject.title || t('unknown')}>
                  {sentToHeaderObject.email}
                </UserName>
              }
            >
              <EnvelopeIcon />
            </InfoBlock>

            <DateBlock title={t('mail_block.date')} date={date} />
          </ItemInfo>

          {!isOpened && (
            <Header>
              <TopHeaderBlock>
                <Subject>
                  <SpanWithEllipsis text={messageInfoSubject ?? ''} showTitle />
                </Subject>

                {attachments.length > 0 && (
                  <Attachments>
                    <ClipIcon /> {attachments.length}{' '}
                  </Attachments>
                )}

                {isSeen && <SeenFlag>{t('mail_block.seen')}</SeenFlag>}
              </TopHeaderBlock>

              <Snippet>{snippet ? snippet : '...'}</Snippet>
            </Header>
          )}
        </ClickableBlock>

        {isOpened && (
          <Content>
            <Body>
              <Subject>{messageInfoSubject}</Subject>

              {isRenderingHTML ? (
                <HTMLContainer dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
              ) : (
                <Text>{content}</Text>
              )}
            </Body>

            <ControlsWrapper>
              {attachments.length > 0 && (
                <Attachments>
                  <ClipIcon /> {attachments.length}{' '}
                </Attachments>
              )}

              <ReplyControlsWrapper>
                <ReplyControls
                  onForward={handleForward}
                  onReply={handleReply}
                  onReplyAll={handleReplyAll}
                />
              </ReplyControlsWrapper>
            </ControlsWrapper>

            {attachments.length > 0 && (
              <AttachmentsMailBlock
                fileLinks={attachments}
                messageId={messageInfo.id}
                mailboxId={messageInfo.mailboxId}
                handleDownloadFile={handleDownloadFile}
              />
            )}
          </Content>
        )}
      </Item>

      {hasDecorations && !isThreadOpened && (
        <>
          <FirstDecorativeBlock $notSeen={!hasMailNotSeen} />
          <SecondDecorativeBlock $notSeen={!hasMailNotSeen} />
        </>
      )}

      {isSendEmailModalOpened && message && (
        <SendEmailModal
          to={toWhom}
          from={mailboxId}
          subject={subject}
          replyTo={replyTo}
          isOpened={isSendEmailModalOpened}
          replyToMessageId={replyToMessageId}
          entityEmailOptions={entityEmailOptions}
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
});

MailMessageBlock.displayName = 'MailMessageBlock';
export { MailMessageBlock };
