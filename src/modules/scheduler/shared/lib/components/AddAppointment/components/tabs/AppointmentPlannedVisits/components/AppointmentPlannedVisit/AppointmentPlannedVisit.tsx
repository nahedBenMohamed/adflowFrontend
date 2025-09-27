import { appStore } from '@/app';
import { ExpandIcon, MiniLoader, PrimaryButton } from '@/shared';
import { Collapse } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, type CSSProperties, type Ref } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AddAppointmentModalStore, AppointmentOrderStore } from '../../../../../../../../../store';
import type {
  GetScheduleAppointmentsQueryParams,
  Schedule,
  ScheduleAppointment,
} from '../../../../../../../models';
import { AppointmentServicesBlock } from '../../../../AppointmentServicesBlock/AppointmentServicesBlock';
import { AppointmentVisitParameters } from '../../../../AppointmentVisitParameters/AppointmentVisitParameters';

const Root = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
`;

const TopBlock = styled.button<{ $opened: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 12px 16px;
  border: 1px solid var(--graphite-graphite-80);
  border-radius: ${p =>
    p.$opened
      ? 'var(--border-radius-block) var(--border-radius-block) 0 0'
      : 'var(--border-radius-block)'};

  &:hover {
    cursor: pointer;
  }
`;

const AppointmentIconWrapper = styled.div<{ $expanded: boolean }>`
  height: 16px;
  width: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  transform: rotate(${p => (p.$expanded ? 180 : 0)}deg);
  transition: var(--transition-200);
`;

interface BottomBlockProps {
  $stateChanged?: boolean;
  $openedFromCard?: boolean;
}

const BottomBlock = styled.div<BottomBlockProps>`
  display: flex;
  flex-direction: column;
  gap: 16px;

  border: 1px solid var(--graphite-graphite-80);
  border-top: none;
  border-radius: 0 0 var(--border-radius-block) var(--border-radius-block);
  padding: ${p => (p.$openedFromCard ? 0 : '16px')};

  ${p => p.$stateChanged && `padding-bottom: 0`};
`;

const BottomBlockContent = styled.div<{ $openedFromCard?: boolean }>`
  display: flex;
  gap: 16px;

  ${p => p.$openedFromCard && `flex-direction: column`};
`;

const SaveButtonWrapper = styled.div<{ $openedFromCard?: boolean }>`
  position: sticky;
  bottom: ${p => (p.$openedFromCard ? -8 : 0)}px;

  width: 100%;

  display: flex;
  align-items: center;
  justify-content: end;

  border-top: 1px solid var(--graphite-graphite-80);
  background-color: var(--primary-statuses-white-0);
  padding: ${p => (p.$openedFromCard ? '12px 16px' : '12px 0')};
  border-radius: ${p =>
    p.$openedFromCard ? '0 0 var(--border-radius-block) var(--border-radius-block)' : 0};
`;

interface Props {
  ref?: Ref<HTMLDivElement>;
  schedule: Schedule;
  appointment: ScheduleAppointment;
  queryParams?: GetScheduleAppointmentsQueryParams;
  openedFromCard?: boolean;
}

const commonBlocksStyles: CSSProperties = {
  flex: 0.5,
};

const AppointmentPlannedVisit = observer((props: Props) => {
  const { ref, schedule, appointment, queryParams, openedFromCard } = props;

  const { productsSectionId } = schedule;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page.ui.add_appointment_modal',
  });

  const [opened, { toggle, close }] = useDisclosure(false);

  const appointmentModalStore = useMemo(
    () =>
      new AddAppointmentModalStore({
        preset: null,
        selectedSchedule: schedule,
        appointmentId: appointment.id,
      }),
    [appointment.id, schedule]
  );

  const { isLoaded, isSaving, entityForm, visitParametersFormData, save, isJsonStateChanged } =
    appointmentModalStore;

  const appointmentOrderStore = useMemo(
    () =>
      productsSectionId && entityForm?.id
        ? new AppointmentOrderStore({
            entityId: entityForm.id,
            orderId: appointment.orderId,
            sectionId: productsSectionId,
          })
        : null,
    [productsSectionId, appointment.orderId, entityForm?.id]
  );

  useEffect(() => {
    when(
      () => appStore.isLoaded,
      () => {
        if (opened) appointmentModalStore.loadData();
      }
    );
  }, [opened, appointmentModalStore]);

  useEffect(() => {
    if (appointmentOrderStore)
      appointmentModalStore.setAppointmentOrderStore(appointmentOrderStore);
  }, [appointmentOrderStore, appointmentModalStore]);

  const handleSave = useCallback(async (): Promise<void> => {
    await save({ queryParams, t });

    close();
  }, [queryParams, close, save, t]);

  const openedButNotLoaded = opened && !isLoaded;
  const stateChanged = isJsonStateChanged() || appointmentOrderStore?.isJsonStateChanged();

  return (
    <Root ref={ref}>
      <TopBlock $opened={opened && isLoaded} onClick={toggle}>
        {t('planned_visit_title', {
          date: appointment.startDate.displayLong(),
          startTime: appointment.startDate.displayTime(),
          endTime: appointment.endDate.displayTime(),
        })}

        <AppointmentIconWrapper $expanded={opened}>
          {openedButNotLoaded ? (
            <MiniLoader size="small" color="var(--button-text-graphite-secondary-text)" />
          ) : (
            <ExpandIcon />
          )}
        </AppointmentIconWrapper>
      </TopBlock>

      {isLoaded && (
        <Collapse in={opened}>
          <BottomBlock $openedFromCard={openedFromCard} $stateChanged={stateChanged}>
            <BottomBlockContent $openedFromCard={openedFromCard}>
              <AppointmentVisitParameters
                openedFromCard
                schedules={[schedule]}
                formData={visitParametersFormData}
                entityTypeId={schedule.entityTypeId}
                currentAppointmentId={appointment.id}
                styles={
                  // if there is no services block we want to align general information block
                  // and make it a little bit bigger
                  openedFromCard
                    ? undefined
                    : productsSectionId && entityForm
                      ? { ...commonBlocksStyles, height: 'fit-content' }
                      : { flex: 0.6, margin: '0 auto' }
                }
              />

              {appointmentOrderStore && (
                <AppointmentServicesBlock
                  openedFromCard={openedFromCard}
                  orderStore={appointmentOrderStore}
                  styles={openedFromCard ? undefined : commonBlocksStyles}
                />
              )}
            </BottomBlockContent>

            {stateChanged && (
              <SaveButtonWrapper $openedFromCard={openedFromCard}>
                <PrimaryButton loading={isSaving} disabled={isSaving} onClick={handleSave}>
                  {t('save_changes')}
                </PrimaryButton>
              </SaveButtonWrapper>
            )}
          </BottomBlock>
        </Collapse>
      )}
    </Root>
  );
});

export { AppointmentPlannedVisit };
