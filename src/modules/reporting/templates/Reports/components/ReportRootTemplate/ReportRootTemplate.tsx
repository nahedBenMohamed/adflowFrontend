import { exportReportToExcel } from '@/modules/reporting/shared/lib/helpers/exportReportToXlsx';
import {
  HideScrollbarMixin,
  MediaBreakpoints,
  MenuButton,
  MiniLoader,
  MyTooltip,
  PrimaryButton,
  TruncateMixin,
  useMobile,
  useTransformScroll,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import type { Table } from '@tanstack/react-table';
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
  type UIEventHandler,
} from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { useWindowSize } from 'usehooks-ts';
import { FiltersMenuIcon, ScrollArrowIcon } from '../../../../shared';
import { ReportSettingsDrawer } from '../ReportSettingsDrawer/ReportSettingsDrawer';

const Root = styled.div`
  width: 100%;
  height: calc(100dvh - var(--header-with-subheader-height) - 16px * 2);

  display: flex;
  flex-direction: column;
  gap: 16px;

  @media ${MediaBreakpoints.SM} {
    width: calc(100vw - var(--sidebar-width) - 32px);
  }
`;

const FiltersBlock = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 16px;

  ${TruncateMixin}
`;

interface FiltersWrapperProps {
  $scrollable: boolean;
  $filtersVisible: boolean;
}

const FiltersWrapper = styled.div<FiltersWrapperProps>`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;

  ${p =>
    p.$filtersVisible
      ? `flex-wrap: wrap`
      : css`
          overflow-x: auto;
          overflow-y: hidden;
        `};

  & > * {
    flex-shrink: 0;
  }

  ${p =>
    p.$scrollable &&
    !p.$filtersVisible &&
    css`
      // fade effect for the right overflow
      mask-image: linear-gradient(to left, transparent, var(--graphite-graphite-840) 24px);
    `}

  ${HideScrollbarMixin};

  @media ${MediaBreakpoints.SM} {
    mask-image: none;
  }
`;

const MenuIconWrapper = styled.button<{ $active: boolean }>`
  width: 28px;
  height: 28px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    background-color: ${p => !p.$active && 'var(--graphite-graphite-40)'};
  }

  ${p => p.$active && `background-color: var(--graphite-graphite-80)`};
`;

const ScrollButton = styled.button<{ $reversed?: boolean }>`
  height: 28px;
  width: 28px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background-color: var(--graphite-graphite-40);
  }

  &:active {
    background-color: var(--graphite-graphite-80);
  }

  ${p => p.$reversed && `transform: rotate(180deg)`};
`;

const ScrollButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;

  @media ${MediaBreakpoints.SM} {
    display: none;
  }
`;

interface Props<T> {
  table: Table<T>;
  Table: ReactNode;
  Filters: ReactNode;
  refetching: boolean;
  sidebarShown: boolean;
  settingsDrawerOpened: boolean;
  settingsButtonRef?: RefObject<HTMLButtonElement | null>;
  ReportSettingsDrawerControls?: ReactNode;
  noExport?: boolean;
  toggleSidebar: () => void;
  hideSettingsDrawer: () => void;
}

type ScrollButtonDirection = 'left' | 'right';

const ReportRootTemplate = <T extends unknown>(props: Props<T>) => {
  const {
    table,
    Table,
    Filters,
    refetching,
    sidebarShown,
    settingsDrawerOpened,
    settingsButtonRef,
    ReportSettingsDrawerControls,
    noExport,
    toggleSidebar,
    hideSettingsDrawer,
  } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.reports_page.components.reports_navigation_sidebar',
  });

  const filtersWrapperRef = useRef<HTMLDivElement>(null);

  const [filtersVisible, { toggle: toggleFilterVisibility }] = useDisclosure(false);

  const [scrollable, setScrollable] = useState(false);
  const [scrolledToTheEnd, setScrolledToTheEnd] = useState(false);

  useTransformScroll(filtersWrapperRef);

  const { width } = useWindowSize();

  const isMobile = useMobile();

  useLayoutEffect(() => {
    if (filtersWrapperRef.current) {
      const { scrollWidth, clientWidth } = filtersWrapperRef.current;

      setScrollable(scrollWidth > clientWidth);
    }
  }, [width]);

  const getScrollButtonHandler = useCallback<(direction: ScrollButtonDirection) => () => void>(
    (direction: ScrollButtonDirection) => () => {
      const filtersWrapperElement = filtersWrapperRef.current;

      if (!filtersWrapperElement) return;

      const scrollStep = 160;

      filtersWrapperElement.scrollBy({
        left: direction === 'left' ? -scrollStep : scrollStep,
        behavior: 'smooth',
      });
    },
    []
  );

  const handleScroll = useCallback<UIEventHandler<HTMLDivElement>>(e => {
    const { scrollWidth, scrollLeft, clientWidth } = e.currentTarget;

    setScrolledToTheEnd(scrollLeft + clientWidth >= scrollWidth);
  }, []);

  return (
    <>
      <ReportSettingsDrawer
        table={table}
        opened={settingsDrawerOpened}
        settingsButtonRef={settingsButtonRef}
        Controls={ReportSettingsDrawerControls}
        hide={hideSettingsDrawer}
      />

      <Root>
        <FiltersBlock>
          <FiltersWrapper
            ref={filtersWrapperRef}
            $filtersVisible={filtersVisible}
            $scrollable={scrollable && !scrolledToTheEnd}
            onScroll={handleScroll}
          >
            <MenuButton active={sidebarShown} sidebarShown={sidebarShown} onClick={toggleSidebar} />

            <MyTooltip
              withinPortal
              label={filtersVisible ? t('fold_filters_menu') : t('unfold_filters_menu')}
            >
              <MenuIconWrapper $active={filtersVisible} onClick={toggleFilterVisibility}>
                <FiltersMenuIcon />
              </MenuIconWrapper>
            </MyTooltip>

            {Filters}

            {!noExport && (
              <PrimaryButton
                variant="outlined"
                height="28px"
                padding="4px 8px"
                onClick={() => exportReportToExcel(table, t)}
              >
                {t('export_xlsx')}
              </PrimaryButton>
            )}

            {filtersVisible && (
              <MiniLoader
                color="var(--primary-statuses-green-520)"
                visibilityHidden={!refetching}
              />
            )}
          </FiltersWrapper>

          {scrollable && !filtersVisible && (
            <ScrollButtonsWrapper>
              <ScrollButton onClick={getScrollButtonHandler('left')}>
                <ScrollArrowIcon />
              </ScrollButton>

              <ScrollButton $reversed onClick={getScrollButtonHandler('right')}>
                <ScrollArrowIcon />
              </ScrollButton>
            </ScrollButtonsWrapper>
          )}

          {!filtersVisible && !isMobile && (
            <MiniLoader color="var(--primary-statuses-green-520)" visibilityHidden={!refetching} />
          )}
        </FiltersBlock>

        {Table}
      </Root>
    </>
  );
};

export { ReportRootTemplate };
