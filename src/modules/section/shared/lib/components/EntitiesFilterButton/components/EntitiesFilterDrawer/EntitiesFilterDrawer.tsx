import { entityTypeStore, stageApiUtil } from '@/app';
import { authStore } from '@/modules/auth';
import { useGetFieldSettings, type Field, type FieldSettings } from '@/modules/fields';
import {
  CreatedAtDateSelect,
  DatePeriodFilterModel,
  DatePeriodFilterType,
  FieldType,
  FilterDelimiter,
  FilterDrawerTemplate,
  FilterItemWrapper,
  FilterItemsBlock,
  MultiselectModel,
  MyMultiselectColored,
  MySelect,
  MySwitch,
  ParticipantsSelectWithCreateButton,
  SelectModel,
  UtcDate,
  debounce,
  throttle,
  type Nullable,
  type Option,
  type Optional,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useLayoutEffect, useState, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getCreatedAtFilter,
  getEntitiesFinalSortingValue,
  getEntitiesSortingOptions,
  getEntityFieldFilter,
  getFieldFilterFormModel,
} from '../../../../helpers';
import {
  EntityBoardCardFilter,
  EntitySorting,
  EntityTaskFilter,
  type EntitiesFilterDrawerAsyncStateProps,
  type EntityCardsFilterSettings,
  type EntityFieldFilter,
} from '../../../../models';
import {
  FieldsFilterItemSwitch,
  type FieldFilterFormModel,
} from '../FieldsFilterItemSwitch/FieldsFilterItemSwitch';
import { FilterSystemStagesBlock } from '../FilterSystemStagesBlock/FilterSystemStagesBlock';

interface Props {
  boardId: Nullable<number>;
  entityTypeId: number;
  buttonRef: RefObject<HTMLButtonElement | null>;
  opened: boolean;
  settings: {
    filters: EntityCardsFilterSettings[];
  };
  asyncStateProps: EntitiesFilterDrawerAsyncStateProps;
  hide: () => void;
}

const isParticipantsFieldType = (fieldType: FieldType): boolean =>
  fieldType === FieldType.PARTICIPANTS;

interface InitialForm {
  search: string;
  includeStageIds: MultiselectModel<number>;
  excludeStageIds: number[];
  sorting: SelectModel;
  ownerIds: MultiselectModel<number>;
  createdAt: DatePeriodFilterModel;
  justMyCards: boolean;
  saveFilterSettings: boolean;
  fieldFormModels: FieldFilterFormModel[];
  participantsFieldFormModels: FieldFilterFormModel[];
  closedAt: DatePeriodFilterModel;
  tasks: SelectModel;
}

