import { authStore } from '@/modules/auth';
import type { Field, FieldSettings } from '@/modules/fields';
import { MyCheckbox, SectionView, type Optional, type Stage } from '@/shared';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { useMemo } from 'react';
import {
  FieldCell,
  NameCell,
  OwnerCell,
  SelectAllCheckbox,
  StageCell,
  type ChangeFieldValueHandler,
} from '../../components';
import { generateFieldColumnId, getFieldName } from '../../helpers';
import {
  SectionTableColumnsIds,
  SectionTableColumnsSizes,
  type SectionTableRow,
} from '../../models';

export type ColumnChangeNameHandler = ({ id, name }: { id: number; name: string }) => Promise<void>;
export type ColumnResponsibleChangeHandler = ({
  id,
  responsibleUserId,
}: {
  id: number;
  responsibleUserId: number;
}) => Promise<void>;
export type ColumnChangeStageHandler = ({
  id,
  stageId,
}: {
  id: number;
  stageId: number;
}) => Promise<boolean>;

export interface UseSectionTableColumnsProps {
  fields: Field[];
  disabled: boolean;
  pageCount: number;
  totalCount: number;
  sectionView: SectionView;
  entityTypeId: number;
  currentPathname: string;
  areAllEntitiesSelected: boolean;
  areStagesLoading: boolean;
  areFieldSettingsLoading: boolean;
  showBoardName?: boolean;
  stages?: Optional<Stage[]>;
  disableBatchActions?: boolean;
  fieldSettings?: Optional<FieldSettings[]>;
  selectAllEntities: () => void;
  deselectAllEntities: () => void;
  getSavedColumnSize: (columnId: SectionTableColumnsIds | string) => number;
  handleChangeName: ColumnChangeNameHandler;
  handleChangeResponsible: ColumnResponsibleChangeHandler;
  handleChangeStage: ColumnChangeStageHandler;
  handleChangeFieldValue: ChangeFieldValueHandler;
  t: TFunction;
}

