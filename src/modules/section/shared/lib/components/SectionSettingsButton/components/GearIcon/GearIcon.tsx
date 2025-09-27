import { GearIcon as Icon } from '@/shared';
import { memo } from 'react';
import { IconWrapper } from '../IconWrapper/IconWrapper';

const GearIcon = memo(() => {
  return (
    <IconWrapper>
      <Icon />
    </IconWrapper>
  );
});

GearIcon.displayName = 'GearIcon';
export { GearIcon };
