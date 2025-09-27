import { MailboxStore, type MailThreadInfo } from '@/modules/mailing';
import type { Option } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { MailBlueIcon } from '../../../../../assets';
import { FeedItemLeftBlock, FeedItemWrapper } from '../FeedItem';
import { MailMessageBlock } from './components';

const MessagesWrapper = styled.div`
  max-width: 100%;

  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

interface Props {
  mailThread: MailThreadInfo;
  entityEmailOptions: Option<string>[];
}

const MailThreadBlock = observer((props: Props) => {
  const { mailThread, entityEmailOptions } = props;

  const [isSeen, setIsSeen] = useState(mailThread.messages.every(m => m.isSeen));
  const [trigger, setTrigger] = useState(false);
  const [isThreadOpened, { open: openThread, close: closeThread }] = useDisclosure(false);

  const { seenThread } = useMemo(() => new MailboxStore(), []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setIsSeen(mailThread.messages.every(m => m.isSeen));
  }, [trigger, mailThread.messages]);

  const handleSeen = useCallback(
    (mailboxId: number, messageId: number) => {
      setIsSeen(true);
      seenThread({ mailboxId, messageId });
    },
    [seenThread]
  );

  const triggerSeenRecalculation = () => setTrigger(prev => !prev);

  const firstMessage = mailThread.firstMessage;
  const firstMessageInThread = mailThread.firstMessageInThread;
  const moreThanOneMessage = mailThread.messages.length > 1;

  return (
    <FeedItemWrapper>
      <FeedItemLeftBlock Icon={<MailBlueIcon />} />

      <MessagesWrapper>
        <MailMessageBlock
          hasMailNotSeen={isSeen}
          messageInfo={firstMessage}
          isThreadOpened={isThreadOpened}
          entityEmailOptions={entityEmailOptions}
          firstMessageInThread={firstMessageInThread}
          hasDecorations={moreThanOneMessage && !isThreadOpened}
          openThread={openThread}
          handleSeen={handleSeen}
          closeThread={closeThread}
          triggerSeenRecalculation={triggerSeenRecalculation}
        />

        {isThreadOpened &&
          mailThread.messages.map(
            (m, idx) =>
              idx !== 0 && (
                <MailMessageBlock
                  key={m.id}
                  messageInfo={m}
                  entityEmailOptions={entityEmailOptions}
                  firstMessageInThread={firstMessageInThread}
                  handleSeen={handleSeen}
                  triggerSeenRecalculation={triggerSeenRecalculation}
                />
              )
          )}
      </MessagesWrapper>
    </FeedItemWrapper>
  );
});

MailThreadBlock.displayName = 'MailThreadBlock';
export { MailThreadBlock };
