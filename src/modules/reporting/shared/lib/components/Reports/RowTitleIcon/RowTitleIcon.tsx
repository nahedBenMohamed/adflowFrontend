import { GroupIcon, SubgroupIcon } from '@/shared';
import { memo } from 'react';
import type { ReportRowType } from '../../../types';

interface Props {
  rowType: ReportRowType;
}

const RowTitleIcon = memo((props: Props) => {
  const { rowType } = props;

  switch (rowType) {
    case 'group':
      return <GroupIcon />;

    case 'subgroup':
      return <SubgroupIcon />;

    default:
      return null;
  }
});

RowTitleIcon.displayName = 'RowTitleIcon';
export { RowTitleIcon };