export const useSectionTableColumns = ({
  fields,
  disabled,
  pageCount,
  totalCount,
  sectionView,
  entityTypeId,
  currentPathname,
  showBoardName,
  areAllEntitiesSelected,
  areStagesLoading,
  areFieldSettingsLoading,
  stages,
  disableBatchActions,
  fieldSettings,
  handleChangeName,
  selectAllEntities,
  handleChangeStage,
  getSavedColumnSize,
  deselectAllEntities,
  handleChangeFieldValue,
  handleChangeResponsible,
  t,
}: UseSectionTableColumnsProps) =>
  useMemo(() => {
    const { user: currentUser } = authStore;

    if (areStagesLoading || areFieldSettingsLoading || !currentUser) return [];

    const columnHelper = createColumnHelper<SectionTableRow>();

    const handleRowSelection = ({
      toggleSelectedHandler,
      resetSelection,
    }: {
      toggleSelectedHandler: () => void;
      resetSelection: () => void;
    }) => {
      if (areAllEntitiesSelected) {
        resetSelection();
        deselectAllEntities();

        return;
      }

      toggleSelectedHandler();
    };

    const columns = [
      columnHelper.display({
        enableResizing: false,
        id: SectionTableColumnsIds.CHECKBOX,
        size: SectionTableColumnsSizes[SectionTableColumnsIds.CHECKBOX],
        minSize: SectionTableColumnsSizes[SectionTableColumnsIds.CHECKBOX],
        maxSize: SectionTableColumnsSizes[SectionTableColumnsIds.CHECKBOX],
        header: ({ table }) => (
          <SelectAllCheckbox
            table={table}
            disabled={disabled}
            totalCount={totalCount}
            withoutModal={pageCount < 2}
            areAllEntitiesSelected={areAllEntitiesSelected}
            selectAllEntities={selectAllEntities}
            deselectAllEntities={deselectAllEntities}
          />
        ),
        cell: ({
          row: { getIsSelected, getIsSomeSelected, toggleSelected },
          table: { resetRowSelection },
        }) => {
          const getRowSelectionHandler = (): (() => void) => {
            return () =>
              handleRowSelection({
                toggleSelectedHandler: toggleSelected,
                resetSelection: resetRowSelection,
              });
          };

          const isChecked = areAllEntitiesSelected || getIsSelected();

          return (
            <MyCheckbox
              disabled={disabled}
              checked={isChecked}
              indeterminate={getIsSomeSelected()}
              onChange={getRowSelectionHandler()}
            />
          );
        },
      }),

      columnHelper.accessor('name', {
        id: SectionTableColumnsIds.NAME,
        size: getSavedColumnSize(SectionTableColumnsIds.NAME),
        minSize: SectionTableColumnsSizes[SectionTableColumnsIds.NAME],
        maxSize: SectionTableColumnsSizes.max,
        header: t('name'),
        cell: info => (
          <NameCell
            cellContext={info}
            entityTypeId={entityTypeId}
            currentPathname={currentPathname}
            changeName={handleChangeName}
          />
        ),
      }),

      columnHelper.accessor('responsibleUserId', {
        id: SectionTableColumnsIds.OWNER,
        header: t('owner'),
        size: getSavedColumnSize(SectionTableColumnsIds.OWNER),
        minSize: SectionTableColumnsSizes.min,
        maxSize: SectionTableColumnsSizes.max,
        cell: info => <OwnerCell cellContext={info} changeResponsible={handleChangeResponsible} />,
      }),
    ] as ColumnDef<SectionTableRow, unknown>[];

    if (sectionView === SectionView.BOARD)
      columns.push(
        columnHelper.accessor('stageId', {
          id: SectionTableColumnsIds.STAGE,
          size: getSavedColumnSize(SectionTableColumnsIds.STAGE),
          minSize: SectionTableColumnsSizes.min,
          maxSize: SectionTableColumnsSizes.max,
          header: t('stage'),
          cell: info => (
            <StageCell
              cellContext={info}
              entityTypeId={entityTypeId}
              showBoardName={showBoardName}
              changeStage={handleChangeStage}
            />
          ),
        }) as ColumnDef<SectionTableRow, unknown>
      );

    const stagesIds = (stages ?? []).map<number>(s => s.id);

    const fieldColumns = fields
      .filter(f => {
        const currentFieldSettings = (fieldSettings ?? []).find(fs => fs.fieldId === f.id);

        if (!currentFieldSettings) return false;

        // field hidden for current user
        if (currentFieldSettings.hideField(currentUser.id)) return false;

        // if list view and have no stages, other restrictions do not apply
        if (!stages) return true;

        // field hidden on every stage on the current board
        if (stagesIds.every(id => currentFieldSettings.hideFieldOnStage(id))) return false;

        return true;
      })
      .map<ColumnDef<SectionTableRow, unknown>>(f => {
        const columnId = generateFieldColumnId(f.id);

        return columnHelper.display({
          id: columnId,
          size: getSavedColumnSize(columnId),
          maxSize: SectionTableColumnsSizes.max,
          minSize: SectionTableColumnsSizes.min,
          header: getFieldName({ field: f, t }),
          cell: info => (
            <FieldCell
              field={f}
              cellContext={info}
              fieldSyntheticId={columnId}
              handleChangeFieldValue={handleChangeFieldValue}
            />
          ),
        });
      });

    columns.push(...fieldColumns);

    if (disableBatchActions) return columns.filter(c => c.id !== SectionTableColumnsIds.CHECKBOX);

    return columns;
  }, [
    fields,
    stages,
    disabled,
    pageCount,
    totalCount,
    sectionView,
    entityTypeId,
    fieldSettings,
    showBoardName,
    currentPathname,
    areStagesLoading,
    disableBatchActions,
    areAllEntitiesSelected,
    areFieldSettingsLoading,
    handleChangeName,
    selectAllEntities,
    handleChangeStage,
    getSavedColumnSize,
    deselectAllEntities,
    handleChangeFieldValue,
    handleChangeResponsible,
    t,
  ]);
