import type { Nullable } from '@/shared';
import { InboxIcon, type MailboxFullInfo } from '../../../../shared';
import { CollapsibleList } from '../CollapsibleList/CollapsibleList';

interface Props {
  sidebarOpened: boolean;
  mailbox: MailboxFullInfo;
  active: boolean;
  activeMailboxFolderId: Nullable<number>;
  loadMailThreadInfo: (folderId: Nullable<number>) => void;
}

const Mailbox = (props: Props) => {
  const { sidebarOpened, mailbox, active, activeMailboxFolderId, loadMailThreadInfo } = props;

  return (
    <CollapsibleList
      active={active}
      Icon={<InboxIcon />}
      items={mailbox.folders}
      leftCaption={mailbox.name}
      rightCounter={mailbox.unread}
      sidebarOpened={sidebarOpened}
      activeNestedElement={activeMailboxFolderId}
      loadMessages={loadMailThreadInfo}
    />
  );
};

export { Mailbox };
