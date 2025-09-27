import { SettingsStore, stageApiUtil } from '@/app';
import { authStore } from '@/modules/auth';
import { useGetFieldSettings } from '@/modules/fields';
import {
  FieldType,
  PermissionObjectType,
  SectionView,
  UtcDate,
  arraysShallowEqual,
  shallowEqual,
  type EntityType,
  type FrontendObject,
  type Nullable,
  type SectionPaginationProps,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnOrderState,
  type ColumnResizeMode,
  type RowSelectionState,
  type VisibilityState,
} from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { EntitiesListSettingsStore } from '../../../../../../store';
import { getDefaultEtColumnSize } from '../../../../helpers';
import {
  useGetSectionTableData,
  useSectionTableColumns,
  type ColumnChangeNameHandler,
  type ColumnChangeStageHandler,
  type ColumnResponsibleChangeHandler,
  type UseSectionTableColumnsProps,
} from '../../../../hooks';
import {
  EntityListSettings,
  SectionTableColumnsIds,
  type EntityBoardCardFilter,
  type EntityListItem,
  type EtTableSettings,
  type EtTablesSettings,
  type SectionTableRow,
} from '../../../../models';
import { BatchActions } from '../BatchActions/BatchActions';
import type { ChangeFieldValueHandler } from '../cells/FieldCell/FieldCell';
import { SectionTableSettingsDrawer } from '../SectionTableSettingsDrawer/SectionTableSettingsDrawer';
import {
  SectionTableComponent,
  type SaveColumnSizeHandler,
  type SectionTableStyles,
} from './SectionTableComponent';

interface Props {
  isLoaded: boolean;
  totalCount: number;
  entityType: EntityType;
  settingsOpened: boolean;
  boardId: Nullable<number>;
  entities: EntityListItem[];
  filter: EntityBoardCardFilter;
  currentPageEncodedUrl: string;
  paginationProps: SectionPaginationProps;
  entitiesListSettingsStore: EntitiesListSettingsStore;
  sectionTableStyles?: SectionTableStyles;
  disableBatchActions?: boolean;
  showBoardName?: boolean;
  reload: () => void;
  forceRerender: () => void;
  closeSettings: () => void;
  handleChangeName: ColumnChangeNameHandler;
  showMutationWarning: Nullable<() => void>;
  handleChangeStage: ColumnChangeStageHandler;
  handleChangeFieldValue: ChangeFieldValueHandler;
  handleChangeResponsible: ColumnResponsibleChangeHandler;
}

const MIN_DEFAULT_PHONE_COLUMN_SIZE = 350;

const { settings: settingsFromLS } =
  SettingsStore.getSettingsStore<EtTablesSettings>('SectionTable');

if (!settingsFromLS.tables) settingsFromLS.tables = [];

