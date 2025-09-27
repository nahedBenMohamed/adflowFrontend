import { appStore, entityTypeStore, iconStore, routes } from '@/app';
import { authStore } from '@/modules/auth';
import { useGetProductsSections } from '@/modules/products';
import { useGetSchedules } from '@/modules/scheduler';
import { TasksBoardType } from '@/modules/tasks';
import { TelephonyModuleButton } from '@/modules/telephony';
import { Tooltip } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useCallback, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useTypedParams } from '../../hooks';
import {
  EntityCategory,
  IconName,
  PermissionObjectType,
  SectionView,
  type EntityType,
} from '../../models';
import { lastTasksBoardService } from '../../services';
import type { Nullable, Optional } from '../../types';
import { envUtil, SectionLinkUtil, UrlUtil } from '../../utils';
import { BuilderButton } from '../Buttons/BuilderButton/BuilderButton';
import { Scrollbar } from '../Scrollbar/Scrollbar';
import {
  SidebarItem,
  SidebarItemBoard,
  SidebarItemCategory,
  SidebarItemSkeleton,
  SidebarMailItem,
} from './components';

const Root = styled.nav`
  position: fixed;

  height: 100dvh;
  width: var(--sidebar-width);

  display: flex;
  flex-direction: column;

  z-index: 99;

  background-color: var(--graphite-graphite-840);
  border-right: 1px solid var(--graphite-graphite-80);
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  padding: 16px 0;
`;

const calculateSettingsPath = (isAdmin: boolean): string => {
  if (isAdmin) {
    return routes.settingsGeneral();
  } else {
    return routes.settingsMailing();
  }
};

const isKinotehnika = (): boolean => {
  const baseDomain = UrlUtil.getCurrentHostname();

  return baseDomain.includes('kinotehnika');
};

