import { GroupIcon as DepartmentIcon, SubgroupIcon, type Nullable } from '@/shared';
import { memo, type ReactNode } from 'react';
import { TotalIcon, type FormGroupType } from '../../../../shared';

interface Props {
  iconType: FormGroupType;
}

const GroupIcon = memo((props: Props): Nullable<ReactNode> => {
  const { iconType } = props;

  switch (iconType) {
    case 'total':
      return <TotalIcon />;

    case 'department':
      return <DepartmentIcon />;

    case 'subdepartment':
      return <SubgroupIcon />;

    default:
      return null;
  }
});

GroupIcon.displayName = 'GroupIcon';
export { GroupIcon };
