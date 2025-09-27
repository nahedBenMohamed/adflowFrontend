import type { ProductsSection } from '@/modules/products';
import type { Schedule } from '@/modules/scheduler';
import {
  DropdownScrollbarMixin,
  MediaBreakpoints,
  MenuButton,
  useMobile,
  type EntityCategory,
  type Nullable,
} from '@/shared';
import { Tabs } from '@mantine/core';
import {
  memo,
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
  type UIEventHandler,
} from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type {
  ProductsReportType,
  ProjectReportType,
  RenderTabs,
  ReportsSection,
  ScheduleReportType,
} from '../../../../shared';
import {
  ComparisonReportTabList,
  CustomerReportTabList,
  GeneralReportTabList,
  ProductsGeneralReportTabListEntity,
  ProductsGeneralReportTabListSection,
  ProjectReportTabList,
  ScheduleReportTabList,
  TelephonyReportTabList,
} from './components';

const Root = styled.div<{ $sidebarShown: boolean }>`
  position: fixed;
  left: var(--sidebar-width);
  top: var(--header-with-subheader-height);

  z-index: 10;

  display: flex;
  flex-direction: column;

  width: var(--reports-navigation-sidebar-width);
  height: calc(100dvh - var(--header-with-subheader-height));

  display: ${p => (p.$sidebarShown ? 'block' : 'none')};

  background-color: var(--graphite-graphite-20);
  border-right: 1px solid var(--graphite-graphite-80);

  @media ${MediaBreakpoints.SM} {
    width: calc(100vw - var(--sidebar-width));
  }
`;

const TitleWrapper = styled.div<{ $scrolled: boolean }>`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  padding: 0 16px;
  border-bottom: 1px solid transparent;
  transition: var(--transition-200);

  ${p => p.$scrolled && `border-color: var(--graphite-graphite-80)`};
`;

const TITLE_HEIGHT = '54px';

const Title = styled.h2`
  height: ${TITLE_HEIGHT};

  display: flex;
  align-items: center;
  flex-shrink: 0;

  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  color: var(--graphite-graphite-680);
`;

const Wrapper = styled.nav<{ $sidebarShown: boolean }>`
  width: 100%;
  height: calc(100% - ${TITLE_HEIGHT});

  display: flex;
  flex-direction: column;
  gap: 16px;

  opacity: ${p => (p.$sidebarShown ? 1 : 0)};
  pointer-events: ${p => (p.$sidebarShown ? 'auto' : 'none')};
  transform: translateX(${p => (p.$sidebarShown ? 0 : '-100%')});
  transition:
    transform var(--transition-200),
    opacity var(--transition-200) var(--transition-duration);

  ${DropdownScrollbarMixin};

  padding: 2px 16px 16px;
`;

const TabsList = styled(Tabs.List)`
  border: none;

  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 16px;

  &.tabLabel {
    max-width: 100%;
  }
`;

interface Props {
  isProject: boolean;
  sidebarShown: boolean;
  activeTab: ReportsSection | string;
  entityCategory: Nullable<EntityCategory>;
  schedule?: Schedule;
  entityTypeId?: number;
  productsSection?: ProductsSection;
  toggleSidebar: () => void;
  setScheduleReportTabs: Dispatch<SetStateAction<RenderTabs<ScheduleReportType>[]>>;
  setProjectReportTabs: Dispatch<SetStateAction<RenderTabs<ProjectReportType>[]>>;
  setProductsGeneralReportTabs: Dispatch<SetStateAction<RenderTabs<ProductsReportType>[]>>;
}

const ReportsNavigationSidebar = memo((props: Props) => {
  const {
    isProject,
    sidebarShown,
    activeTab,
    entityCategory,
    schedule,
    entityTypeId,
    productsSection,
    toggleSidebar,
    setScheduleReportTabs,
    setProjectReportTabs,
    setProductsGeneralReportTabs,
  } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.reports_page.components.reports_navigation_sidebar',
  });

  const [scrolled, setScrolled] = useState(false);

  const isMobile = useMobile();

  const scrollHandler = useCallback<UIEventHandler<HTMLDivElement>>(
    e => setScrolled(e.currentTarget.scrollTop > 0),
    []
  );

  return (
    <Root $sidebarShown={sidebarShown}>
      <TitleWrapper $scrolled={scrolled}>
        <Title>{t([`title.${entityCategory}`, `title.universal`])}</Title>

        {isMobile && <MenuButton sidebarShown={sidebarShown} onClick={toggleSidebar} />}
      </TitleWrapper>

      <Wrapper $sidebarShown={sidebarShown} onScroll={scrollHandler}>
        <TabsList>
          {entityTypeId ? (
            <>
              {isProject ? (
                <ProjectReportTabList
                  activeTab={activeTab}
                  entityTypeId={entityTypeId}
                  setProjectReportTabs={setProjectReportTabs}
                />
              ) : (
                <>
                  <GeneralReportTabList />

                  <ComparisonReportTabList />

                  <TelephonyReportTabList />

                  <ProductsGeneralReportTabListEntity
                    entityTypeId={entityTypeId}
                    setProductsGeneralReportTabs={setProductsGeneralReportTabs}
                  />
                </>
              )}

              <CustomerReportTabList entityTypeId={entityTypeId} />
            </>
          ) : null}

          {productsSection && (
            <ProductsGeneralReportTabListSection
              productsSection={productsSection}
              setProductsGeneralReportTabs={setProductsGeneralReportTabs}
            />
          )}

          {(schedule || entityTypeId) && (
            <ScheduleReportTabList
              schedule={schedule}
              entityTypeId={entityTypeId}
              setScheduleReportTabs={setScheduleReportTabs}
            />
          )}
        </TabsList>
      </Wrapper>
    </Root>
  );
});

ReportsNavigationSidebar.displayName = 'ReportsNavigationSidebar';
export { ReportsNavigationSidebar };
