import {
  MediaBreakpoints,
  SectionPagination,
  TruncateMixin,
  WholePageLoaderWithLogo,
  type SectionPaginationProps,
} from '@/shared';
import { TableScrollbarMixin } from '@/shared/lib/mixins/TableScrollbarMixin.mixin';
import { flexRender, type Table } from '@tanstack/react-table';
import { useCallback, useEffect, useRef, useState, type UIEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { ReportTableColumnMeta, type ReportSyntheticRow } from '../../../../shared';

const Root = styled.div`
  width: 100%;

  flex: 1;
  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 1px 2px 0px #d0daeb,
    0px 0px 2px 0px #eef4fe;

  ${TableScrollbarMixin};
`;

const Content = styled.table<{ $loading?: boolean }>`
  position: relative;

  min-width: 100%;

  border-collapse: separate;

  ${p =>
    p.$loading &&
    css`
      opacity: 0.65;

      cursor: wait;
    `}
`;

const THead = styled.thead`
  position: sticky;
  top: 0;

  z-index: 2;
`;

interface THProps {
  $secondary: boolean;
  $textUnstyled?: boolean;
}

const TH = styled.th<THProps>`
  ${p =>
    !p.$textUnstyled &&
    css`
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      text-align: left;
      color: var(--button-text-graphite-priory-text);
    `}

  padding: 8px 20px;
  border-bottom: 1px solid var(--graphite-graphite-80);
  border-right: 1px solid var(--graphite-graphite-80);
  background-color: var(--primary-statuses-white-0);

  &:first-child {
    position: sticky;
    left: 0;

    max-width: 400px;

    z-index: 2;

    @media ${MediaBreakpoints.SM} {
      position: relative;
    }
  }

  &:last-child {
    border-right: none;
  }

  ${p =>
    p.$secondary &&
    !p.$textUnstyled &&
    css`
      font-size: 10px;
      font-weight: 500;
      line-height: 14px;
      text-transform: uppercase;
      color: var(--button-text-graphite-primary-text);
    `}

  ${TruncateMixin}
`;

const TBody = styled.tbody<{ $withoutTotal?: boolean }>`
  tr {
    &:not(:last-child):hover {
      td {
        background-color: var(--background-green-20);
      }
    }

    &:last-child {
      td {
        border-bottom: none;
      }
    }

    &:nth-last-child(2) {
      td {
        border-bottom: ${p => !p.$withoutTotal && 'none'};
      }
    }
  }
`;

const TD = styled.td<{ $scrolled: boolean }>`
  position: relative;

  height: 49px;
  min-width: 160px;

  font-size: 14px;
  text-align: left;
  font-weight: 400;
  line-height: 20px;
  font-variant: tabular-nums;
  color: var(--button-text-graphite-priory-text);

  padding: 8px 20px;
  background-color: var(--primary-statuses-white-0);
  border-bottom: 1px solid var(--graphite-graphite-40);
  transition: var(--transition-200);

  &:first-child {
    position: sticky;
    left: 0;

    max-width: 400px;

    z-index: 1;

    ${p => p.$scrolled && `box-shadow: 4px 0 5px -5px #d0daeb`};

    @media ${MediaBreakpoints.SM} {
      position: relative;
    }
  }

  ${TruncateMixin}
`;

const TBodyRow = styled.tr<{ $total?: boolean }>`
  ${p =>
    p.$total &&
    css`
      td {
        position: sticky;
        bottom: 0;

        font-size: 16px;
        font-weight: 700;
        line-height: 24px;
        color: var(--button-text-graphite-priory-text);

        border-top: 1px solid var(--graphite-graphite-80);

        @media ${MediaBreakpoints.SM} {
          position: relative;
        }
      }
    `}
`;

const NoData = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: var(--button-text-graphite-primary-text);

  padding-top: 96px;
`;

const PaginationBlock = styled.div`
  position: sticky;
  left: 0;

  padding: 16px 20px;
  border-top: 1px solid var(--graphite-graphite-80);
`;

interface Props<R> {
  loading: boolean;
  table: Table<R>;
  withoutTotal?: boolean;
  allHeadersSecondary?: boolean;
  paginationProps?: SectionPaginationProps;
  changingPage?: boolean;
}

export const REPORT_TABLE_DATA_CURRENT = 'data-current';

const ReportTable = <R extends ReportSyntheticRow<unknown>>(props: Props<R>) => {
  const {
    loading,
    table,
    withoutTotal,
    allHeadersSecondary = false,
    paginationProps,
    changingPage,
  } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.templates.components.report_table',
  });

  const ref = useRef<HTMLDivElement>(null);

  const [scrolled, setScrolled] = useState(false);

  const scrollHandler = useCallback<UIEventHandler<HTMLDivElement>>(
    e => setScrolled(e.currentTarget.scrollLeft > 0),
    []
  );

  const { rows } = table.getRowModel();

  const handleChangePage = useCallback(
    (page: number) => {
      if (!paginationProps) return;

      paginationProps.handleChange(page);
      ref.current?.scroll({ top: 0, left: 0, behavior: 'smooth' });
    },
    [paginationProps]
  );

  useEffect(() => {
    if (loading) return;

    const currentColumn = document.querySelector<HTMLElement>(
      `[${REPORT_TABLE_DATA_CURRENT}="true"]`
    );

    if (currentColumn)
      currentColumn.scrollIntoView({
        block: 'end',
        inline: 'center',
        behavior: 'instant',
      });
  }, [loading]);

  return (
    <Root ref={ref} onScroll={scrollHandler}>
      {loading ? (
        <WholePageLoaderWithLogo height="100%" />
      ) : (
        <>
          <Content $loading={changingPage}>
            <THead>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id}>
                  {hg.headers.map(h => {
                    const metaCandidate = h.column.columnDef.meta;
                    const meta =
                      metaCandidate instanceof ReportTableColumnMeta ? metaCandidate : null;

                    return (
                      <TH
                        key={h.id}
                        colSpan={h.colSpan}
                        $textUnstyled={meta?.headerTextUnstyled}
                        $secondary={hg.depth === 1 || allHeadersSecondary}
                      >
                        {h.isPlaceholder ? null : (
                          <div>{flexRender(h.column.columnDef.header, h.getContext())}</div>
                        )}
                      </TH>
                    );
                  })}
                </tr>
              ))}
            </THead>

            <TBody $withoutTotal={withoutTotal}>
              {rows.map(r => (
                <TBodyRow $total={r.original.type === 'total'} key={r.id}>
                  {r.getVisibleCells().map(c => (
                    <TD $scrolled={scrolled} key={c.id}>
                      {flexRender(c.column.columnDef.cell, c.getContext())}
                    </TD>
                  ))}
                </TBodyRow>
              ))}
            </TBody>
          </Content>

          {!rows.length && <NoData>{t('empty')}</NoData>}

          {paginationProps && paginationProps.pageCount > 1 && (
            <PaginationBlock>
              <SectionPagination
                boundaries={5}
                pageCount={paginationProps.pageCount}
                currentPage={paginationProps.currentPage}
                handleChange={handleChangePage}
              />
            </PaginationBlock>
          )}
        </>
      )}
    </Root>
  );
};

export { ReportTable };