const Sidebar = observer(() => {
  const { t } = useTranslation('common', {
    keyPrefix: 'sidebar',
  });

  const { pathname } = useLocation();
  const { tab } = useTypedParams<{ tab: Optional<string> }>();

  const sectionViewTab: Nullable<SectionView> =
    tab && Object.values(SectionView).includes(tab as SectionView) ? (tab as SectionView) : null;

  const { data: schedules } = useGetSchedules();
  const { data: productsSections } = useGetProductsSections();

  const isAdmin = authStore.isAdmin();
  const { user: currentUser } = authStore;

  const getSidebarItem = useCallback(
    (et: EntityType): ReactNode => {
      const etId = et.id;
      const section = et.section;
      const activeColor = iconStore.getEntityColorByEntityCategory(et.entityCategory);

      if (section.view === SectionView.LIST)
        return (
          <SidebarItem
            key={etId}
            activeColor={activeColor}
            path={SectionLinkUtil.getSectionLink(etId)}
            tooltip={section.name}
            active={
              pathname.includes(routes.listSectionBase(etId)) ||
              pathname.includes(routes.cardBase(etId))
            }
          >
            {iconStore.getByName(section.icon).icon}
          </SidebarItem>
        );

      return (
        <SidebarItemBoard
          key={etId}
          activeColor={activeColor}
          title={section.name}
          entityTypeId={etId}
          active={
            pathname.includes(routes.listSectionBase(etId)) ||
            pathname.includes(routes.goalSettings(etId)) ||
            pathname.includes(routes.boardSectionBase(etId)) ||
            pathname.includes(routes.cardBase(etId))
          }
          tabFromParams={
            tab && Object.values(SectionView).includes(tab as SectionView)
              ? (tab as SectionView)
              : undefined
          }
        >
          {iconStore.getByName(section.icon).icon}
        </SidebarItemBoard>
      );
    },
    [pathname, tab]
  );

  const getMenuSections = useCallback((): ReactNode => {
    const menuSections: ReactNode[] = [];
    let entityTypes = entityTypeStore.getAvailableEntityTypes();

    const dealEntityType = entityTypes.find(et => et.entityCategory === EntityCategory.DEAL);

    if (dealEntityType) {
      entityTypes = entityTypes.filter(et => et.id !== dealEntityType.id);
      menuSections.push(getSidebarItem(dealEntityType));
    }

    const contactAndCompanySections: ReactNode[] = [];
    // contact category
    const contactEntityTypes = entityTypes.filter(
      et => et.entityCategory === EntityCategory.CONTACT
    );
    if (contactEntityTypes.length > 0)
      contactAndCompanySections.push(
        <SidebarItemCategory
          key="contacts"
          title={t('contacts')}
          currentTab={sectionViewTab}
          entityTypes={contactEntityTypes}
          activeColor={iconStore.getEntityColorByEntityCategory(EntityCategory.CONTACT)}
          active={contactEntityTypes.some(et => pathname.includes(routes.sectionBase(et.id)))}
        >
          {iconStore.getDefaultIconByEntityCategory(EntityCategory.CONTACT).icon}
        </SidebarItemCategory>
      );

    entityTypes = entityTypes.filter(et => et.entityCategory !== EntityCategory.CONTACT);

    // company category
    const companyEntityTypes = entityTypes.filter(
      et => et.entityCategory === EntityCategory.COMPANY
    );
    if (companyEntityTypes.length > 0) {
      contactAndCompanySections.push(
        <SidebarItemCategory
          key="companies"
          title={t('companies')}
          currentTab={sectionViewTab}
          entityTypes={companyEntityTypes}
          active={companyEntityTypes.some(et => pathname.includes(routes.sectionBase(et.id)))}
          activeColor={iconStore.getEntityColorByEntityCategory(EntityCategory.COMPANY)}
        >
          {iconStore.getDefaultIconByEntityCategory(EntityCategory.COMPANY).icon}
        </SidebarItemCategory>
      );
    }

    entityTypes = entityTypes.filter(et => et.entityCategory !== EntityCategory.COMPANY);

    const isKinotehnikaAccount = isKinotehnika();
    if (!isKinotehnikaAccount) {
      menuSections.push(contactAndCompanySections);
    }

    for (const et of entityTypes) {
      menuSections.push(getSidebarItem(et));
    }

    if (isKinotehnikaAccount) menuSections.push(contactAndCompanySections);

    return menuSections;
  }, [pathname, sectionViewTab, getSidebarItem, t]);

  const getLastTasksBoardLink = useCallback((): string => {
    const boardParams = lastTasksBoardService.getLastTasksBoardParams();

    if (!boardParams) return routes.timeBoard();

    if (boardParams.tasksType === TasksBoardType.ACTIVITIES) return routes.activities;

    if (boardParams.boardId) {
      return routes.tasksBoard(boardParams.boardId);
    }

    return routes.timeBoard();
  }, []);

  return (
    <Tooltip.Group>
      <Root>
        <BuilderButton />

        <Scrollbar rightIndent={false} dark>
          <Wrapper>
            <SidebarItem
              path={getLastTasksBoardLink()}
              tooltip={t('tasks_and_activities')}
              active={
                (pathname.includes('/tasks') || pathname.includes('/activities')) &&
                !pathname.includes('/card')
              }
              activeColor={iconStore.systemModuleColor}
            >
              {iconStore.getByName(IconName.TICK_1).icon}
            </SidebarItem>

            {appStore.isLoaded ? (
              <>
                {getMenuSections()}

                {productsSections &&
                  productsSections.map(ps => {
                    if (!currentUser) return null;

                    const { id: sectionId, type: sectionType } = ps;

                    const canViewPs = currentUser.canView(PermissionObjectType.PRODUCTS, sectionId);

                    return (
                      canViewPs && (
                        <SidebarItem
                          key={ps.id}
                          tooltip={ps.name}
                          activeColor={iconStore.productsColor}
                          path={routes.products({ sectionId, sectionType })}
                          active={pathname.includes(
                            routes.productsBase({
                              sectionId,
                              sectionType,
                            })
                          )}
                        >
                          {iconStore.getByName(ps.icon).icon}
                        </SidebarItem>
                      )
                    );
                  })}

                {schedules &&
                  schedules.length > 0 &&
                  schedules.map(s => (
                    <SidebarItem
                      key={s.id}
                      tooltip={s.name}
                      activeColor={iconStore.schedulerColor}
                      active={pathname.includes(
                        routes.schedulerBase({ scheduleId: s.id, scheduleType: s.type })
                      )}
                      path={routes.scheduler({
                        scheduleId: s.id,
                        scheduleType: s.type,
                        tab: SectionView.OVERVIEW,
                      })}
                    >
                      {iconStore.getByName(s.icon).icon}
                    </SidebarItem>
                  ))}
              </>
            ) : (
              Array.from({ length: 5 }, (_, idx) => (
                <SidebarItemSkeleton key={idx} delay={idx * 500} />
              ))
            )}

            <SidebarMailItem />

            <SidebarItem
              tooltip={t('settings')}
              path={calculateSettingsPath(isAdmin)}
              activeColor={iconStore.systemModuleColor}
              active={pathname.includes(routes.settingsBase)}
            >
              {iconStore.getByName(IconName.SETTINGS_2).icon}
            </SidebarItem>
          </Wrapper>
        </Scrollbar>

        {envUtil.voximplantShowTelephony && <TelephonyModuleButton />}
      </Root>
    </Tooltip.Group>
  );
});

Sidebar.displayName = 'Sidebar';
export { Sidebar };
