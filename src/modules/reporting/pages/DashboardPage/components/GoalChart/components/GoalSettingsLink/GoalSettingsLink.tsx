import { routes } from '@/app';
import { MyHoverCard } from '@/shared';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ChartType, TuneIcon } from '../../../../../../shared';

const IconLink = styled(Link)<{ $right?: boolean }>`
  position: absolute;
  top: 16px;
  right: ${p => (p.$right ? '40px' : '16px')};

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  z-index: 1;

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-graphite-primary-text);
    }
  }
`;

const TextWrapper = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: var(--primary-statuses-white-0);
  text-align: left;

  padding: 4px 8px;
`;

interface Props {
  etId: number;
  chartType: ChartType;
}

const GoalSettingsLink = (props: Props) => {
  const { etId, chartType } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.dashboard_page.sales_goal_chart',
  });

  return (
    <MyHoverCard
      withArrow
      withinPortal
      maxWidth={400}
      closeDelay={0}
      position="bottom"
      backgroundColor="var(--button-text-graphite-primary-text)"
      target={
        <IconLink to={routes.goalSettings(etId)} $right={chartType === ChartType.SALES}>
          <TuneIcon />
        </IconLink>
      }
    >
      <TextWrapper>{t('settings_tip')}</TextWrapper>
    </MyHoverCard>
  );
};

export { GoalSettingsLink };
