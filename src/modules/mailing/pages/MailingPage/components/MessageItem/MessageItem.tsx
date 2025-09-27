import { TextHighlighter, TruncateMixin, type Nullable, type UtcDate } from '@/shared';
import { useDidUpdate } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import styled, { css } from 'styled-components';
import {
  ClipIcon,
  MessageIcon as ClosedMessageIcon,
  OpenedMessageIcon,
  type MailMessageInfo,
} from '../../../../shared';

interface RootProps {
  $seen: boolean;
  $active: boolean;
}

const Root = styled.div<RootProps>`
  width: 309px;

  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 10px 12px;

  background-color: var(--primary-statuses-white-0);
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;
  border-bottom: 1px solid transparent;
  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  ${p =>
    p.$seen &&
    css`
      box-shadow: none;
      border-color: var(--graphite-graphite-80);
      background-color: var(--graphite-graphite-20);
    `}

  ${p => p.$active && `background-color: #e6fbda`};

  &:hover {
    cursor: pointer;

    background-color: ${p => !p.$active && '#f3fded'};
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const TitleWrapper = styled.div<{ $seen: boolean }>`
  max-width: 232px;

  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  line-height: 20px;
  font-weight: ${p => (p.$seen ? 400 : 600)};
  color: var(--button-text-graphite-priory-text);
`;

const Title = styled.div`
  ${TruncateMixin}
`;

const MessageIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Date = styled.span`
  width: 42px;
  flex-shrink: 0;

  font-weight: 400;
  font-size: 12px;
  line-height: 19px;
  text-align: right;

  white-space: nowrap;

  color: var(--button-text-graphite-primary-text);
`;

const Body = styled.div`
  height: 100%;

  display: flex;
  gap: 8px;
`;

const Content = styled.div<{ $fullWidth: boolean }>`
  width: ${p => (p.$fullWidth ? '100%' : 'calc(100% - 28px)')};

  display: flex;
  flex-direction: column;

  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
`;

const Subject = styled.div`
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

const Snippet = styled.div`
  color: var(--button-text-graphite-primary-text);

  ${TruncateMixin}
`;

const ClipIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  margin-top: auto;
`;

interface Props {
  active: boolean;
  message: MailMessageInfo;
  search: Nullable<string>;
  currentThreadId: Nullable<string>;
  setCurrentThreadId: (threadId: Nullable<string>) => void;
  loadMessages: ({ mailboxId, messageId }: { mailboxId: number; messageId: number }) => void;
  onSeenThread: ({ mailboxId, messageId }: { mailboxId: number; messageId: number }) => void;
}

const MessageItem = observer((props: Props) => {
  const {
    active,
    message,
    search,
    currentThreadId,
    setCurrentThreadId,
    loadMessages,
    onSeenThread,
  } = props;

  const {
    date,
    isSeen,
    subject,
    snippet,
    threadId,
    sentFrom,
    mailboxId,
    id: messageId,
    hasAttachment,
  } = message;

  const handleSeen = () => {
    if (!isSeen) {
      onSeenThread({ mailboxId, messageId });

      message.isSeen = true;
    }
  };

  const handleClick = () => {
    setCurrentThreadId(threadId);
    handleSeen();
  };

  // we use useDidUpdate here to cover case when we are changing thread programmatically,
  // not by clicking on MessageItem
  useDidUpdate(() => {
    if (message.threadId === currentThreadId) {
      handleSeen();

      loadMessages({ mailboxId, messageId });
    }
  }, [currentThreadId]);

  const getDate = (date: UtcDate): string => {
    if (date.isToday()) return date.displayTime();

    return date.format('D MMM');
  };

  return (
    <Root $active={active} $seen={isSeen} onClick={handleClick}>
      <Header>
        <TitleWrapper $seen={isSeen}>
          <MessageIconWrapper>
            {isSeen ? <OpenedMessageIcon /> : <ClosedMessageIcon />}
          </MessageIconWrapper>

          <Title>
            {sentFrom &&
              (search ? <TextHighlighter truncate str={sentFrom} filter={search} /> : sentFrom)}
          </Title>
        </TitleWrapper>

        <Date>{getDate(date)}</Date>
      </Header>

      <Body>
        <Content $fullWidth={!hasAttachment}>
          <Subject>
            {subject &&
              (search ? <TextHighlighter truncate str={subject} filter={search} /> : subject)}
          </Subject>

          <Snippet>
            {snippet &&
              (search ? <TextHighlighter truncate str={snippet} filter={search} /> : snippet)}
          </Snippet>
        </Content>

        {hasAttachment && (
          <ClipIconWrapper>
            <ClipIcon />
          </ClipIconWrapper>
        )}
      </Body>
    </Root>
  );
});

MessageItem.displayName = 'MessageItem';
export { MessageItem };
