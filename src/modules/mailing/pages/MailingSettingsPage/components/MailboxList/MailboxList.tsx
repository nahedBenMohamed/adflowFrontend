import type { Nullable } from '@/shared';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import type {
  UpdateMailboxDto,
  UpdateMailboxSettingsManualDto,
  UpdateMailboxSettingsResult,
} from '../../../../api';
import type { Mailbox } from '../../../../shared';
import { MailboxItem } from '../MailboxItem/MailboxItem';
import { MailboxListSkeleton } from '../MailboxListSkeleton/MailboxListSkeleton';

const Root = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;

  padding-left: 2px;
`;

interface Props {
  loading: boolean;
  mailboxes: Mailbox[];
  handleReconnectGmail: (id: number) => Promise<void>;
  updateMailbox: ({ id, dto }: { id: number; dto: UpdateMailboxDto }) => Promise<void>;
  updateManualSettings?: ({
    id,
    dto,
  }: {
    id: number;
    dto: UpdateMailboxSettingsManualDto;
  }) => Promise<UpdateMailboxSettingsResult>;
}

export const MAILBOX_ID_QUERY_PARAM = 'mailboxId';

const MailboxList = (props: Props) => {
  const { loading, mailboxes, handleReconnectGmail, updateMailbox, updateManualSettings } = props;

  const [searchParams, setSearchParams] = useSearchParams();

  const activeMailboxIdFromParams = searchParams.get(MAILBOX_ID_QUERY_PARAM);
  const activeMailboxId = useMemo<Nullable<number>>(
    () => (activeMailboxIdFromParams ? Number(activeMailboxIdFromParams) : null),
    [activeMailboxIdFromParams]
  );

  const getOpenUpdateMailboxModalHandler = useCallback(
    (mailboxId: number) => () => {
      setSearchParams(prev => {
        prev.set(MAILBOX_ID_QUERY_PARAM, String(mailboxId));

        return prev;
      });
    },
    [setSearchParams]
  );

  const handleCloseUpdateMailboxModal = useCallback(() => {
    setSearchParams(prev => {
      prev.delete(MAILBOX_ID_QUERY_PARAM);

      return prev;
    });
  }, [setSearchParams]);

  return (
    <Root>
      {loading ? (
        <MailboxListSkeleton />
      ) : (
        mailboxes.map(m => (
          <MailboxItem
            key={m.id}
            mailbox={m}
            isUpdateMailboxModalOpened={activeMailboxId === m.id}
            updateMailbox={updateMailbox}
            updateManualSettings={updateManualSettings}
            handleReconnectGmail={handleReconnectGmail}
            handleCloseUpdateMailboxModal={handleCloseUpdateMailboxModal}
            handleOpenUpdateMailboxModal={getOpenUpdateMailboxModalHandler(m.id)}
          />
        ))
      )}
    </Root>
  );
};

export { MailboxList };
