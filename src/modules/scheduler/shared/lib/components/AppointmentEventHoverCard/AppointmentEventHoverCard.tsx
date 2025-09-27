import { userStore } from '@/app';
import {
  AvatarCircle,
  DropdownScrollbarMixin,
  MyHoverCard,
  MySelectColored,
  SkeletonAnimationMixin,
  type Nullable,
} from '@/shared';
import autoAnimate from '@formkit/auto-animate';
import type { FloatingPosition } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AppointmentEventHoverCardStore } from '../../../../store';
import { useGetScheduleAppointmentStatusesOptions } from '../../hooks';
import type { ScheduleAppointmentStatus } from '../../models';
import {
  AppointmentEventHoverCardBlock,
  AppointmentEventHoverCardEntityBlock,
  AppointmentEventHoverCardFormGroup,
  AppointmentEventHoverCardService,
} from './components';

const Root = styled.div`
  position: relative;

  max-height: 450px;

  display: flex;
  flex-direction: column;
  gap: 8px;

  ${DropdownScrollbarMixin}

  padding: 8px 8px 0 8px;
`;

const DescriptionWrapper = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const SelectWrapper = styled.div<{ $hasBorderTop: boolean }>`
  position: sticky;
  bottom: 0;

  z-index: 1;

  background: var(--primary-statuses-white-0);
  padding: ${p => (p.$hasBorderTop ? `8px 0` : `4px 0 8px`)};
  border-top: ${p => p.$hasBorderTop && `1px solid var(--graphite-graphite-80)`};
`;

const InfoSkeleton = styled.div<{ $delay: number }>`
  height: 100px;
  width: 100%;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin};
`;

const SelectSkeleton = styled.div<{ $delay: number }>`
  height: 30px;
  width: 100%;

  border-radius: var(--border-radius-element);

  margin-bottom: 8px;

  ${SkeletonAnimationMixin};
`;

const ResponsibleUserContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ResponsibleUserName = styled.span`
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  target: ReactNode;
  appointmentId: number;
  productsSectionId: Nullable<number>;
  isEditable?: boolean;
  position?: FloatingPosition;
  withinPortal?: boolean;
  zIndex?: CSSProperties['zIndex'];
}

const AppointmentEventHoverCard = observer((props: Props) => {
  const { target, appointmentId, productsSectionId, isEditable, position, withinPortal, zIndex } =
    props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page',
  });

  const [hoverCardKey, rerenderHoverCard] = useReducer(x => ++x, 0);

  const rootRef = useRef(null);

  useEffect(() => {
    rootRef.current && autoAnimate(rootRef.current);
  }, []);

  const {
    status,
    appointment,
    appointmentOrder,
    appointmentEntity,
    isLoaded,
    loadData,
    findServiceById,
    updateAppointmentStatus,
  } = useMemo(
    () => new AppointmentEventHoverCardStore({ appointmentId, productsSectionId }),
    [appointmentId, productsSectionId]
  );

  const appointmentStatuses = useGetScheduleAppointmentStatusesOptions();

  const handleChangeStatus = useCallback(
    (status: ScheduleAppointmentStatus) => {
      // we need to provide queryParams to update cache so that we can
      // rerender updated appointment in scheduler and display changes
      updateAppointmentStatus(status);

      // to force close hover card after update
      rerenderHoverCard();
    },
    [updateAppointmentStatus]
  );

  const responsibleUser = appointment?.ownerId ? userStore.getById(appointment.ownerId) : null;

  return (
    <MyHoverCard
      key={hoverCardKey}
      width={320}
      openDelay={200}
      zIndex={zIndex}
      target={target}
      position={position}
      withinPortal={withinPortal}
      onOpen={loadData}
    >
      <Root className="workspace__AppointmentEventHoverCard--Root" ref={rootRef}>
        {appointment && isLoaded ? (
          <>
            <AppointmentEventHoverCardBlock
              title={
                appointment.title ??
                appointmentEntity?.name ??
                t('visit', { number: appointment.id })
              }
            >
              {appointment.createdAt && (
                <AppointmentEventHoverCardFormGroup label={t('created')} gray>
                  {appointment.createdAt.format('DD.MM.YYYY – HH:mm')}
                </AppointmentEventHoverCardFormGroup>
              )}

              {appointmentEntity && (
                <AppointmentEventHoverCardEntityBlock appointmentEntity={appointmentEntity} />
              )}

              {appointment.comment && (
                <AppointmentEventHoverCardFormGroup
                  label={t('description')}
                  alignItems="flex-start"
                >
                  <DescriptionWrapper>{appointment.comment}</DescriptionWrapper>
                </AppointmentEventHoverCardFormGroup>
              )}

              {responsibleUser && (
                <AppointmentEventHoverCardFormGroup label={t('responsible')} alignItems="center">
                  <ResponsibleUserContentWrapper>
                    <AvatarCircle size="small" avatar={responsibleUser.getAvatar()} />

                    <ResponsibleUserName>{responsibleUser.fullName}</ResponsibleUserName>
                  </ResponsibleUserContentWrapper>
                </AppointmentEventHoverCardFormGroup>
              )}
            </AppointmentEventHoverCardBlock>

            {appointmentOrder &&
              appointmentOrder.items.map(oi => {
                const service = findServiceById(oi.productId);

                if (service)
                  return (
                    <AppointmentEventHoverCardService
                      key={oi.id}
                      orderItem={oi}
                      service={service}
                      currency={appointmentOrder?.currency}
                    />
                  );

                return null;
              })}

            <SelectWrapper
              $hasBorderTop={Boolean(appointmentOrder && appointmentOrder.items.length > 0)}
            >
              <MySelectColored
                withinPortal
                model={status}
                options={appointmentStatuses}
                disabled={!isEditable}
                handleChange={handleChangeStatus}
              />
            </SelectWrapper>
          </>
        ) : (
          <>
            <InfoSkeleton $delay={0} />

            <SelectSkeleton $delay={300} />
          </>
        )}
      </Root>
    </MyHoverCard>
  );
});

AppointmentEventHoverCard.displayName = 'AppointmentEventHoverCard';
export { AppointmentEventHoverCard };
