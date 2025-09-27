import { SectionPagination } from '@/shared';
import { memo } from 'react';
import { SHIPMENTS_LIMIT } from '../../../../../../api';

interface Props {
  currentPage: number;
  totalCount: number;
  handleChange: (page: number) => void;
}

const ShipmentsTablePagination = memo((props: Props) => {
  const { currentPage, totalCount, handleChange } = props;

  const pageCount = Math.ceil(totalCount / SHIPMENTS_LIMIT);

  return pageCount > 1 ? (
    <SectionPagination
      currentPage={currentPage}
      pageCount={pageCount}
      handleChange={handleChange}
    />
  ) : null;
});

ShipmentsTablePagination.displayName = 'ShipmentsTablePagination';
export { ShipmentsTablePagination };
