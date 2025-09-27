import { routes } from '@/app';
import { authStore } from '@/modules/auth';
import type { ProductsSection } from '@/modules/products';
import {
  calendarViewStore,
  findSavedCalendarFilter,
  TasksFilterType,
  TasksTab,
  TimelineTabIcon,
} from '@/modules/tasks';
import {
  BoardTabIcon,
  ListTabIcon,
  type Nullable,
  OverviewTabIcon,
  PermissionObjectType,
  ProductsTabIcon,
  type TabModel,
  TasksCalendarTabIcon,
  UtcDate,
} from '@/shared';
import { type TFunction } from 'i18next';
import { CardTab } from '../models';

export const getCardPageTabsWithProductsSections = ({
  entityId,
  entityTypeId,
  pathname,
  from,
  productsSections,
  taskBoardId,
  t,
}: {
  entityId: number;
  entityTypeId: number;
  pathname: string;
  productsSections?: ProductsSection[];
  taskBoardId?: Nullable<number>;
  from?: string;
  t: TFunction;
}): TabModel[] => {
  const tabsWithProductsSections: TabModel[] = [];

  const today = UtcDate.startOfCurrentDay();

  const calendarViewFromSettings = findSavedCalendarFilter({
    filterType: TasksFilterType.TASK_BOARD_FILTER,
    boardId: taskBoardId ?? null,
  })?.calendarView;

  if (taskBoardId)
    tabsWithProductsSections.push(
      ...[
        {
          href: routes.projectTasksBoard({
            from,
            entityId,
            entityTypeId,
          }),
          title: t('card_page_header.board'),
          Icon: <BoardTabIcon />,
        },
        {
          href: routes.projectTasksList({
            from,
            entityId,
            entityTypeId,
          }),
          title: t('card_page_header.list'),
          Icon: <ListTabIcon />,
        },
        {
          href: routes.projectTasksCalendar({
            from,
            entityId,
            entityTypeId,
            view: calendarViewFromSettings ?? calendarViewStore.view,
            year: today.year,
            month: today.canonicalMonth,
            day: today.day,
          }),
          title: t('card_page_header.calendar'),
          Icon: <TasksCalendarTabIcon />,
          active: pathname.includes(CardTab.CALENDAR),
        },
        {
          href: routes.projectTasksTimeline({ from, entityId, entityTypeId, view: 'day' }),
          title: t('card_page_header.timeline'),
          Icon: <TimelineTabIcon />,
          active: pathname.includes(TasksTab.TIMELINE),
        },
      ]
    );

  if (productsSections && productsSections.length > 0) {
    productsSections.forEach(ps => {
      const canCreateOrder = authStore.user?.canCreate(PermissionObjectType.PRODUCTS_ORDER, ps.id);

      tabsWithProductsSections.push({
        title: ps.name,
        href: routes.cardProductsOrder({
          from,
          entityId,
          entityTypeId,
          sectionId: ps.id,
          sectionType: ps.type,
        }),
        tooltip: canCreateOrder ? undefined : t('card_page_header.order_denied'),
        disabled: !canCreateOrder,
        Icon: <ProductsTabIcon />,
      });
    });

    tabsWithProductsSections.push({
      href: routes.card({
        from,
        entityId,
        entityTypeId,
        tab: CardTab.ORDERS,
      }),
      title: t('card_page_header.orders'),
      Icon: <ProductsTabIcon />,
    });
  }

  if (tabsWithProductsSections.length > 0)
    tabsWithProductsSections.unshift({
      href: routes.card({ from, entityId, entityTypeId }),
      title: t('card_page_header.overview'),
      Icon: <OverviewTabIcon />,
    });

  return tabsWithProductsSections;
};
