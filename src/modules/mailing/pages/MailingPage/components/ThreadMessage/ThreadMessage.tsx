import { InnerHTMLNormalizerMixin, TextHighlighter, TruncateMixin, type Nullable } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import {
  MessageIcon,
  SendEmailModal,
  useMessageControls,
  type MailMessage,
  type MailMessagePayload,
} from '../../../../shared';
import {
  downloadFileFromMessage,
  getMessageContentToDisplay,
} from '../../../../shared/lib/helpers';
import { mailboxSettingsStore } from '../../../../store';
import { AttachmentsBlock } from '../AttachmentsBlock/AttachmentsBlock';
import { ClipIcon } from '../ClipIcon/ClipIcon';
import { ReplyControls } from '../ReplyControls/ReplyControls';

const Root = styled.div<{ $opened: boolean }>`
  max-width: 100%;
  height: auto;

  ${p =>
    !p.$opened &&
    css`
      height: 96px;

      overflow-y: hidden;
    `};

  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 8px;

  padding: 12px 16px;
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;
  border-radius: var(--border-radius-block);
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 16px;

  &:hover {
    cursor: pointer;
  }

  ${TruncateMixin}
`;

const MessageHeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

const MessageHeaderBlock = styled.div`
  ${TruncateMixin}
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  white-space: nowrap;
  color: var(--button-text-graphite-primary-text);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SubjectWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Subject = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  word-break: break-word;
  color: var(--primary-blue);
`;

const Text = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const SnippetWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
`;

const Snippet = styled(Text)`
  ${TruncateMixin}
`;

const HTMLContainer = styled.article`
  overflow-x: auto;
  margin-top: 8px;

  ${InnerHTMLNormalizerMixin};
`;

interface Props {
  demo: boolean;
  message: MailMessage;
  search: Nullable<string>;
  defaultOpened?: boolean;
  firstMessageInThread: Nullable<MailMessage>;
}

const ThreadMessage = (props: Props) => {
  const { demo, message, search, defaultOpened = false, firstMessageInThread } = props;

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.pages.mailing_page.components.thread',
  });

  const [content, setContent] = useState('');
  const [isRenderingHTML, setIsRenderingHTML] = useState(false);
  const [attachments, setAttachments] = useState<MailMessagePayload[]>([]);

  const [isSendEmailModalOpened, { close: hideSendEmailModal, open: showSendEmailModal }] =
    useDisclosure(false);

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
    message,
    firstMessageSentFrom: firstMessageInThread?.sentFrom ?? null,
    showSendEmailModal,
  });

  useEffect(() => {
    const { content, isRenderingHTML } = getMessageContentToDisplay(
      message.payloads,
      message.snippet ? message.snippet : ''
    );
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setContent(content);
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setIsRenderingHTML(isRenderingHTML);
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setAttachments(message.payloads.filter(payload => payload.filename));
  }, [message.payloads, message.snippet]);

  const [opened, { toggle: toggleOpened }] = useDisclosure(defaultOpened);

  const attachmentsCount = attachments.length;

  const handleDownloadFile = async ({
    payloadId,
    fileName,
  }: {
    payloadId: number;
    fileName: string;
  }): Promise<void> => {
    await downloadFileFromMessage({
      fileName,
      payloadId,
      messageId: message.id,
      mailboxId: message.mailboxId,
    });
  };

  const { sentFrom: sentFromHeaderObject, sentTo: sentToHeaderObject } =
    mailboxSettingsStore.getParsedHeaderString({
      sentFrom: message.sentFrom,
      sentTo: message.sentTo?.[0] ?? null,
    });

  return (
    <Root $opened={opened}>
      <Header onClick={toggleOpened}>
        <MessageHeaderInfo>
          <MessageHeaderBlock title={sentFromHeaderObject.title || undefined}>
            <TextHighlighter
              truncate
              filter={search}
              str={sentFromHeaderObject.email || t('unknown')}
            />
          </MessageHeaderBlock>

          {'➡️'}

          <MessageHeaderBlock title={sentToHeaderObject.title || undefined}>
            <TextHighlighter
              truncate
              filter={search}
              str={sentToHeaderObject.email || t('unknown')}
            />
          </MessageHeaderBlock>
        </MessageHeaderInfo>

        <Date>
          {t('date', { day: message.date.displayLong(), time: message.date.displayTime() })}
        </Date>
      </Header>

      <Content>
        <SubjectWrapper>
          <Subject>
            {message.subject && <TextHighlighter truncate filter={search} str={message.subject} />}
          </Subject>

          {message.hasAttachment && <ClipIcon />}
        </SubjectWrapper>

        {opened ? (
          isRenderingHTML ? (
            <HTMLContainer dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
          ) : (
            <Text>{content}</Text>
          )
        ) : (
          <SnippetWrapper>
            <Snippet>{message.snippet ? message.snippet : ''}</Snippet>
          </SnippetWrapper>
        )}
      </Content>

      {attachmentsCount > 0 && opened && (
        <AttachmentsBlock
          attachments={attachments}
          mailboxId={message.mailboxId}
          messageId={message.id}
          handleDownloadFile={handleDownloadFile}
        />
      )}

      {opened && (
        <ReplyControls
          disabled={demo}
          onReply={handleReply}
          onReplyAll={handleReplyAll}
          onForward={handleForward}
        />
      )}

      {isSendEmailModalOpened && (
        <SendEmailModal
          to={toWhom}
          subject={subject}
          replyTo={replyTo}
          from={message.mailboxId}
          isOpened={isSendEmailModalOpened}
          replyToMessageId={replyToMessageId}
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

export { ThreadMessage };
