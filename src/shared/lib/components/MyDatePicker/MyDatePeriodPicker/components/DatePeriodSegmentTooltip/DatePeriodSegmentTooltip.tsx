import type { ReactNode } from 'react';
import { MyTooltip } from '../../../../MyTooltip/MyTooltip/MyTooltip';

interface Props {
  children: ReactNode;
  label: string;
}

const DatePeriodSegmentTooltip = (props: Props) => {
  const { children, label } = props;

  return (
    <MyTooltip withinPortal position="bottom" label={label} arrowPosition="center" openDelay={500}>
      {children}
    </MyTooltip>
  );
};

export { DatePeriodSegmentTooltip };
