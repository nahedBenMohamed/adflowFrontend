import { FilledArrowDownIcon, MonthUtil } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { Periods } from '../../../../shared';

const Root = styled.div<{ $width: number }>`
  width: ${p => `${p.$width}px`};

  display: flex;
  justify-content: space-between;
  gap: 2px;

  padding: 4px 10px 5px 8px;
  background-color: #f8fafbd7;
  border-radius: var(--border-radius-element);

  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: var(--button-text-graphite-priory-text);

  border: 1px solid var(--graphite-graphite-200);

  &:hover {
    border: 1px solid var(--button-text-graphite-secondary-text);
  }
`;

const NavControlButton = styled.button<{ $left?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;

  transform: rotate(${p => (p.$left ? '90deg' : '270deg')});

  svg path {
    fill: var(--button-text-graphite-primary-text);
  }

  &:hover {
    cursor: pointer;
  }
`;

const QUARTERS = Array.from(Array(4)).map((_, idx) => `quarter${idx + 1}`);

interface Props {
  current: number;
  periodType: Periods;
  currentYear: number;
  width: number;
  onNext: () => void;
  onPrev: () => void;
}

const PeriodControl = (props: Props) => {
  const { width, periodType, current, currentYear, onNext, onPrev } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.goal_settings_page.periods',
  });

  const months = MonthUtil.months;

  return (
    <Root $width={width}>
      <NavControlButton onClick={onPrev} $left>
        <FilledArrowDownIcon />
      </NavControlButton>
      {periodType === 'month' ? t(`months.${months[current]}`) : t(`quarters.${QUARTERS[current]}`)}
      , {currentYear}
      <NavControlButton onClick={onNext}>
        <FilledArrowDownIcon />
      </NavControlButton>
    </Root>
  );
};

export { PeriodControl };
