import {
  DropdownScrollbarMixin,
  ExpandIcon,
  Hint,
  MyDropdown,
  MySelectTitle,
  PlusIconButton,
  UuidUtil,
  useToggleControl,
  type Nullable,
} from '@/shared';
import { Accordion } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  generateRentalOrderPeriodsControlTitle,
  type UtcDatesRangeValueModel,
} from '../../../../../../../../shared';
import { RentalOrderPeriodsControlItem } from '../RentalOrderPeriodsControlItem/RentalOrderPeriodsControlItem';

const Root = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
`;

const Content = styled.div`
  width: 300px;
  max-height: 440px;

  display: flex;
  flex-direction: column;
  gap: 8px;

  ${DropdownScrollbarMixin}

  padding: 8px;
`;

const PlusIconButtonWrapper = styled.div`
  padding-left: 4px;
`;

const StyledAccordion = styled(Accordion)`
  .mantine-Accordion-item {
    border-bottom: 1px solid var(--graphite-graphite-80);
  }

  .mantine-Accordion-control {
    display: flex;
    align-items: center;
    gap: 4px;

    padding-left: 0;

    &:hover {
      background: none;
    }
  }

  .mantine-Accordion-label {
    padding: 8px 0;
  }

  .mantine-Accordion-chevron {
    margin: 0;
  }

  .mantine-Accordion-content {
    width: 100%;

    display: flex;
    align-items: center;

    padding: 8px;
  }
`;

const ExpandIconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export interface RentalOrderPeriodsControlProps {
  margin?: string;
  titleWidth?: string;
  disabled?: boolean;
  periods: UtcDatesRangeValueModel[];
}

const RentalOrderPeriodsControl = observer((props: RentalOrderPeriodsControlProps) => {
  const { margin, disabled, titleWidth, periods } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix:
      'products.pages.card_products_order_page.ui.card_rental_products_order_component.ui.rental_order_periods_control',
  });

  const [activeAccordionItem, setActiveAccordionItem] = useState<Nullable<string>>(null);

  const dropdownControl = useToggleControl(false);

  const handleAddNew = () => {
    const id = UuidUtil.generate();

    periods.push({
      id,
      range: [null, null],
    });

    setActiveAccordionItem(id);
  };

  const handleDelete = (id: string) => {
    const idx = periods.findIndex(p => p.id === id);

    if (idx === -1) return;

    periods.splice(idx, 1);
  };

  const title = generateRentalOrderPeriodsControlTitle({
    periods: periods.map(p => p.range),
    t,
  });

  const handleChangeAccordionItem = useCallback((id: Nullable<string | string[]>) => {
    // we need to check if id is array because of mantine bug with type interference
    // in multiple={false} accordion
    if (Array.isArray(id)) return;

    setActiveAccordionItem(id);
  }, []);

  return (
    <Root>
      <MyDropdown
        position="bottom-end"
        Button={
          <MySelectTitle
            margin={margin}
            variant="outlined"
            width={titleWidth}
            active={dropdownControl.active}
            showPlaceholder={!title}
          >
            {title ?? t('placeholders.select_periods')}
          </MySelectTitle>
        }
        opened={dropdownControl.active}
        hide={dropdownControl.close}
        show={dropdownControl.open}
      >
        <Content>
          {periods.length > 0 && (
            <StyledAccordion
              multiple={false}
              chevronPosition="left"
              value={activeAccordionItem}
              defaultValue={periods[0]?.id}
              chevron={
                <ExpandIconWrapper>
                  <ExpandIcon />
                </ExpandIconWrapper>
              }
              styles={{
                chevron: {
                  '&[data-rotate]': {
                    transform: 'rotate(180deg)',
                  },
                },
              }}
              onChange={handleChangeAccordionItem}
            >
              {periods.map(p => (
                <RentalOrderPeriodsControlItem
                  key={p.id}
                  periodModel={p}
                  disabled={disabled}
                  periods={periods.filter(per => per.id !== p.id)}
                  onDelete={() => handleDelete(p.id)}
                />
              ))}
            </StyledAccordion>
          )}

          <PlusIconButtonWrapper>
            <PlusIconButton disabled={disabled} text={t('add_new_period')} onClick={handleAddNew} />
          </PlusIconButtonWrapper>
        </Content>
      </MyDropdown>

      {disabled && <Hint text={t('hint_text')} />}
    </Root>
  );
});

RentalOrderPeriodsControl.displayName = 'RentalOrderPeriodsControl';
export { RentalOrderPeriodsControl };
