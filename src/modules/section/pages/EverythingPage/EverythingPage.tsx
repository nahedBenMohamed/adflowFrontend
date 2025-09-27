import { SettingsStore, appStore, entityTypeStore, iconStore } from '@/app';
import { authStore } from '@/modules/auth';
import {
  CommonQueryParams,
  DefaultHeader,
  EntitiesAndBoardsPicker,
  EntityApiUtil,
  LeftNavTemplate,
  ModuleNameSkeleton,
  SectionView,
  Subheader,
  TutorialProductType,
  UriCodingUtil,
  WholePageLoaderWithLogo,
  useTitle,
  useTypedParams,
  type DefaultHeaderModuleIconProps,
  type EntityType,
  type Optional,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import {
  ENTITY_CARDS_FILTER_SETTINGS_KEY,
  EntitiesFilterButton,
  EntitiesList,
  SearchBlock,
  SectionHeaderControls,
  SectionHeaderControlsSkeleton,
  SectionSettingsButton,
  type EntityBoardCardFilter,
  type EntityCardsFilterSettings,
} from '../../shared';
import { EntitiesFilterStore, EntitiesListPageStore } from '../../store';
import { CardsTotalBlock } from '../EntitiesPage/components';

const EverythingPage = observer(() => {
  const { entityTypeId: etId } = useTypedParams<{
    entityTypeId: number;
  }>();

  const [pageTitle, setPageTitle] = useState<string>();

  useTitle({ dynamicTitle: pageTitle });

  const { pathname, search } = useLocation();
  const currentPageEncodedUrl = UriCodingUtil.encode(`${pathname}${search}`);

  const entitiesListPageStore = useMemo(() => new EntitiesListPageStore(etId), [etId]);

  const { meta } = entitiesListPageStore;
  const { totalCount } = meta;

  const [searchParams, setSearchParams] = useSearchParams();

  let pageFromParams = searchParams.get(CommonQueryParams.PAGE);
  let currentPage = pageFromParams ? Number(pageFromParams) : 1;

  const [settingsOpened, { toggle: toggleSettings, close: closeSettings }] = useDisclosure(false);

  const entitiesFilterStore = useMemo(() => new EntitiesFilterStore(), []);
  const { filter: entitiesFilter, setFilter } = entitiesFilterStore;

  const { settings } = useMemo(
    () =>
      SettingsStore.getSettingsStore<{
        filters: EntityCardsFilterSettings[];
      }>(ENTITY_CARDS_FILTER_SETTINGS_KEY),
    []
  );
  const savedFilter = useMemo<Optional<EntityBoardCardFilter>>(
    () => settings.filters?.find(f => f.entityTypeId === etId)?.filter,
    [etId, settings]
  );

  useEffect(() => {
    setFilter(savedFilter ?? {});
  }, [savedFilter, setFilter]);

  useEffect(() => {
    when(
      () => appStore.isLoaded,
      () => {
        const et = entityTypeStore.getById(etId);

        setPageTitle(et.section.name);
      }
    );
  }, [etId]);

  useEffect(() => {
    setSearchParams({ [CommonQueryParams.PAGE]: String(currentPage) });
  }, [currentPage, setSearchParams]);

  const loadData = useCallback(
    async (filter: EntityBoardCardFilter): Promise<void> => {
      setFilter(filter);

      if (currentPage !== 1) {
        setSearchParams(prev => {
          prev.set(CommonQueryParams.PAGE, String(1));

          return prev;
        });

        return;
      }

      await entitiesListPageStore.loadData({ filter, page: currentPage });
    },
    [currentPage, entitiesListPageStore, setFilter, setSearchParams]
  );

  const handleChangePage = useCallback(
    (page: number) => {
      setSearchParams(prev => {
        prev.set(CommonQueryParams.PAGE, String(page));

        return prev;
      });
    },
    [setSearchParams]
  );

  const tableSettingsProps = useMemo(
    () => ({
      opened: settingsOpened,
      toggle: toggleSettings,
    }),
    [settingsOpened, toggleSettings]
  );

  const getModuleIconProps = useCallback<(et: EntityType) => DefaultHeaderModuleIconProps>(
    et => ({
      icon: iconStore.getByName(et.section.icon).icon,
      color: iconStore.getEntityColorByEntityCategory(et.entityCategory),
    }),
    []
  );

  if (!appStore.isLoaded)
    return (
      <LeftNavTemplate
        Header={
          <DefaultHeader Controls={<SectionHeaderControlsSkeleton />}>
            <ModuleNameSkeleton />
          </DefaultHeader>
        }
      >
        <WholePageLoaderWithLogo ensureHeader />
      </LeftNavTemplate>
    );

  const et = entityTypeStore.getById(etId);

  return (
    <LeftNavTemplate
      contentMarginTop="var(--header-with-subheader-height)"
      Header={
        <DefaultHeader
          objectId={etId}
          moduleName={et.section.name}
          moduleIconProps={getModuleIconProps(et)}
          productType={TutorialProductType.ENTITY_TYPE}
          Controls={<SectionHeaderControls et={et} />}
          CentralContent={
            <SearchBlock entityTypeId={et.id} searchEntities={EntityApiUtil.searchEntities} />
          }
        >
          {et.section.view === SectionView.BOARD && (
            <EntitiesAndBoardsPicker isOnlyOneEntityType et={et} tab={SectionView.LIST} />
          )}
        </DefaultHeader>
      }
    >
      <Subheader
        Controls={
          <>
            <CardsTotalBlock totalCount={totalCount} etCategory={et.entityCategory} />

            <EntitiesFilterButton
              entityTypeId={etId}
              filter={entitiesFilter}
              boardId={null}
              loadData={loadData}
            />

            <SectionSettingsButton
              entityType={et}
              boardId={null}
              hideSettings={!authStore.isAdmin()}
              currentPageEncodedUrl={currentPageEncodedUrl}
              tableSettingsProps={tableSettingsProps}
            />
          </>
        }
      />

      <EntitiesList
        et={et}
        showBoardName
        totalCount={totalCount}
        filter={entitiesFilter}
        currentPage={currentPage}
        savedFilter={savedFilter}
        settingsOpened={settingsOpened}
        currentPageEncodedUrl={currentPageEncodedUrl}
        entitiesListPageStore={entitiesListPageStore}
        onPageChange={handleChangePage}
        handleCloseSettings={closeSettings}
      />
    </LeftNavTemplate>
  );
});

EverythingPage.displayName = 'EverythingPage';
export { EverythingPage };
