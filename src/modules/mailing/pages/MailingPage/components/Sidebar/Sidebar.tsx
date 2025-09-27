import { HideScrollbarMixin, MediaBreakpoints, type Nullable } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState, type UIEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  DoubleArrowIcon,
  MailboxFolderType,
  getDemoSections,
  type MailboxFullInfo,
  type MailboxSectionInfo,
} from '../../../../shared';
import type { SidebarStore } from '../../../../store';
import { Mailbox } from '../Mailbox/Mailbox';
import { Section } from '../Section/Section';
import { SidebarSkeleton } from '../Skeletons/SidebarSkeleton';
import { SidebarDelimiter } from './components';

const Root = styled.div<{ $opened: boolean }>`
  position: fixed;
  z-index: 1;

  height: calc(100dvh - var(--header-with-subheader-height));
  width: ${p =>
    p.$opened ? 'var(--mailing-sidebar-width-opened)' : 'var(--mailing-sidebar-width-closed)'};

  display: flex;
  flex-direction: column;

  background-color: white;
  border-right: 1px solid var(--graphite-graphite-80);

  transition: var(--transition-200);

  @media ${MediaBreakpoints.SM} {
    position: relative;
  }
`;

const Header = styled.div<{ $hasBorderBottom: boolean }>`
  padding: 12px 16px 10px;
  border-bottom: 1px solid
    ${p => (p.$hasBorderBottom ? 'var(--graphite-graphite-80)' : 'transparent')};
  transition: var(--transition-200);
`;

const Content = styled.div`
  flex-grow: 1;

  overflow: hidden auto;

  ${HideScrollbarMixin}
`;

const DoubleArrowIconWrapper = styled.div<{ $opened: boolean }>`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-left: auto;

  transform: rotate(${p => (p.$opened ? 0 : 180)}deg);
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-green-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-green-active);
    }
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

interface Props {
  loaded: boolean;
  loading: boolean;
  noMailboxes: boolean;
  sidebarStore: SidebarStore;
  mailboxes: MailboxFullInfo[];
  sections: MailboxSectionInfo[];
  loadSectionMailThreadInfos: ({
    type,
    mailboxId,
  }: {
    type: MailboxFolderType;
    mailboxId: Nullable<number>;
  }) => Promise<void>;
  loadMailboxMailThreadInfos: ({
    mailboxId,
    folderId,
  }: {
    mailboxId: number;
    folderId: Nullable<number>;
  }) => Promise<void>;
  setCurrentThreadId: (threadId: Nullable<string>) => void;
}

const Sidebar = observer((props: Props) => {
  const {
    loaded,
    loading,
    noMailboxes,
    sidebarStore,
    mailboxes,
    sections,
    loadSectionMailThreadInfos,
    loadMailboxMailThreadInfos,
    setCurrentThreadId,
  } = props;

  const {
    isOpened,
    activeMailboxId,
    activeSectionType,
    activeMailboxFolderId,
    activeSectionMailboxId,
    toggleSidebar,
    setActiveMailboxId,
    setActiveSectionType,
    clearActiveMailboxIds,
    clearActiveSectionIds,
    setActiveMailboxFolderId,
    setActiveSectionMailboxId,
  } = sidebarStore;

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.pages.mailing_page.components.section',
  });

  const [scrolled, setScrolled] = useState(false);

  const scrollHandler = useCallback<UIEventHandler<HTMLDivElement>>(
    e => setScrolled(e.currentTarget.scrollTop > 8),
    []
  );

  const demoSections = getDemoSections(t);

  useEffect(() => {
    // to get inbox mail thread infos by default
    if (!noMailboxes) {
      loadSectionMailThreadInfos({ type: MailboxFolderType.INBOX, mailboxId: null });

      sidebarStore.activeSectionType = MailboxFolderType.INBOX;
    }
  }, [sidebarStore, noMailboxes, loadSectionMailThreadInfos]);

  const hasSectionsWithMailboxes = sections.some(section => section.mailboxes.length > 0);

  const loadedAndHasNoMailboxes = loaded && noMailboxes;

  const sectionsToDisplay = loadedAndHasNoMailboxes ? demoSections : sections;

  return (
    <Root $opened={isOpened}>
      <Header $hasBorderBottom={scrolled}>
        <DoubleArrowIconWrapper $opened={isOpened} onClick={toggleSidebar}>
          <DoubleArrowIcon />
        </DoubleArrowIconWrapper>
      </Header>

      {loading ? (
        <SidebarSkeleton opened={isOpened} />
      ) : (
        <Content onScroll={scrollHandler}>
          <List>
            {sectionsToDisplay.map(s =>
              s.mailboxes.length > 0 ? (
                <Section
                  key={s.type}
                  section={s}
                  sidebarOpened={isOpened}
                  active={activeSectionType === s.type}
                  activeSectionMailboxId={activeSectionMailboxId}
                  loadMailThreadInfo={mailboxId => {
                    setCurrentThreadId(null);

                    setActiveSectionType(s.type);
                    setActiveSectionMailboxId(mailboxId);
                    clearActiveMailboxIds();

                    if (loadedAndHasNoMailboxes) return;

                    loadSectionMailThreadInfos({ type: s.type, mailboxId: mailboxId });
                  }}
                />
              ) : null
            )}
          </List>

          {hasSectionsWithMailboxes && mailboxes.length > 0 && <SidebarDelimiter />}

          <List>
            {mailboxes.map(m => (
              <Mailbox
                key={m.id}
                mailbox={m}
                sidebarOpened={isOpened}
                active={activeMailboxId === m.id}
                activeMailboxFolderId={activeMailboxFolderId}
                loadMailThreadInfo={folderId => {
                  setCurrentThreadId(null);

                  setActiveMailboxId(m.id);
                  setActiveMailboxFolderId(folderId);
                  clearActiveSectionIds();

                  if (loadedAndHasNoMailboxes) return;

                  loadMailboxMailThreadInfos({ mailboxId: m.id, folderId: folderId });
                }}
              />
            ))}
          </List>
        </Content>
      )}
    </Root>
  );
});

Sidebar.displayName = 'Sidebar';
export { Sidebar };
