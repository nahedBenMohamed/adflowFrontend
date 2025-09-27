import type { RefObject } from 'react';

export interface ReportTabPanelProps {
  sidebarShown: boolean;
  settingsDrawerOpened: boolean;
  settingsButtonRef?: RefObject<HTMLButtonElement | null>;
  toggleSidebar: () => void;
  hideSettingsDrawer: () => void;
}
