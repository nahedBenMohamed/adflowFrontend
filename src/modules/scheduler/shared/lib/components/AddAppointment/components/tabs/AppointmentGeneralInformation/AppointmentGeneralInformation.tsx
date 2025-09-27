import { MediaBreakpoints, useTypedParams, type Nullable, type Optional } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import {
  useGetLastScheduleAppointment,
  useGetScheduleAppointmentCount,
} from '../../../../../../../api';
import { AppointmentOrderStore, type AddAppointmentModalStore } from '../../../../../../../store';
import {
  ScheduleType,
  type GetScheduleAppointmentCountQueryParams,
  type Schedule,
} from '../../../../../models';
import { AppointmentEntityBlock } from '../../AppointmentEntityBlock/AppointmentEntityBlock';
import { AppointmentServicesBlock } from '../../AppointmentServicesBlock/AppointmentServicesBlock';
import { AppointmentVisitParameters } from '../../AppointmentVisitParameters/AppointmentVisitParameters';
import { RepeatingAppointmentsIntervalBlock } from '../../RepeatingAppointmentsIntervalBlock/RepeatingAppointmentsIntervalBlock';
import { RepeatingAppointmentsListBlock } from '../../RepeatingAppointmentsListBlock/RepeatingAppointmentsListBlock';
import { PreviousAppointmentsInfoDisplay } from './components';

const Root = styled.div<{ $editMode: boolean }>`
  display: flex;
  flex-direction: ${p => (p.$editMode ? 'row' : 'column')};
  gap: 16px;

  @media ${MediaBreakpoints.SM} {
    flex-direction: column;
  }
`;

const ContentWrapper = styled.div<{ $editMode: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${p => p.$editMode && `flex: 0.5`};
`;

const DrawerDelimiter = styled.hr`
  margin: 0 16px;
  border-top: 1px solid var(--graphite-graphite-80);
`;

interface Props {
  editMode: boolean;
  schedules: Schedule[];
  appointmentModalStore: AddAppointmentModalStore;
  openedFromCard?: boolean;
  currentAppointmentId?: Nullable<number>;
}

const AppointmentGeneralInformation = observer((props: Props) => {
  const {
    editMode,
    schedules,
    appointmentModalStore,
    openedFromCard = false,
    currentAppointmentId,
  } = props;

  const { entityId } = useTypedParams<{ entityId: Optional<number> }>();

  const { entityForm, appointment, fieldSettingsStore, visitParametersFormData, addEntityForm } =
    appointmentModalStore;

  const selectedSchedule = useMemo<Nullable<Schedule>>(
    () => schedules.find(s => s.id === visitParametersFormData.currentScheduleId) ?? null,
    [schedules, visitParametersFormData.currentScheduleId]
  );

  const previousInfoQueryParams = useMemo<GetScheduleAppointmentCountQueryParams>(
    () => ({
      entityId,
      scheduleId: selectedSchedule?.id,
    }),
    [entityId, selectedSchedule]
  );

  const { data: appointmentCount } = useGetScheduleAppointmentCount({
    enabled: openedFromCard,
    queryParams: previousInfoQueryParams,
  });

  const { data: lastAppointment } = useGetLastScheduleAppointment({
    openedFromCard,
    queryParams: previousInfoQueryParams,
  });

  const productsSectionId = selectedSchedule?.productsSectionId;
  const entityTypeId = selectedSchedule?.entityTypeId;

  const appointmentOrderStore = useMemo<Nullable<AppointmentOrderStore>>(
    () =>
      productsSectionId && entityForm
        ? new AppointmentOrderStore({
            entityId: entityForm.id,
            sectionId: productsSectionId,
            orderId: appointment?.orderId ?? null,
          })
        : null,
    [productsSectionId, entityForm, appointment?.orderId]
  );

  useEffect(() => {
    if (appointmentOrderStore)
      appointmentModalStore.setAppointmentOrderStore(appointmentOrderStore);
  }, [appointmentOrderStore, appointmentModalStore]);

  return (
    <Root $editMode={editMode}>
      {!openedFromCard && entityTypeId && (
        <AppointmentEntityBlock
          editMode={editMode}
          entityForm={entityForm}
          entityTypeId={entityTypeId}
          fieldSettingsStore={fieldSettingsStore}
          responsibleUserId={appointmentModalStore.appointmentEntity?.responsibleUserId}
          addEntityForm={addEntityForm}
        />
      )}

      {openedFromCard && (
        <PreviousAppointmentsInfoDisplay
          count={appointmentCount}
          lastDate={lastAppointment?.endDate}
        />
      )}

      <ContentWrapper $editMode={editMode}>
        <AppointmentVisitParameters
          schedules={schedules}
          entityTypeId={entityTypeId}
          openedFromCard={openedFromCard}
          formData={visitParametersFormData}
          currentAppointmentId={currentAppointmentId}
        />

        {!currentAppointmentId && selectedSchedule && (
          <>
            {selectedSchedule.type === ScheduleType.BOARD ? (
              <RepeatingAppointmentsIntervalBlock
                parameters={visitParametersFormData.repeatingVisitParameters}
                startDate={visitParametersFormData.startDate}
                endDate={visitParametersFormData.endDate}
              />
            ) : (
              <RepeatingAppointmentsListBlock
                parameters={visitParametersFormData.repeatingVisitParameters}
                startDate={visitParametersFormData.startDate}
              />
            )}
          </>
        )}

        {openedFromCard && <DrawerDelimiter />}

        {appointmentOrderStore && (
          <AppointmentServicesBlock
            openedFromCard={openedFromCard}
            orderStore={appointmentOrderStore}
          />
        )}
      </ContentWrapper>
    </Root>
  );
});

AppointmentGeneralInformation.displayName = 'AppointmentGeneralInformation';
export { AppointmentGeneralInformation };
