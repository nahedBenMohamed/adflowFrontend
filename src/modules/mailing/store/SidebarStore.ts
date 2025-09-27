import type { Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { MailboxFolderType, MailingPageSettings } from '../shared';

export class SidebarStore {
  isOpened = true;

  activeSectionType: Nullable<MailboxFolderType> = null;
  activeSectionMailboxId: Nullable<number> = null;
  activeMailboxId: Nullable<number> = null;
  activeMailboxFolderId: Nullable<number> = null;

  settings: MailingPageSettings;

  constructor(settings: MailingPageSettings) {
    makeAutoObservable(this);

    this.isOpened = !settings.sidebarClosed;
    this.settings = settings;
  }

  toggleSidebar = (): void => {
    this.isOpened = !this.isOpened;
    this.settings.sidebarClosed = !this.isOpened;
  };

  setActiveSectionType = (type: Nullable<MailboxFolderType>): void => {
    this.activeSectionType = type;
  };

  setActiveSectionMailboxId = (id: Nullable<number>): void => {
    this.activeSectionMailboxId = id;
  };

  setActiveMailboxId = (id: Nullable<number>): void => {
    this.activeMailboxId = id;
  };

  setActiveMailboxFolderId = (id: Nullable<number>): void => {
    this.activeMailboxFolderId = id;
  };

  clearActiveSectionIds = (): void => {
    this.activeSectionType = null;
    this.activeSectionMailboxId = null;
  };

  clearActiveMailboxIds = (): void => {
    this.activeMailboxId = null;
    this.activeMailboxFolderId = null;
  };
}
