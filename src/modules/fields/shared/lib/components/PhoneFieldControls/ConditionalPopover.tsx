import { MyPopover, MyTooltip } from '@/shared';
import type { ReactNode } from 'react';

interface Props {
  popoverOpened: boolean;
  tooltipShown: boolean;
  tooltipLabel: string;
  Target: ReactNode;
  PopoverChildren: ReactNode;
  hidePopover: () => void;
}

const ConditionalPopover = (props: Props) => {
  const { popoverOpened, tooltipShown, tooltipLabel, Target, PopoverChildren, hidePopover } = props;

  if (tooltipShown)
    return (
      <MyTooltip disabled={!tooltipShown} label={tooltipLabel}>
        {Target}
      </MyTooltip>
    );

  return (
    <MyPopover
      withinPortal
      position="bottom-start"
      opened={popoverOpened}
      Target={Target}
      hide={hidePopover}
    >
      {PopoverChildren}
    </MyPopover>
  );
};

export { ConditionalPopover };
