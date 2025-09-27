import { memo, type ReactNode } from 'react';
import {
  AverageAmountIcon,
  AverageTermIcon,
  CompletedTasksIcon,
  ExpiredTasksIcon,
  IncreasedSalesIcon,
  LostStatsIcon,
  NewStatsIcon,
  NoTasksIcon,
  TotalStatsIcon,
  TotalTasksIcon,
  WalletIcon,
  WonStatsIcon,
  type AnalyticsIconsNames,
} from '../../../../../../shared';

interface Props {
  icon: AnalyticsIconsNames;
}

const ResolveIconSwitch = memo((props: Props): ReactNode => {
  const { icon } = props;

  switch (icon) {
    case 'no_tasks':
      return <NoTasksIcon />;

    case 'completed_tasks':
      return <CompletedTasksIcon />;

    case 'total_tasks':
      return <TotalTasksIcon />;

    case 'expired_tasks':
      return <ExpiredTasksIcon />;

    case 'lost_entities':
      return <LostStatsIcon />;

    case 'new_entities':
      return <NewStatsIcon />;

    case 'won_entities':
      return <WonStatsIcon />;

    case 'total_entities':
      return <TotalStatsIcon />;

    case 'total_sales':
      return <WalletIcon />;

    case 'conversion':
      return <IncreasedSalesIcon />;

    case 'average_amount':
      return <AverageAmountIcon />;

    case 'average_term':
      return <AverageTermIcon />;

    default:
      return null;
  }
});

ResolveIconSwitch.displayName = 'ResolveIconSwitch';
export { ResolveIconSwitch };
