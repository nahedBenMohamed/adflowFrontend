import { SegmentedControl, type SegmentedControlItem } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { DatePeriodType } from '../../../../../models';
import { DatePeriodSegmentTooltip } from '../DatePeriodSegmentTooltip/DatePeriodSegmentTooltip';

const Root = styled(SegmentedControl)`
  width: 100%;
  background-color: transparent;
  border: 1px solid var(--graphite-graphite-200);
  border-radius: var(--border-radius-block);

  overflow: visible;

  .mantine-SegmentedControl-indicator {
    background-color: var(--primary-statuses-green-520);
  }

  .mantine-SegmentedControl-label {
    padding: 0;

    color: var(--primary-statuses-white-0);
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: var(--button-text-graphite-priory-text);
    transition: color var(--transition-200);

    &[data-active] {
      color: var(--primary-statuses-white-0);
    }
  }
`;

const SegmentTitle = styled.div`
  padding: 4px 16px;
`;

interface Props {
  onChange: (value: string) => void;
}

const DatePeriodSegmentedControl = (props: Props) => {
  const { onChange } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.common.filter_button.ui.date_period_picker.date_period_segmented_control',
  });

  const segmentedControlData: SegmentedControlItem[] = [
    {
      value: DatePeriodType.PERIOD,
      label: (
        <DatePeriodSegmentTooltip label={t('period_hint')}>
          <SegmentTitle>{t('period')}</SegmentTitle>
        </DatePeriodSegmentTooltip>
      ),
    },
    {
      value: DatePeriodType.FROM,
      label: (
        <DatePeriodSegmentTooltip label={t('from_hint')}>
          <SegmentTitle>{t('from')}</SegmentTitle>
        </DatePeriodSegmentTooltip>
      ),
    },
    {
      value: DatePeriodType.TO,
      label: (
        <DatePeriodSegmentTooltip label={t('to_hint')}>
          <SegmentTitle>{t('to')}</SegmentTitle>
        </DatePeriodSegmentTooltip>
      ),
    },
  ];

  return <Root onChange={onChange} data={segmentedControlData} />;
};

export { DatePeriodSegmentedControl };
