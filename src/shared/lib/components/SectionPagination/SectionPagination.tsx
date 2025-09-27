import { Pagination } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

const PagesWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .mantine-Pagination-dots {
    color: var(--button-text-graphite-secondary-text);
  }

  .mantine-UnstyledButton-root {
    font-family: var(--system-font-families);
    font-size: 14px;
    line-height: 20px;
    color: var(--button-text-graphite-priory-text);
    transition: var(--transition-200);

    background-color: var(--primary-statuses-white-0);
    border: 1px solid var(--graphite-graphite-200);

    svg path {
      fill: var(--button-text-graphite-secondary-text);
    }

    &:hover {
      background-color: var(--graphite-graphite-20);
    }

    &[data-active] {
      border-color: transparent;

      color: var(--primary-statuses-white-0);

      background-color: var(--button-text-green-default);

      &:hover {
        background-color: var(--button-text-green-hover);
      }

      &:active {
        background-color: var(--button-text-green-active);
      }
    }
  }
`;

export interface SectionPaginationProps {
  pageCount: number;
  currentPage: number;
  boundaries?: number;
  handleChange: (page: number) => void;
}

const SectionPagination = observer((props: SectionPaginationProps) => {
  const { pageCount, currentPage, boundaries = 6, handleChange } = props;

  return (
    <Pagination.Root
      total={pageCount}
      value={currentPage}
      boundaries={boundaries}
      onChange={p => handleChange(p)}
    >
      <PagesWrapper>
        <Pagination.First />
        <Pagination.Previous />
        <Pagination.Items />
        <Pagination.Next />
        <Pagination.Last />
      </PagesWrapper>
    </Pagination.Root>
  );
});

SectionPagination.displayName = 'SectionPagination';
export { SectionPagination };
