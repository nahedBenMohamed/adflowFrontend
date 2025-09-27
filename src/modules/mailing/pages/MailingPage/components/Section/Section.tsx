import type { Nullable } from '@/shared';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { MailboxFolderType, type MailboxSectionInfo } from '../../../../shared';
import { getIconByFolderType } from '../../../../shared/lib/helpers';
import { CollapsibleList } from '../CollapsibleList/CollapsibleList';

interface SectionInfo {
  title: string;
  Icon: ReactElement;
}

interface Props {
  active: boolean;
  sidebarOpened: boolean;
  section: MailboxSectionInfo;
  activeSectionMailboxId: Nullable<number>;
  loadMailThreadInfo: (mailboxId: Nullable<number>) => void;
}

const Section = (props: Props) => {
  const { active, sidebarOpened, section, activeSectionMailboxId, loadMailThreadInfo } = props;

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.pages.mailing_page.components.section',
  });

  const getSectionInfo = (section: MailboxSectionInfo): SectionInfo => {
    const sectionType = section.type;
    const Icon = getIconByFolderType(sectionType);

    switch (sectionType) {
      case MailboxFolderType.INBOX:
        return { title: t('inbox'), Icon };

      case MailboxFolderType.SENT:
        return { title: t('sent'), Icon };

      case MailboxFolderType.JUNK:
        return { title: t('spam'), Icon };

      case MailboxFolderType.TRASH:
        return { title: t('trash'), Icon };

      case MailboxFolderType.DRAFTS:
        return { title: t('draft'), Icon };

      case MailboxFolderType.FLAGGED:
        return { title: t('flagged'), Icon };

      case MailboxFolderType.ARCHIVE:
        return { title: t('archive'), Icon };

      case MailboxFolderType.ALL:
        return { title: t('all'), Icon };
    }
  };

  const { title, Icon } = getSectionInfo(section);

  return (
    <CollapsibleList
      Icon={Icon}
      active={active}
      leftCaption={title}
      items={section.mailboxes}
      rightCounter={section.unread}
      sidebarOpened={sidebarOpened}
      activeNestedElement={activeSectionMailboxId}
      loadMessages={loadMailThreadInfo}
    />
  );
};

export { Section };
