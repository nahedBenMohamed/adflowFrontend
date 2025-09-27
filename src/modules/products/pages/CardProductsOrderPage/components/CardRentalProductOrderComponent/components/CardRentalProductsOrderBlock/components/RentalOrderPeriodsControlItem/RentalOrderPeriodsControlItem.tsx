import {
  DeleteButton,
  MyDatePickerRange,
  generateMyDatePickerRangeTitle,
  type UtcDatesRangeValue,
} from '@/shared';
import { Accordion } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import type { UtcDatesRangeValueModel } from '../../../../../../../../shared';

const Title = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const ControlWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  .workspace__DeleteButton--Root {
    scale: 0;
    opacity: 0;
  }

  &:hover {
    .workspace__DeleteButton--Root {
      scale: 1;
      opacity: 1;
    }
  }
`;

const DatePickerWrapper = styled.div<{ $disabled?: boolean }>`
  height: fit-content;
  width: fit-content;

  overflow: hidden;

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;

      opacity: 0.65;
    `}
`;

interface Props {
  periodModel: UtcDatesRangeValueModel;
  periods: UtcDatesRangeValueModel[];
  disabled?: boolean;
  onDelete: () => void;
}

const RentalOrderPeriodsControlItem = observer((props: Props) => {
  const { periodModel, periods, disabled, onDelete } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix:
      'products.pages.card_products_order_page.ui.card_rental_products_order_component.ui.rental_order_periods_control',
  });

  const [disabledDates, setDisabledDates] = useState<UtcDatesRangeValue[]>([]);

  const { id, range } = periodModel;

  const handleChange = (datesRange: UtcDatesRangeValue) => {
    range[0] = datesRange[0];
    range[1] = datesRange[1];
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setDisabledDates(periods.map<UtcDatesRangeValue>(p => p.range));
  }, [periods]);

  return (
    <Accordion.Item value={id}>
      <ControlWrapper>
        <Accordion.Control>
          <Title>{generateMyDatePickerRangeTitle(range) ?? t('new_period')}</Title>
        </Accordion.Control>

        {!disabled && <DeleteButton size="small" disabled={disabled} onClick={onDelete} />}
      </ControlWrapper>

      <Accordion.Panel key={JSON.stringify(periods.map(p => p.range))}>
        <DatePickerWrapper $disabled={disabled}>
          <MyDatePickerRange
            values={range}
            allowSingleDateInRange
            disabledDatesRanges={disabledDates}
            onChange={handleChange}
          />
        </DatePickerWrapper>
      </Accordion.Panel>
    </Accordion.Item>
  );
});

RentalOrderPeriodsControlItem.displayName = 'RentalOrderPeriodsControlItem';
export { RentalOrderPeriodsControlItem };
