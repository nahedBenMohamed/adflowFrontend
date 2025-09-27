import { userStore } from '@/app';
import { AvatarCircle, ColorUtil, type Nullable } from '@/shared';
import { memo, type CSSProperties, type MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { getAppointmentStatusColor } from '../../../helpers';
import type { ScheduleAppointment } from '../../../models';
import { AppointmentEventHoverCard } from '../../AppointmentEventHoverCard/AppointmentEventHoverCard';

const Placeholder = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-secondary-text);

  display: none;
`;

interface RootProps {
  $bgColor?: string;
  $editable?: boolean;
  $withPlaceholder?: boolean;
}

const Root = styled.div<RootProps>`
  height: 100%;
  min-height: 65px;
  min-width: 184px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;

  padding: 4px 8px;
  background-color: ${p =>
    p.$bgColor && `rgb(${ColorUtil.getBgColorRgbByPipelineVar(p.$bgColor)}, 0.25)`};
  border-radius: var(--border-radius-element);

  &:hover {
    cursor: ${p => (p.$editable ? 'pointer' : 'default')};

    ${p =>
      p.$withPlaceholder &&
      css`
        cursor: pointer;

        background-color: var(--graphite-graphite-40);

        & > p {
          display: block;
        }
      `}
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 4px;
`;

const Title = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const PrevCount = styled.div<{ $bgColor: CSSProperties['backgroundColor'] }>`
  width: 20px;
  height: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: var(--primary-statuses-white-0);

  margin-top: 2px;
  padding: 1px 6px;
  border-radius: 50%;
  background-color: ${p => p.$bgColor};
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

const HOVER_CARD_Z_INDEX = 10;

interface Props {
  productsSectionId: Nullable<number>;
  appointment?: ScheduleAppointment;
  canAddAppointment?: boolean;
  handleCreateAppointment: () => void;
  handleEditCell?: () => void;
}

const formatPrevAppointmentCount = (count?: Nullable<number>): number => {
  if (typeof count !== 'number') return 0;

  return count > 99 ? 99 : count;
};

const AppointmentCell = memo((props: Props) => {
  const {
    appointment,
    productsSectionId,
    canAddAppointment,
    handleCreateAppointment,
    handleEditCell,
  } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_board_view_page',
  });

  const text = t('create_appointment');

  if (!appointment) {
    if (canAddAppointment)
      return (
        <Root $withPlaceholder onClick={handleCreateAppointment}>
          <Placeholder>{text}</Placeholder>
        </Root>
      );

    return <Root $editable={false} />;
  }

  const { status, title, prevAppointmentCount } = appointment;

  const bgColor = getAppointmentStatusColor(status);
  const isEditable = appointment?.userRights.canEdit;

  const handleEdit: MouseEventHandler<HTMLDivElement> = e => {
    if (!isEditable || !handleEditCell) return;

    // prevent opening modal when clicking on hover card or status select
    const target = e.target as HTMLDivElement;
    if (
      target.closest('.workspace__AppointmentEventHoverCard--Root') ||
      target.closest('.workspace__MyDropdown--StyledDropdown')
    )
      return;

    handleEditCell();
  };

  const responsibleUser = appointment.ownerId ? userStore.getById(appointment.ownerId) : null;

  return (
    <Root $bgColor={bgColor} $editable={isEditable} onClick={handleEdit}>
      <TitleWrapper>
        <Title>{title}</Title>

        <AppointmentEventHoverCard
          position="right-start"
          isEditable={isEditable}
          zIndex={HOVER_CARD_Z_INDEX}
          appointmentId={appointment.id}
          productsSectionId={productsSectionId}
          target={
            <PrevCount $bgColor={bgColor}>
              {formatPrevAppointmentCount(prevAppointmentCount)}
            </PrevCount>
          }
        />
      </TitleWrapper>

      {responsibleUser && (
        <ResponsibleUserContentWrapper>
          <AvatarCircle size="small" avatar={responsibleUser.getAvatar()} />

          <ResponsibleUserName>{responsibleUser.fullName}</ResponsibleUserName>
        </ResponsibleUserContentWrapper>
      )}
    </Root>
  );
});

AppointmentCell.displayName = 'AppointmentCell';
export { AppointmentCell };
