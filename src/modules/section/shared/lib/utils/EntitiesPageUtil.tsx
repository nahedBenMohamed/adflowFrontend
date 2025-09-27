import { routes } from '@/app';
import { ReportsSection } from '@/modules/reporting';
import { TimelineTabIcon } from '@/modules/tasks';
import {
  BoardTabIcon,
  DashboardTabIcon,
  EntitiesBoardSettingsTab,
  EntityCategory,
  type EntityType,
  ListTabIcon,
  ReportsTabIcon,
  SectionView,
  type TabModel,
} from '@/shared';
import type { TFunction } from 'i18next';
import { AutomationNewTabIcon } from '../../assets';

export class EntitiesPageUtil {
  static companyAndContactEntityTypeCategories(): EntityCategory[] {
    return [EntityCategory.COMPANY, EntityCategory.CONTACT];
  }

  static tabsWithDealCards(): SectionView[] {
    return [SectionView.BOARD, SectionView.LIST, SectionView.TIMELINE];
  }

  static getBoardAndListTabs({
    entityTypeId,
    boardId,
    t,
  }: {
    entityTypeId: number;
    boardId: number;
    t: TFunction;
  }): TabModel[] {
    return [
      {
        title: t('board'),
        Icon: <BoardTabIcon />,
        href: routes.boardSection({ entityTypeId, boardId }),
      },
      {
        title: t('list'),
        Icon: <ListTabIcon />,
        href: routes.listSectionWithBoard({ entityTypeId, boardId }),
      },
    ];
  }

  static getReportsTab = ({
    et,
    boardId,
    canView,
    t,
  }: {
    et: EntityType;
    boardId: number;
    canView: boolean;
    t: TFunction;
  }): TabModel => ({
    title: t('reports'),
    Icon: <ReportsTabIcon />,
    disabled: !canView,
    tooltip: canView ? undefined : t('tooltips.reports_denied'),
    href: routes.boardSectionReports({
      boardId,
      entityTypeId: et.id,
      reportsSection: et.isProjectCategory() ? String(boardId) : ReportsSection.USERS,
    }),
  });

  static getDashboardTab = ({
    et,
    boardId,
    canView,
    t,
  }: {
    et: EntityType;
    boardId: number;
    canView: boolean;
    t: TFunction;
  }): TabModel => ({
    title: t('dashboard'),
    Icon: <DashboardTabIcon />,
    disabled: !canView,
    tooltip: canView ? undefined : t('tooltips.dashboard_denied'),
    href: routes.boardSectionDashboard({
      boardId,
      entityTypeId: et.id,
    }),
  });

  static getTimelineTab = ({
    et,
    boardId,
    active,
    t,
  }: {
    et: EntityType;
    boardId: number;
    active: boolean;
    t: TFunction;
  }): TabModel => ({
    title: t('timeline'),
    Icon: <TimelineTabIcon />,
    href: routes.entitiesSectionTimeline({ entityTypeId: et.id, boardId, view: 'day' }),
    active,
  });

  static getAutomationTabLink = ({
    etId,
    boardId,
    from,
    t,
  }: {
    etId: number;
    boardId: number;
    from: string;
    t: TFunction;
  }): TabModel => {
    return {
      title: t('automation'),
      Icon: <AutomationNewTabIcon />,
      href: routes.entityTypeBoardSettings({
        from,
        boardId,
        entityTypeId: etId,
        tab: EntitiesBoardSettingsTab.AUTOMATION,
      }),
    };
  };
}