const EntitiesFilterDrawer = observer((props: Props) => {
  const { boardId, entityTypeId, buttonRef, opened, settings, asyncStateProps, hide } = props;

  const { filterClearing, hasError, applyFilter, clearFilter } = asyncStateProps;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.common.filter_button.ui.filter_drawer',
  });

  const [areFieldModelsInitialized, setAreFieldModelsInitialized] = useState(false);

  const savedFilterSettings: Optional<EntityCardsFilterSettings> = settings.filters
    ? settings.filters.find(s => s.entityTypeId === entityTypeId && s.boardId === boardId)
    : undefined;

  const currentUser = authStore.user;
  const fields = entityTypeStore.getById(entityTypeId).fields;

  const { data: fieldSettings, isLoading: areFieldSettingsLoading } =
    useGetFieldSettings(entityTypeId);
  const { data: stages, isLoading: areStagesLoading } = stageApiUtil.useGetStagesByBoardId({
    boardId,
  });

  const form = useLocalObservable<InitialForm>(() => ({
    search: savedFilterSettings?.filter.search ? savedFilterSettings?.filter.search : '',
    includeStageIds: MultiselectModel.create(
      savedFilterSettings?.filter.includeStageIds ? savedFilterSettings?.filter.includeStageIds : []
    ),
    excludeStageIds: savedFilterSettings?.filter.excludeStageIds ?? [],
    sorting: SelectModel.create(savedFilterSettings?.filter.sorting ?? EntitySorting.MANUAL),
    ownerIds: MultiselectModel.create(
      savedFilterSettings?.filter.ownerIds ? savedFilterSettings?.filter.ownerIds : []
    ),
    createdAt: new DatePeriodFilterModel({
      type: savedFilterSettings?.filter.createdAt?.type ?? DatePeriodFilterType.ALL,
      from: UtcDate.parseISONullable(savedFilterSettings?.filter.createdAt?.from),
      to: UtcDate.parseISONullable(savedFilterSettings?.filter.createdAt?.to),
    }),
    justMyCards: Boolean(savedFilterSettings?.justMyCards),
    saveFilterSettings: savedFilterSettings?.saveFilterSettings ?? true,
    fieldFormModels: [],
    participantsFieldFormModels: fields
      .filter(f => isParticipantsFieldType(f.type))
      .map<FieldFilterFormModel>(f => getFieldFilterFormModel(f, savedFilterSettings)),
    closedAt: new DatePeriodFilterModel({
      type: savedFilterSettings?.filter.closedAt?.type ?? DatePeriodFilterType.ALL,
      from: UtcDate.parseISONullable(savedFilterSettings?.filter.closedAt?.from),
      to: UtcDate.parseISONullable(savedFilterSettings?.filter.closedAt?.to),
    }),
    tasks: SelectModel.create(savedFilterSettings?.filter?.tasks ?? EntityTaskFilter.ALL),
  }));

  useLayoutEffect(() => {
    if (areFieldModelsInitialized || areFieldSettingsLoading || areStagesLoading || !currentUser)
      return;

    const shouldShowField = ({
      field,
      fieldSettings,
    }: {
      field: Field;
      fieldSettings: FieldSettings[];
    }) => {
      const currentFieldSettings = fieldSettings.find(fs => fs.fieldId === field.id);

      if (!currentFieldSettings) return false;

      // field hidden for current user
      if (currentFieldSettings.hideField(currentUser.id)) return false;

      // if list view and have no stages, other restrictions do not apply
      if (!stages) return true;

      const stagesIds = stages.map<number>(s => s.id);

      // field hidden on every stage on the current board
      return !stagesIds.every(id => currentFieldSettings.hideFieldOnStage(id));
    };

    form.fieldFormModels = fields
      .filter(
        f =>
          !isParticipantsFieldType(f.type) &&
          shouldShowField({ field: f, fieldSettings: fieldSettings ?? [] })
      )
      .map<FieldFilterFormModel>(f => getFieldFilterFormModel(f, savedFilterSettings));

    form.participantsFieldFormModels = fields
      .filter(
        f =>
          isParticipantsFieldType(f.type) &&
          shouldShowField({ field: f, fieldSettings: fieldSettings ?? [] })
      )
      .map<FieldFilterFormModel>(f => getFieldFilterFormModel(f, savedFilterSettings));

    setAreFieldModelsInitialized(true);
  }, [
    form,
    fields,
    stages,
    currentUser,
    fieldSettings,
    areStagesLoading,
    savedFilterSettings,
    areFieldSettingsLoading,
    areFieldModelsInitialized,
  ]);

  const systemStages = stages?.filter(s => s.isSystem) ?? [];
  const stagesOptions =
    stages?.map<Option<number, { bgColor: string }>>(s => ({
      value: s.id,
      label: s.name,
      extra: {
        bgColor: s.color,
      },
    })) ?? [];

  const handleApply = useCallback(() => {
    const createdAtFilter = getCreatedAtFilter(form.createdAt);
    const closedAtFilter = getCreatedAtFilter(form.closedAt);

    const checkState = (f: FieldFilterFormModel): boolean => f.state !== 'unchanged';

    const entityFieldFilters: EntityFieldFilter[] = [
      ...form.fieldFormModels.filter(checkState).map(f => getEntityFieldFilter(f)),
      ...form.participantsFieldFormModels.filter(checkState).map(f => getEntityFieldFilter(f)),
    ];

    const trimmedSearch = form.search.trim();

    const finalSorting = getEntitiesFinalSortingValue(form.sorting.value);

    const filter = new EntityBoardCardFilter({
      fields: entityFieldFilters.length ? entityFieldFilters : undefined,
      createdAt: createdAtFilter,
      sorting: finalSorting,
      includeStageIds: form.includeStageIds.values.length ? form.includeStageIds.values : undefined,
      excludeStageIds: form.excludeStageIds.length ? form.excludeStageIds : undefined,
      search: trimmedSearch.length ? trimmedSearch : undefined,
      ownerIds: form.ownerIds.values.length ? form.ownerIds.values : undefined,
      closedAt: closedAtFilter,
      tasks: form.tasks.value,
    });

    const savedFilters = settings.filters ?? [];

    if (form.saveFilterSettings) {
      settings.filters = [
        ...savedFilters.filter(f => f.entityTypeId !== entityTypeId || f.boardId !== boardId),
        {
          entityTypeId,
          boardId: boardId,
          filter,
          justMyCards: form.justMyCards,
          saveFilterSettings: form.saveFilterSettings,
        },
      ];
    } else {
      settings.filters = [
        ...savedFilters.filter(f => f.entityTypeId !== entityTypeId || f.boardId !== boardId),
        {
          entityTypeId,
          boardId,
          filter: {},
          justMyCards: false,
          saveFilterSettings: form.saveFilterSettings,
        },
      ];
    }

    applyFilter(filter);
  }, [form, boardId, applyFilter, entityTypeId, settings]);

  const handleClearFilter = useCallback(() => {
    clearFilter();

    form.justMyCards = false;
  }, [clearFilter, form]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedApply = useCallback(debounce(handleApply, 1500), [applyFilter]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledClearFilter = useCallback(throttle(handleClearFilter, 1500), [handleClearFilter]);

  const handleChangeSystemStageIds = (stageId: number) => {
    if (form.excludeStageIds.includes(stageId)) {
      form.excludeStageIds = form.excludeStageIds.filter(id => id !== stageId);
    } else {
      form.excludeStageIds.push(stageId);
    }

    debouncedApply();
  };

  const sortingOptions = getEntitiesSortingOptions(t);

  const tasksOptions = Object.values(EntityTaskFilter).map(etf => ({
    value: etf,
    label: t(`tasks_options.${etf}`),
  }));

  const handleChangeSearch = (value: string) => {
    form.search = value;

    debouncedApply();
  };

  const handleSwitchJustMyCards = () => {
    form.justMyCards = !form.justMyCards;

    if (!currentUser) return;

    if (form.justMyCards) form.ownerIds.setValue([currentUser.id]);

    if (!form.justMyCards && form.ownerIds.values.includes(currentUser.id))
      form.ownerIds.setValue(form.ownerIds.values.filter(id => id !== currentUser.id));

    debouncedApply();
  };

  const handleToggleSaveFilterSettings = () => {
    form.saveFilterSettings = !form.saveFilterSettings;

    debouncedApply();
  };

  const handleChangeOwners = () => {
    form.justMyCards = false;

    debouncedApply();
  };

  return (
    <FilterDrawerTemplate
      opened={opened}
      buttonRef={buttonRef}
      searchProps={{
        value: form.search,
        placeholder: t('placeholders.search_by_card_name'),
        handleChange: handleChangeSearch,
      }}
      controlsProps={{
        hasError,
        filterClearing: filterClearing,
        saveFilterSettings: form.saveFilterSettings,
        onClear: throttledClearFilter,
        handleToggleSaveFilterSettings,
      }}
      hide={hide}
    >
      <FilterItemsBlock>
        <FilterSystemStagesBlock
          systemStages={systemStages}
          excludeStageIds={form.excludeStageIds}
          handleChangeStageIds={handleChangeSystemStageIds}
        />

        <FilterItemWrapper label={t('just_my_cards')}>
          <MySwitch checked={form.justMyCards} onChange={handleSwitchJustMyCards} />
        </FilterItemWrapper>

        <FilterItemWrapper
          label={t('sorting')}
          clearProps={{
            clearVisible: form.sorting.value !== EntitySorting.MANUAL,
            onClear: () => {
              form.sorting.setValue(EntitySorting.MANUAL);

              debouncedApply();
            },
          }}
        >
          <MySelect
            variant="outlined"
            model={form.sorting}
            options={sortingOptions}
            activeBgColor={form.sorting.value !== EntitySorting.MANUAL}
            handleChange={debouncedApply}
          />
        </FilterItemWrapper>

        <FilterItemWrapper
          label={t('creation_date')}
          clearProps={{
            clearVisible: form.createdAt.type !== DatePeriodFilterType.ALL,
            onClear: () => {
              form.createdAt = new DatePeriodFilterModel({
                type: DatePeriodFilterType.ALL,
                from: null,
                to: null,
              });

              debouncedApply();
            },
          }}
        >
          {/* Creation date and closed at filter fields have UTC offset correction, while ordinary DATE fields do not */}
          <CreatedAtDateSelect
            createdAtModel={form.createdAt}
            activeBgColor={form.createdAt.type !== DatePeriodFilterType.ALL}
            handleApply={debouncedApply}
          />
        </FilterItemWrapper>

        <FilterItemWrapper
          label={t('closed_at')}
          clearProps={{
            clearVisible: form.closedAt.type !== DatePeriodFilterType.ALL,
            onClear: () => {
              form.closedAt = new DatePeriodFilterModel({
                type: DatePeriodFilterType.ALL,
                from: null,
                to: null,
              });

              debouncedApply();
            },
          }}
        >
          <CreatedAtDateSelect
            activeBgColor={form.closedAt.type !== DatePeriodFilterType.ALL}
            createdAtModel={form.closedAt}
            handleApply={debouncedApply}
          />
        </FilterItemWrapper>

        <FilterItemWrapper
          label={t('tasks')}
          clearProps={{
            clearVisible: form.tasks.value !== EntityTaskFilter.ALL,
            onClear: () => {
              form.tasks.setValue(EntityTaskFilter.ALL);

              debouncedApply();
            },
          }}
        >
          <MySelect
            variant="outlined"
            model={form.tasks}
            options={tasksOptions}
            activeBgColor={form.tasks.value !== EntityTaskFilter.ALL}
            handleChange={debouncedApply}
          />
        </FilterItemWrapper>

        {boardId && (
          <FilterItemWrapper label={t('stages')} labelPaddingTop="6px" alignItemsCenter={false}>
            <MyMultiselectColored
              paddingTop="4px"
              model={form.includeStageIds}
              options={stagesOptions}
              loading={areStagesLoading}
              handleChange={debouncedApply}
            />
          </FilterItemWrapper>
        )}
      </FilterItemsBlock>

      <FilterDelimiter />

      <FilterItemsBlock>
        <FilterItemWrapper label={t('owners')}>
          <ParticipantsSelectWithCreateButton
            model={form.ownerIds}
            maxAvatarCount={2}
            handleChange={handleChangeOwners}
          />
        </FilterItemWrapper>

        {form.participantsFieldFormModels.map(f => (
          <FieldsFilterItemSwitch
            key={f.field.id}
            fieldFilterFormModel={f}
            handleApply={debouncedApply}
          />
        ))}

        {form.fieldFormModels.map(f => (
          <FieldsFilterItemSwitch
            key={f.field.id}
            fieldFilterFormModel={f}
            handleApply={debouncedApply}
          />
        ))}
      </FilterItemsBlock>
    </FilterDrawerTemplate>
  );
});

EntitiesFilterDrawer.displayName = 'EntitiesFilterDrawer';
export { EntitiesFilterDrawer };
