import {
  DropdownScrollbarMixin,
  ExpandIcon,
  generateMyDatePickerRangeTitle,
  MyDropdown,
  MySelectTitle,
  PlusIconButton,
  useToggleControl,
  type Nullable,
  type UtcDate,
} from '@/shared';
import { Accordion } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { RepeatingAppointmentsParameters } from '../../../../../../models';
import { RepeatingAppointmentsDateItem } from '../RepeatingAppointmentsDateItem/RepeatingAppointmentsDateItem';

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

interface Props {
  datesParameters: RepeatingAppointmentsParameters;
  startDate: UtcDate;
}

const RepeatingAppointmentsDatesSelect = observer((props: Props) => {
  const { datesParameters, startDate } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix:
      'scheduler.pages.scheduler_schedule_view_page.ui.add_appointment_modal.repeating_appointments_block.list',
  });

  const [activeAccordionItem, setActiveAccordionItem] = useState<Nullable<string>>(null);

  const dropdownControl = useToggleControl(false);

  const handleAddNew = useCallback(() => {
    const id = datesParameters.addNewAppointmentDate(null);

    setActiveAccordionItem(id);
  }, [datesParameters]);

  const handleDelete = useCallback(
    (id: string) => {
      datesParameters.removeAppointmentDate(id);
    },
    [datesParameters]
  );

  const title = generateMyDatePickerRangeTitle([
    datesParameters.selectedAppointments?.[0]?.value ?? null,
    datesParameters.selectedAppointments?.at(-1)?.value ?? null,
  ]);

  const handleChangeAccordionItem = useCallback((id: Nullable<string | string[]>) => {
    // we need to check if id is array because of mantine bug with type interference
    // in multiple={false} accordion
    if (Array.isArray(id)) return;

    setActiveAccordionItem(id);
  }, []);

  return (
    <Root>
      <MyDropdown
        withinPortal
        position="top-start"
        Button={
          <MySelectTitle
            variant="outlined"
            active={dropdownControl.active}
            showPlaceholder={!title}
          >
            {title ?? t('placeholders.dates_select')}
          </MySelectTitle>
        }
        opened={dropdownControl.active}
        hide={dropdownControl.close}
        show={dropdownControl.open}
      >
        <Content>
          {datesParameters.selectedAppointments &&
            datesParameters.selectedAppointments.length > 0 && (
              <StyledAccordion
                multiple={false}
                chevronPosition="left"
                value={activeAccordionItem}
                defaultValue={datesParameters.selectedAppointments?.[0]?.id}
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
                {datesParameters.selectedAppointments.map(a => (
                  <RepeatingAppointmentsDateItem
                    key={a.id}
                    appointment={a}
                    startDate={startDate}
                    parameters={datesParameters}
                    onDelete={() => handleDelete(a.id)}
                  />
                ))}
              </StyledAccordion>
            )}

          <PlusIconButtonWrapper>
            <PlusIconButton text={t('add_new_appointment')} onClick={handleAddNew} />
          </PlusIconButtonWrapper>
        </Content>
      </MyDropdown>
    </Root>
  );
});

RepeatingAppointmentsDatesSelect.displayName = 'RepeatingAppointmentsDatesSelect';
export { RepeatingAppointmentsDatesSelect };
