import { appStore, entityTypeStore, routes } from '@/app';
import {
  InputModel,
  MyPopover,
  NotFoundIcon,
  SearchInput,
  SectionView,
  debounce,
  followElement,
  useDropdownWidth,
  type Nullable,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo, useState, type KeyboardEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  EntitySearchModel,
  type EntitySearchFilter,
  type SearchByValueResult,
} from '../../../../models';
import { EntitySearchList, SEARCH_ITEM_DATA_ACTIVE } from './components';

const Root = styled.div`
  width: 100%;
  max-width: 640px;
`;

const InputWrapper = styled.div`
  width: 100%;
`;

const NotFoundBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  padding: 24px 0 16px;
`;

interface Props {
  entityTypeId: number;
  searchEntities: (dto: EntitySearchFilter) => Promise<SearchByValueResult>;
}

const SearchBox = observer((props: Props) => {
  const { entityTypeId, searchEntities } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.common.search_box',
  });

  const et = entityTypeStore.getById(entityTypeId);

  const searchModel = useLocalObservable(() => InputModel.create());

  const [isDropdownOpened, { close, open }] = useDisclosure(false);

  const [entitiesSearchModels, setEntitiesSearchModels] = useState<EntitySearchModel[]>([]);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const navigate = useNavigate();

  const [containerRef, setContainerRef] = useState<Nullable<HTMLUListElement>>(null);
  const [currentIdx, setCurrentIdx] = useState(-1);

  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLDivElement>>(
    e => {
      switch (e.key) {
        case 'ArrowUp':
          setCurrentIdx(prev => (prev > 0 ? prev - 1 : prev));

          followElement({ element: containerRef, selector: SEARCH_ITEM_DATA_ACTIVE });

          break;

        case 'ArrowDown':
          setCurrentIdx(prev => (prev < entitiesSearchModels.length - 1 ? prev + 1 : prev));

          followElement({ element: containerRef, selector: SEARCH_ITEM_DATA_ACTIVE });

          break;

        case 'Enter':
          const option = entitiesSearchModels[currentIdx];

          if (option)
            navigate(routes.card({ entityTypeId: option.entityTypeId, entityId: option.id }));

          break;

        default:
          return;
      }
    },
    [containerRef, currentIdx, entitiesSearchModels, navigate]
  );

  const searchEntitiesByName = useCallback(
    async (offset: number): Promise<void> => {
      try {
        setIsLoading(true);

        const { entities, meta } = await searchEntities({
          offset,
          entityTypeId,
          searchInLinked: true,
          name: searchModel.trimmedValue,
          fieldValue: searchModel.trimmedValue,
        });

        if (meta.total <= meta.offset) setCanLoadMore(false);

        const results = entities.map<EntitySearchModel>(
          e =>
            new EntitySearchModel({
              id: e.id,
              name: e.name,
              stageId: e.stageId,
              boardId: e.boardId,
              focused: e.focused,
              entityTypeId: e.entityTypeId,
              copiedCount: e.copiedCount,
              copiedFrom: e.copiedFrom,
            })
        );

        if (offset > 0) {
          setEntitiesSearchModels(prev => [...prev, ...results]);
        } else {
          setEntitiesSearchModels(results);

          open();

          if (results.length !== 0) {
            setNotFound(false);
          } else {
            setNotFound(true);
          }
        }
      } catch (e) {
        console.error('Error while searching entities by name', e);
      } finally {
        setIsLoading(false);
      }
    },
    [entityTypeId, searchModel.trimmedValue, searchEntities, open]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearchEntitiesByName = useCallback(debounce(searchEntitiesByName, 750), [
    entityTypeId,
  ]);

  const handleChange = useCallback(
    (value: string) => {
      close();
      setCanLoadMore(true);
      setEntitiesSearchModels([]);

      if (value.trim().length > 2) {
        debouncedSearchEntitiesByName();
      } else {
        close();
      }
    },
    [debouncedSearchEntitiesByName, close]
  );

  const handleLoadMore = useCallback(() => {
    if (canLoadMore) searchEntitiesByName(entitiesSearchModels.length);
  }, [canLoadMore, entitiesSearchModels.length, searchEntitiesByName]);

  const handleClear = useCallback(() => {
    setEntitiesSearchModels([]);

    close();
  }, [close]);

  const handleFocus = useCallback(() => {
    if (searchModel.trimmedValue.length > 2 && entitiesSearchModels.length > 0) open();
  }, [searchModel.trimmedValue, entitiesSearchModels.length, open]);

  const [dropdownWidth, ref] = useDropdownWidth();

  const popoverWidth = useMemo<number>(() => {
    const MAX_WIDTH = 500;

    const calculatedWidth =
      et.section.view === SectionView.LIST ? dropdownWidth * 1.25 : dropdownWidth * 2;

    return calculatedWidth < MAX_WIDTH ? calculatedWidth : MAX_WIDTH;
  }, [dropdownWidth, et.section.view]);

  if (!appStore.isLoaded) return null;

  return (
    <Root onKeyDown={handleKeyDown}>
      <MyPopover
        withinPortal
        position="bottom"
        width={popoverWidth}
        opened={isDropdownOpened}
        Target={
          <InputWrapper ref={ref}>
            <SearchInput
              model={searchModel}
              loading={isLoading}
              onClear={handleClear}
              onFocus={handleFocus}
              onChange={handleChange}
            />
          </InputWrapper>
        }
        hide={close}
      >
        {notFound ? (
          <NotFoundBlock>
            {t('nothing_found')}

            <NotFoundIcon />
          </NotFoundBlock>
        ) : (
          <EntitySearchList
            ref={setContainerRef}
            current={currentIdx}
            isLoading={isLoading}
            canLoadMore={canLoadMore}
            filter={searchModel.value}
            entities={entitiesSearchModels}
            handleLoadMore={handleLoadMore}
          />
        )}
      </MyPopover>
    </Root>
  );
});

SearchBox.displayName = 'SearchBox';
export { SearchBox };
