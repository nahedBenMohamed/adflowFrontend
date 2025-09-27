import { generalSettingsStore } from '@/app';
import type { EntityForm } from '@/modules/section';
import { Currency, HideScrollbarMixin, MediaBreakpoints, UtcDate, type Nullable } from '@/shared';
import { Tabs } from '@mantine/core';
import { useMemo, type ReactNode } from 'react';
import styled, { css } from 'styled-components';
import type { AddAppointmentModalStore } from '../../../../store';
import {
  ScheduleAppointmentModalTabs,
  type GetScheduleAppointmentsQueryParams,
  type Schedule,
} from '../../models';
import {
  AppointmentGeneralInformation,
  AppointmentPlannedVisits,
  AppointmentVisitsHistoryTable,
  AppointmentsTabsListHeader,
} from './components';

const Root = styled(Tabs)<{ $smallerGap: boolean }>`
  position: relative;

  display: flex;
  flex-direction: column;

  gap: ${p => (p.$smallerGap ? 8 : 16)}px;
`;

interface ContentProps {
  $editMode: boolean;
  $openedFromCard?: boolean;
  $noSidesPadding?: boolean;
}

const Content = styled.div<ContentProps>`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: ${p => (p.$openedFromCard ? 0 : p.$editMode ? '0 32px 16px' : '16px 32px')};

  @media ${MediaBreakpoints.SM} {
    padding: ${p => (p.$openedFromCard ? 0 : p.$editMode ? '0 16px 8px' : '8px 16px')};

    overflow-x: auto;

    ${HideScrollbarMixin}
  }

  ${p =>
    p.$noSidesPadding &&
    css`
      padding-left: 0;
      padding-right: 0;
    `}
`;

export interface AddAppointmentControlModalProps {
  editMode: boolean;
  entityForm: Nullable<EntityForm>;
  queryParams?: GetScheduleAppointmentsQueryParams;
}

interface Props {
  schedules: Schedule[];
  showTabsList: boolean;
  WarningModal: ReactNode;
  activeTab: ScheduleAppointmentModalTabs;
  appointmentModalStore: AddAppointmentModalStore;
  entityId?: number;
  modalProps?: AddAppointmentControlModalProps;
  openedFromCard?: boolean;
  currentAppointmentId?: Nullable<number>;
  handleChangeTab: (tab: Nullable<string>) => void;
}

const AddAppointmentControl = (props: Props) => {
  const {
    schedules,
    showTabsList,
    WarningModal,
    activeTab,
    appointmentModalStore,
    entityId,
    openedFromCard,
    currentAppointmentId,
    modalProps,
    handleChangeTab,
  } = props;

  const dateNow = useMemo<string>(() => UtcDate.nowISO(), []);

  const {
    visitParametersFormData: { scheduleId },
  } = appointmentModalStore;

  const selectedSchedule = useMemo<Nullable<Schedule>>(
    () => schedules.find(s => s.id === scheduleId.value) ?? null,
    [schedules, scheduleId.value]
  );

  if (!selectedSchedule)
    throw new Error('Failed to identify schedule, can not create appointment.');

  return (
    <>
      <Root
        w="100%"
        value={activeTab}
        keepMounted={false}
        $smallerGap={activeTab === ScheduleAppointmentModalTabs.VISITS_HISTORY}
        onChange={handleChangeTab}
      >
        {showTabsList && (
          <AppointmentsTabsListHeader
            dateNow={dateNow}
            entityId={entityId}
            activeTab={activeTab}
            openedFromCard={openedFromCard}
            selectedSchedule={selectedSchedule}
            modalEntityForm={modalProps?.entityForm}
            showPlannedAndHistoryTabs={modalProps ? modalProps.editMode : true}
            performerObjectId={
              appointmentModalStore.visitParametersFormData.performerObjectId.value
            }
          />
        )}

        <Content
          $openedFromCard={openedFromCard}
          $editMode={modalProps ? modalProps.editMode : false}
          $noSidesPadding={activeTab === ScheduleAppointmentModalTabs.VISITS_HISTORY}
        >
          <Tabs.Panel value={ScheduleAppointmentModalTabs.GENERAL_INFORMATION}>
            <AppointmentGeneralInformation
              schedules={schedules}
              openedFromCard={openedFromCard}
              currentAppointmentId={currentAppointmentId}
              appointmentModalStore={appointmentModalStore}
              editMode={modalProps ? modalProps.editMode : false}
            />
          </Tabs.Panel>

          {(modalProps ? modalProps.editMode : true) && entityId && (
            <>
              <Tabs.Panel value={ScheduleAppointmentModalTabs.PLANNED_VISITS}>
                <AppointmentPlannedVisits
                  dateNow={dateNow}
                  entityId={entityId}
                  schedule={selectedSchedule}
                  openedFromCard={openedFromCard}
                  queryParams={modalProps?.queryParams}
                />
              </Tabs.Panel>

              <Tabs.Panel value={ScheduleAppointmentModalTabs.VISITS_HISTORY}>
                <AppointmentVisitsHistoryTable
                  dateNow={dateNow}
                  entityId={entityId}
                  openedFromCard={openedFromCard}
                  selectedSchedule={selectedSchedule}
                  currency={
                    appointmentModalStore.appointmentOrderStore?.currentCurrency.value ??
                    generalSettingsStore.accountSettings?.currency ??
                    Currency.USD
                  }
                />
              </Tabs.Panel>
            </>
          )}
        </Content>
      </Root>

      {WarningModal}
    </>
  );
};

export { AddAppointmentControl };
