import { EntitySearchFilter } from '@/modules/section';
import {
  EntityApiUtil,
  FilterItemWrapper,
  InputModel,
  MultiselectOptionsList,
  MyInput,
  MyMultiselectColoredTag,
  MyPopover,
  debounce,
  useDropdownWidth,
  type EntityInfo,
  type Option,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Content = styled.div<{ $topPadding?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${p => p.$topPadding && `padding-top: 2px;`};
`;

const EntitiesList = styled.div`
  display: flex;
  flex: auto;
  flex-wrap: wrap;
  gap: 8px;
`;

interface Props {
  entitiesInfosModel: EntityInfo[];
  minifiedView?: boolean;
  handleApply: () => void;
  clearEntitiesInfos: () => void;
}

const TaskEntitiesSearchBlock = observer((props: Props) => {
  const { entitiesInfosModel, minifiedView, handleApply, clearEntitiesInfos } = props;

  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.common.ui.tasks_filter_drawer',
  });

  const [entitiesInfos, setEntitiesInfos] = useState<EntityInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpened, { close: hideDropdown, open: showDropdown }] = useDisclosure(false);
  const searchModel = useLocalObservable(() => InputModel.create());

  const [dropdownWidth, ref] = useDropdownWidth<HTMLInputElement>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearchEntitiesByName = useCallback(
    debounce(async function handleSearchOptions() {
      try {
        if (searchModel.trimmedValue.length < 2) {
          hideDropdown();

          return;
        }

        setLoading(true);

        const dto = new EntitySearchFilter({ entityTypeId: null, name: searchModel.value });

        const result = await EntityApiUtil.searchEntities(dto);

        const entitiesInfos = result.entities;
        setEntitiesInfos(entitiesInfos);

        showDropdown();
      } catch (e) {
        console.error('Error while searching entities by name', e);
      } finally {
        setLoading(false);
      }
    }, 250),
    []
  );

  const handleSelect = (value: string) => {
    const entityInfo = entitiesInfos.find(ei => ei.id === Number(value));

    if (entityInfo) entitiesInfosModel.push(entityInfo);

    handleApply();
  };

  const handleCancel = (value: string | number) => {
    const idx = entitiesInfosModel.findIndex(ei => ei.id === Number(value));

    if (idx !== -1) entitiesInfosModel.splice(idx, 1);

    handleApply();
  };

  const handleFocus = () => {
    if (entitiesInfos.length > 0) showDropdown();
  };

  const options = entitiesInfos.map<Option<string>>(ei => ({
    label: ei.name,
    value: String(ei.id),
  }));

  const placeholder = useMemo(
    () => (minifiedView ? t('linked_cards') : t('placeholders.card_name')),
    [minifiedView, t]
  );

  const InnerContent = (
    <Content $topPadding={!minifiedView}>
      <MyPopover
        withinPortal
        width={dropdownWidth}
        opened={isDropdownOpened}
        position="bottom"
        Target={
          <MyInput
            ref={ref}
            model={searchModel}
            loading={loading}
            variant="outlined"
            placeholder={placeholder}
            onFocus={handleFocus}
            handleChange={debouncedSearchEntitiesByName}
          />
        }
        hide={hideDropdown}
      >
        <MultiselectOptionsList
          hideSearch
          maxHeight="320px"
          options={options}
          variant="outlined"
          highlight={searchModel.value}
          currentValues={entitiesInfosModel.map<string>(ei => String(ei.id))}
          onSelect={handleSelect}
          onCancel={handleCancel}
        />
      </MyPopover>

      {entitiesInfosModel.length > 0 && (
        <EntitiesList>
          {entitiesInfosModel.map(e => (
            <MyMultiselectColoredTag
              key={e.id}
              name={e.name}
              color="var(--primary-statuses-white-0)"
              bgColor="var(--primary-statuses-fuchsia-400)"
              handleDelete={() => handleCancel(e.id)}
            />
          ))}
        </EntitiesList>
      )}
    </Content>
  );

  if (minifiedView) return InnerContent;

  return (
    <FilterItemWrapper
      label={t('linked_cards')}
      labelPaddingTop="6px"
      alignItemsCenter={false}
      clearProps={{
        clearVisible: entitiesInfosModel.length > 0,
        onClear: () => {
          searchModel.value = '';

          clearEntitiesInfos();
          setEntitiesInfos([]);

          handleApply();
        },
      }}
    >
      {InnerContent}
    </FilterItemWrapper>
  );
});

TaskEntitiesSearchBlock.displayName = 'TaskEntitiesSearchBlock';
export { TaskEntitiesSearchBlock };
