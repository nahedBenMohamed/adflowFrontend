import { userStore } from '@/app';
import {
  formatSecondsToHoursAndMinutes,
  MyHoverCard,
  SpanWithEllipsis,
  UserList,
  useToggleControl,
} from '@/shared';
import type { FloatingPosition } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import type { UserTimeAllocation } from '../../../../../../api';
import { ScheduleIcon, TotalSpendTimeIcon } from '../../../../../assets';

const TitleBlock = styled.div`
  position: sticky;
  top: 0;

  display: flex;
  flex-direction: column;

  z-index: 1;

  background-color: var(--primary-statuses-white-0);
`;

const TitleGroupWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  padding: 8px;
  border-bottom: 1px solid var(--graphite-graphite-80);
`;

const TitleItem = styled.div`
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  text-transform: uppercase;
  color: var(--button-text-graphite-secondary-text);
`;

const TotalTimeTitle = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const ButtonWrapper = styled.button<{ $active: boolean }>`
  width: 20px;
  height: 20px;

  flex-shrink: 0;

  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    background-color: var(--graphite-graphite-80);
  }

  &:active {
    background-color: var(--graphite-graphite-80);
  }

  ${p => p.$active && `background-color: var(--graphite-graphite-80)`};
`;

const BigButtonWrapper = styled.button<{ $active: boolean }>`
  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg path,
  svg rect {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;
  }

  &:active {
    svg rect {
      stroke: var(--graphite-graphite-80);
      fill: var(--graphite-graphite-80);
    }
  }

  ${p =>
    p.$active &&
    css`
      svg path {
        stroke: var(--graphite-graphite-840);
      }

      svg rect {
        stroke: var(--primary-statuses-green-520);
      }
    `}
`;

const PlannedTime = styled.div<{ $inactive?: boolean }>`
  max-width: 76px;

  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: ${p =>
    p.$inactive
      ? 'var(--button-text-graphite-secondary-text)'
      : 'var(--button-text-graphite-primary-text)'};

  margin-left: auto;
`;

interface Props {
  timeAllocation: UserTimeAllocation[];
  bigTarget?: boolean;
  hoverCardPosition?: FloatingPosition;
}

const TimeAllocationCard = observer((props: Props) => {
  const { timeAllocation, hoverCardPosition = 'bottom-start', bigTarget } = props;

  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.time_allocation_card',
  });

  const cardControl = useToggleControl(false);

  const users = userStore.allUsers.filter(u => timeAllocation.find(a => a.userId === u.id));

  const renderTimeAllocation = (userId: number) => {
    const allocation = timeAllocation.find(a => a.userId === userId);

    if (!allocation) {
      throw new Error(`Failed to find time allocation for user ${userId}`);
    }

    const plannedTime = allocation.plannedTime;

    return (
      <PlannedTime $inactive={plannedTime === 0}>
        <SpanWithEllipsis text={formatSecondsToHoursAndMinutes({ seconds: plannedTime, t })} />
      </PlannedTime>
    );
  };

  return (
    <MyHoverCard
      withinPortal
      width="320px"
      openDelay={100}
      transition="scale-y"
      position={hoverCardPosition}
      target={
        bigTarget ? (
          <BigButtonWrapper $active={cardControl.active}>
            <TotalSpendTimeIcon />
          </BigButtonWrapper>
        ) : (
          <ButtonWrapper $active={cardControl.active}>
            <ScheduleIcon />
          </ButtonWrapper>
        )
      }
      onOpen={cardControl.open}
      onClose={cardControl.close}
    >
      <UserList
        padding="0 0 6px"
        listTitle={
          <TitleBlock>
            <TitleGroupWrapper>
              <TitleItem>{t('users')}</TitleItem>
              <TitleItem>{t('planned_time')}</TitleItem>
            </TitleGroupWrapper>

            {timeAllocation.length > 1 && (
              <TitleGroupWrapper>
                <TotalTimeTitle>{t('total')}</TotalTimeTitle>

                <PlannedTime>
                  <SpanWithEllipsis
                    text={formatSecondsToHoursAndMinutes({
                      seconds: timeAllocation.reduce((acc, a) => acc + a.plannedTime, 0),
                      t,
                    })}
                  />
                </PlannedTime>
              </TitleGroupWrapper>
            )}
          </TitleBlock>
        }
        users={users}
        hoverable={false}
        renderExtra={renderTimeAllocation}
      />
    </MyHoverCard>
  );
});

TimeAllocationCard.displayName = 'TimeAllocationCard';
export { TimeAllocationCard };