const SectionTable = observer((props: Props) => {
  const {
    filter,
    boardId,
    entities,
    isLoaded,
    entityType,
    totalCount,
    settingsOpened,
    paginationProps,
    currentPageEncodedUrl,
    entitiesListSettingsStore,
    sectionTableStyles,
    disableBatchActions,
    showBoardName,
    reload,
    forceRerender,
    closeSettings,
    handleChangeName,
    handleChangeStage,
    showMutationWarning,
    handleChangeFieldValue,
    handleChangeResponsible,
  } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.section_table',
  });

  const { user: currentUser } = authStore;

  const { pageCount } = paginationProps;

  const [areAllEntitiesSelected, { open: selectAllEntities, close: deselectAllEntities }] =
    useDisclosure(false);

  const { data: fieldSettings, isLoading: areFieldSettingsLoading } = useGetFieldSettings(
    entityType.id
  );
  const { data: stages, isLoading: areStagesLoading } = stageApiUtil.useGetStagesByBoardId({
    boardId,
  });

  const tableSettingsFromLS = settingsFromLS.tables.find(
    t => t.entityTypeId === entityType.id && t.boardId === boardId
  );

  const {
    settingsFrontendObject: tableSettingsFromBackend,
    isLoaded: tableSettingsFromBackendLoaded,
    isUpdating: updatingBackendTableSettings,
    upsertSettings: upsertBackendTableSettings,
  } = entitiesListSettingsStore;

  useEffect(() => {
    const gotSettingsFromBackend =
      tableSettingsFromBackendLoaded &&
      tableSettingsFromBackend &&
      tableSettingsFromBackend.value.settings;

    const areSettingsFromBackendNewer = ({
      tableSettingsFromBackend,
      tableSettingsFromLS,
    }: {
      tableSettingsFromBackend: FrontendObject<EntityListSettings>;
      tableSettingsFromLS: EtTableSettings;
    }): boolean => {
      // old accounts might not have updatedAt field or this field can be of an object type, so we need to check for it
      if (typeof tableSettingsFromLS.updatedAt !== 'string') return true;

      return tableSettingsFromBackend.createdAt.greaterThan(
        UtcDate.parseISO(tableSettingsFromLS.updatedAt)
      );
    };

    // if we have settings in storage but we've also got settings from backend, we need to check
    // whether our last local update was before the last update from backend, if not - we need to update our local settings
    if (
      tableSettingsFromLS &&
      gotSettingsFromBackend &&
      areSettingsFromBackendNewer({ tableSettingsFromBackend, tableSettingsFromLS })
    ) {
      // we only want to update column order and visibility, because we're not storing column sizes in backend
      tableSettingsFromLS.columnOrder = tableSettingsFromBackend.value.settings
        .columnOrder as ColumnOrderState;
      tableSettingsFromLS.columnVisibility = tableSettingsFromBackend.value.settings
        .columnVisibility as VisibilityState;
      tableSettingsFromLS.updatedAt = UtcDate.nowISO();

      // and then force table to rerender so it can initialize columns with new settings from ls
      forceRerender();

      return;
    }

    if (!tableSettingsFromLS)
      settingsFromLS.tables.push({
        entityTypeId: entityType.id,
        boardId,
        columnOrder: [],
        columnSizes: {},
        columnVisibility: {},
        updatedAt: null,
      });
  }, [
    boardId,
    entityType.id,
    tableSettingsFromLS,
    tableSettingsFromBackend,
    entitiesListSettingsStore,
    tableSettingsFromBackendLoaded,
    forceRerender,
  ]);

  const handleSaveColumnOrder = useCallback(
    (columnOrder: ColumnOrderState, updateTimestamp = true) => {
      settingsFromLS.tables = settingsFromLS.tables.map(t => {
        if (t.entityTypeId === entityType.id && t.boardId === boardId) {
          t.columnOrder = columnOrder;

          if (updateTimestamp) t.updatedAt = UtcDate.nowISO();
        }

        return t;
      });
    },
    [entityType.id, boardId]
  );

  const handleSaveColumnSize = useCallback<SaveColumnSizeHandler>(
    ({ columnId, size }) => {
      settingsFromLS.tables = settingsFromLS.tables.map(t => {
        if (t.entityTypeId === entityType.id && t.boardId === boardId)
          t.columnSizes = { ...t.columnSizes, [columnId]: size };

        return t;
      });
    },
    [entityType.id, boardId]
  );

  const getInitialColumnOrder = useCallback(
    (columns: ColumnDef<SectionTableRow, unknown>[]): ColumnOrderState => {
      const initialColumnsIds: string[] = columns
        .filter(c => c.id !== 'checkbox')
        .map(c => c.id)
        .filter(Boolean);

      if (!tableSettingsFromLS?.columnOrder.length) return initialColumnsIds;

      if (
        !arraysShallowEqual({
          arr1: tableSettingsFromLS.columnOrder,
          arr2: initialColumnsIds,
        })
      ) {
        const newColumns = initialColumnsIds.filter(
          id => !tableSettingsFromLS.columnOrder.includes(id)
        );

        const deletedColumns = tableSettingsFromLS.columnOrder.filter(
          id => !initialColumnsIds.includes(id)
        );

        const newOrder = [...tableSettingsFromLS.columnOrder, ...newColumns].filter(
          id => !deletedColumns.includes(id)
        );

        handleSaveColumnOrder(newOrder, false);

        return newOrder;
      }

      return tableSettingsFromLS.columnOrder;
    },
    [tableSettingsFromLS, handleSaveColumnOrder]
  );

  const getSavedColumnVisibility = useCallback((): Record<string, boolean> => {
    if (!tableSettingsFromLS) return {};

    return tableSettingsFromLS.columnVisibility;
  }, [tableSettingsFromLS]);

  const entityTypeDefaultColumnProps = useMemo(
    () =>
      ({
        entityTypeId: entityType.id,
        sectionView: entityType.section.view,
        fields: entityType.displayFields.slice(),
      }) satisfies Partial<UseSectionTableColumnsProps>,
    // entityType will always be the same, we do this to avoid unnecessary rerenders, which is crucial here for performance
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const getSavedColumnSize = useCallback(
    (columnId: string): number => {
      const defaultColumnSize = getDefaultEtColumnSize({
        windowWidth: window.innerWidth,
        fieldsCount: entityTypeDefaultColumnProps.fields.length,
        hasStage: entityTypeDefaultColumnProps.sectionView === SectionView.BOARD,
      });

      // columnId for field columns is in `f_{fieldId}` format
      const fieldId = columnId.split('_')[1];

      let isPhoneField = false;

      if (fieldId) {
        const field = entityTypeDefaultColumnProps.fields.find(f => f.id === Number(fieldId));

        if (field) isPhoneField = field.type === FieldType.PHONE;
      }

      if (!tableSettingsFromLS) return defaultColumnSize;

      return (
        tableSettingsFromLS.columnSizes[columnId] ??
        (isPhoneField ? MIN_DEFAULT_PHONE_COLUMN_SIZE : defaultColumnSize)
      );
    },
    [tableSettingsFromLS, entityTypeDefaultColumnProps]
  );

  const canEdit = currentUser?.canEdit(PermissionObjectType.ENTITY_TYPE, entityType.id);

  const defaultColumns = useSectionTableColumns({
    stages,
    pageCount,
    totalCount,
    fieldSettings,
    areStagesLoading,
    disabled: !canEdit,
    disableBatchActions,
    areAllEntitiesSelected,
    areFieldSettingsLoading,
    ...entityTypeDefaultColumnProps,
    showBoardName,
    currentPathname: currentPageEncodedUrl,
    handleChangeName,
    selectAllEntities,
    handleChangeStage,
    getSavedColumnSize,
    deselectAllEntities,
    handleChangeFieldValue,
    handleChangeResponsible,
    t,
  });

  const data = useGetSectionTableData({ entities, fields: entityType.fields, fieldSettings });

  const [columnResizeMode] = useState<ColumnResizeMode>('onChange');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState(() => getSavedColumnVisibility());
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);

  // some columns may be hidden to field settings, they're not initialized unless fieldSettings exists as well
  useLayoutEffect(() => {
    if (fieldSettings)
      setColumnOrder(
        disableBatchActions
          ? getInitialColumnOrder(defaultColumns)
          : [SectionTableColumnsIds.CHECKBOX, ...getInitialColumnOrder(defaultColumns)]
      );
  }, [fieldSettings, disableBatchActions, defaultColumns, getInitialColumnOrder]);

  const table = useReactTable<SectionTableRow>({
    data,
    columnResizeMode,
    pageCount,
    columns: defaultColumns,
    manualPagination: true,
    enableRowSelection: !disableBatchActions,
    state: {
      columnOrder,
      rowSelection,
      columnVisibility,
    },
    getRowId: r => String(r.entityId),
    getCoreRowModel: getCoreRowModel(),
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: disableBatchActions ? undefined : setRowSelection,
  });

  useEffect(() => {
    const saveColumnVisibility = (columnVisibility: Record<string, boolean>) => {
      settingsFromLS.tables = settingsFromLS.tables.map(t => {
        if (
          t.entityTypeId === entityType.id &&
          t.boardId === boardId &&
          !shallowEqual({ obj1: t.columnVisibility, obj2: columnVisibility })
        ) {
          t.columnVisibility = columnVisibility;
          t.updatedAt = UtcDate.nowISO();
        }

        return t;
      });
    };

    saveColumnVisibility(columnVisibility);
  }, [columnVisibility, entityType.id, boardId]);

  const handleUpdateBackendTableSettings = useCallback(async (): Promise<void> => {
    if (!tableSettingsFromLS) return;

    const dto = new EntityListSettings({
      settings: {
        // we only want to sync column order and visibility, not sizes
        columnOrder: tableSettingsFromLS.columnOrder,
        columnVisibility: tableSettingsFromLS.columnVisibility,
      },
    });

    await upsertBackendTableSettings(dto);
  }, [tableSettingsFromLS, upsertBackendTableSettings]);

  const handleClearSelected = useCallback(() => {
    table.resetRowSelection();

    if (areAllEntitiesSelected) deselectAllEntities();
  }, [deselectAllEntities, areAllEntitiesSelected, table]);

  const selectedRows = Object.keys(table.getState().rowSelection).map(Number);
  const areSectionTableAndNecessaryDataLoaded =
    isLoaded && !areFieldSettingsLoading && !areStagesLoading;

  return (
    <>
      <SectionTableSettingsDrawer
        table={table}
        opened={settingsOpened}
        areSettingsUpdating={updatingBackendTableSettings}
        hide={closeSettings}
        updateSettings={handleUpdateBackendTableSettings}
      />

      <SectionTableComponent
        table={table}
        paginationProps={paginationProps}
        columnResizeMode={columnResizeMode}
        sectionTableStyles={sectionTableStyles}
        isLoaded={areSectionTableAndNecessaryDataLoaded}
        handleSaveColumnSize={handleSaveColumnSize}
        handleSaveColumnOrder={handleSaveColumnOrder}
      />

      {!disableBatchActions && (
        <BatchActions
          filter={filter}
          boardId={boardId}
          totalCount={totalCount}
          selectedIds={selectedRows}
          entityTypeId={entityType.id}
          areAllEntitiesSelected={areAllEntitiesSelected}
          linkedEntityTypes={entityType.linkedEntityTypes}
          hideStageAction={entityType.section.view === SectionView.LIST}
          reload={reload}
          handleClearSelected={handleClearSelected}
          showMutationWarning={showMutationWarning}
        />
      )}
    </>
  );
});

SectionTable.displayName = 'SectionTable';
export { SectionTable };
