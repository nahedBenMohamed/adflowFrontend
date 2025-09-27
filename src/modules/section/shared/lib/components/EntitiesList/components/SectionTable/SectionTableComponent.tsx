import {
  BaseTableBodyCell,
  BaseTableBodyRow,
  BaseTableRoot,
  EmptyTableBlock,
  SectionPagination,
  useGrabScroll,
  WholePageLoaderWithLogo,
  type SectionPaginationProps,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import {
  flexRender,
  type ColumnOrderState,
  type ColumnResizeMode,
  type Table,
} from '@tanstack/react-table';
import { useCallback, useEffect, type CSSProperties } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { SectionTableColumnsIds, type SectionTableRow } from '../../../../models';
import { DraggableColumnHeader } from '../DraggableColumnHeader/DraggableColumnHeader';

const SectionTableHeadRow = styled.div<{ $top?: CSSProperties['top'] }>`
  position: sticky;
  top: ${p => p.$top ?? 'var(--header-with-subheader-height)'};

  height: 32px;
  width: 100%;

  display: flex;
  align-items: center;
  gap: 16px;

  z-index: 1;

  margin-bottom: 16px;
  padding: 8px 0 0 12px;
  border-bottom: 1px solid var(--graphite-graphite-80);
  background-color: var(--graphite-graphite-20);

  &::before,
  &::after {
    content: '';

    position: absolute;
    top: 0;

    height: calc(100% + 1px);
    width: 8px;

    background-color: var(--graphite-graphite-20);

    z-index: 1;
  }

  &::before {
    left: -4px;
  }

  &::after {
    right: -16px;

    width: 16px;
  }
`;

const TableBody = styled.div<{ $tracked: boolean }>`
  width: 100%;

  ${p =>
    p.$tracked &&
    css`
      cursor: grab;

      &:active {
        cursor: grabbing;
      }
    `}
`;

export type SaveColumnSizeHandler = ({
  columnId,
  size,
}: {
  columnId: string;
  size: number;
}) => void;

export interface SectionTableStyles {
  loader: {
    extraOffset?: string;
  };
  headRow: {
    top?: CSSProperties['top'];
  };
}

interface Props {
  isLoaded: boolean;
  table: Table<SectionTableRow>;
  columnResizeMode: ColumnResizeMode;
  paginationProps: SectionPaginationProps;
  sectionTableStyles?: SectionTableStyles;
  handleSaveColumnSize: SaveColumnSizeHandler;
  handleSaveColumnOrder: (columnOrder: ColumnOrderState) => void;
}

const TABLE_BODY_ID = 'workspace__SectionTable--TableBody';

const SectionTableComponent = (props: Props) => {
  const {
    isLoaded,
    table,
    columnResizeMode,
    paginationProps: { currentPage, pageCount, handleChange: onPageChange },
    sectionTableStyles,
    handleSaveColumnSize,
    handleSaveColumnOrder,
  } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.section_table',
  });

  const allColumnsHiddenExceptCheckbox = table
    .getAllColumns()
    .filter(c => c.id !== SectionTableColumnsIds.CHECKBOX)
    .every(c => !c.getIsVisible());

  const { rows: tableRows } = table.getRowModel();

  const [isAllowedGrabScrolling, { open: allowGrabScrolling, close: disallowGrabScrolling }] =
    useDisclosure(true);

  useEffect(() => {
    const tableBody = document.getElementById(TABLE_BODY_ID);

    if (!tableBody) return;

    // to prevent text select and grab scroll conflicts
    tableBody.addEventListener('focusin', disallowGrabScrolling);
    tableBody.addEventListener('focusout', allowGrabScrolling);

    return () => {
      tableBody.removeEventListener('focusin', disallowGrabScrolling);
      tableBody.removeEventListener('focusout', allowGrabScrolling);
    };
  }, [isLoaded, allowGrabScrolling, disallowGrabScrolling]);

  const { containerRef: tableRef, tracked, handlers } = useGrabScroll(isAllowedGrabScrolling);

  const handleChangePage = useCallback(
    (page: number) => {
      onPageChange(page);

      table.setPageIndex(page);
    },
    [table, onPageChange]
  );

  return isLoaded ? (
    allColumnsHiddenExceptCheckbox ? (
      <EmptyTableBlock $height="400px">{t('all_columns_hidden')}</EmptyTableBlock>
    ) : (
      <>
        <DndProvider backend={HTML5Backend}>
          <BaseTableRoot ref={tableRef}>
            {table.getHeaderGroups().map(hg => (
              <SectionTableHeadRow $top={sectionTableStyles?.headRow.top} key={hg.id}>
                {hg.headers.map(h => (
                  <DraggableColumnHeader
                    key={h.id}
                    header={h}
                    table={table}
                    columnResizeMode={columnResizeMode}
                    saveColumnSize={handleSaveColumnSize}
                    setColumnOrderToLS={handleSaveColumnOrder}
                  />
                ))}
              </SectionTableHeadRow>
            ))}

            <TableBody {...handlers} $tracked={tracked} id={TABLE_BODY_ID}>
              {tableRows.length > 0 ? (
                tableRows.map(r => (
                  <BaseTableBodyRow $filled $focused={r.original.focused} key={r.id}>
                    {r.getVisibleCells().map(c => (
                      <BaseTableBodyCell key={c.id} $width={c.column.getSize()}>
                        {flexRender(c.column.columnDef.cell, c.getContext())}
                      </BaseTableBodyCell>
                    ))}
                  </BaseTableBodyRow>
                ))
              ) : (
                <EmptyTableBlock $height="400px">{t('empty')}</EmptyTableBlock>
              )}
            </TableBody>
          </BaseTableRoot>
        </DndProvider>

        {pageCount > 1 && (
          <SectionPagination
            pageCount={pageCount}
            currentPage={currentPage}
            handleChange={handleChangePage}
          />
        )}
      </>
    )
  ) : (
    <WholePageLoaderWithLogo
      ensureSubheaderWithOffset
      extraOffset={sectionTableStyles?.loader.extraOffset ?? '16px'}
    />
  );
};

export { SectionTableComponent };
