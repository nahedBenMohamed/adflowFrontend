import { userStore } from '@/app';
import { UpdateActivityDto, activityTypeStore, type Activity } from '@/modules/tasks';
import { CreateButton, InputModel, TaskTimeStatus, type Optional } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ClockIcon } from '../../../../../../assets';
import type { FeedItemColorVariant } from '../../../../../helpers';
import { useFeedItemOutline } from '../../../../../hooks';
import { TaskTimeStatusIcons } from '../../../../../models';
import {
  AuthorBlock,
  DateBlock,
  FeedItem,
  FeedItemLeftBlock,
  FeedItemWrapper,
  InfoBlock,
  ItemInfo,
  ResultBlock,
} from '../../FeedItem';
import { TaskItemBottom } from '../../TaskBlock/components';
import type { CheckboxProps } from '../Common/FeedItem/FeedItem';
import type { FrameVariant, IndicatorVariant } from '../Common/ItemInfo/InfoBlock/InfoBlock';

interface DescriptionWrapperProps {
  $isResolved: boolean;
  $hasTopMargin: boolean;
}

const DescriptionWrapper = styled.div<DescriptionWrapperProps>`
  div {
    ${p => p.$isResolved && `color: var(--button-text-graphite-secondary-text);`}
  }

  ${p => p.$hasTopMargin && `margin-top: 16px;`}
`;

const ResultBlockWrapper = styled.div`
  display: flex;

  margin-top: 16px;
`;

interface Props {
  activity: Activity;
  onDelete: (activityId: number) => void;
  updateActivity: ({
    activityId,
    dto,
  }: {
    activityId: number;
    dto: UpdateActivityDto;
  }) => Promise<void>;
}

const ActivityBlock = observer((props: Props) => {
  const { activity, onDelete, updateActivity } = props;

  const { canDelete, canEdit } = activity.userRights;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed',
  });

  const highlighted = useFeedItemOutline(activity.createdAt);

  const creator = userStore.getById(activity.createdBy);
  const responsibleUser = userStore.getById(activity.responsibleUserId);
  const activityType = activityTypeStore.getById(activity.activityTypeId);

  const ActivityIcon = TaskTimeStatusIcons.get(activity.timeStatus());

  const [isEditMode, { toggle: toggleEditMode, close: hideEditMode }] = useDisclosure(false);
  const [isResultEditMode, { close: hideResultEditMode, open: showResultEditMode }] =
    useDisclosure(false);

  const resultModel = useLocalObservable(() => InputModel.create(activity.result ?? ''));
  const textModel = useLocalObservable(() => InputModel.create(activity.text));

  const getItemStyle = (): Optional<FeedItemColorVariant> => {
    switch (activity.timeStatus()) {
      case TaskTimeStatus.EXPIRED:
        return 'red';

      case TaskTimeStatus.ACTIVE_TODAY:
        return 'green';
    }
  };

  const handleResolve = useCallback(() => {
    activity.isResolved = !activity.isResolved;

    updateActivity?.({
      activityId: activity.id,
      dto: UpdateActivityDto.create({ isResolved: activity.isResolved }),
    });
  }, [activity, updateActivity]);

  const handleToggleEditMode = useCallback(() => {
    if (isEditMode) {
      resultModel.value = activity.result ?? '';
      textModel.value = activity.text;
    }

    toggleEditMode();
  }, [activity, isEditMode, resultModel, textModel, toggleEditMode]);

  const handleUpdateActivity = useCallback(
    (activity: Activity) =>
      updateActivity?.({ activityId: activity.id, dto: UpdateActivityDto.fromActivity(activity) }),
    [updateActivity]
  );

  const handleUpdateText = useCallback(() => {
    activity.text = textModel.value;

    handleUpdateActivity(activity);
    hideEditMode();
  }, [activity, textModel, handleUpdateActivity, hideEditMode]);

  const handleUpdateResult = useCallback(() => {
    activity.result = resultModel.value;

    handleUpdateActivity(activity);
    hideResultEditMode();
  }, [resultModel, activity, handleUpdateActivity, hideResultEditMode]);

  const getIndicator = (): Optional<IndicatorVariant> => {
    switch (activity.timeStatus()) {
      case TaskTimeStatus.ACTIVE_TODAY:
        return 'green';

      case TaskTimeStatus.EXPIRED:
        return 'red';

      default:
        return;
    }
  };

  const getFrameVariant = (): FrameVariant => {
    switch (activity.timeStatus()) {
      case TaskTimeStatus.ACTIVE_TODAY:
        return 'green-outline';

      case TaskTimeStatus.EXPIRED:
        return 'outlined-with-dark-icon';

      default:
        return 'outlined';
    }
  };

  const editDescriptionTextProps = useMemo(
    () => ({ isEditMode, textModel, onSave: handleUpdateText, hideEditMode }),
    [isEditMode, textModel, handleUpdateText, hideEditMode]
  );

  const editResultTextProps = useMemo(
    () => ({
      textModel: resultModel,
      isEditMode: isResultEditMode,
      onSave: handleUpdateResult,
      hideEditMode: hideResultEditMode,
    }),
    [isResultEditMode, resultModel, handleUpdateResult, hideResultEditMode]
  );

  const checkboxProps = useMemo<CheckboxProps>(
    () => ({
      disabled: !canEdit,
      checked: activity.isResolved,
      resolved: activity.isResolved,
      handleCheckboxChange: handleResolve,
    }),
    [activity.isResolved, canEdit, handleResolve]
  );

  return (
    <FeedItemWrapper>
      <FeedItemLeftBlock Icon={ActivityIcon} />

      <FeedItem
        title={activityType.name}
        highlighted={highlighted}
        itemStyle={getItemStyle()}
        checkboxProps={checkboxProps}
        isResolvedTask={activity.isResolved}
        dashed={activity.timeStatus() === TaskTimeStatus.ACTIVE_FUTURE}
        handleEdit={canEdit ? handleToggleEditMode : undefined}
        handleDelete={canDelete ? () => onDelete(activity.id) : undefined}
      >
        <ItemInfo>
          <AuthorBlock
            user={responsibleUser}
            title={t('activity_block.creator')}
            isResolvedTask={activity.isResolved}
          />
          {activity.startDate && (
            <DateBlock
              hideTime
              title={t('activity_block.start_date')}
              date={activity.startDate}
              isResolvedTask={activity.isResolved}
              indicatorVariant={getIndicator()}
              frameVariant={getFrameVariant()}
            />
          )}
          {activity.headerDateString() && (
            <InfoBlock
              title={t('activity_block.plan_time')}
              info={activity.headerDateString() ?? ''}
              isResolvedTask={activity.isResolved}
              indicatorVariant={getIndicator()}
              frameVariant={getFrameVariant()}
            >
              <ClockIcon />
            </InfoBlock>
          )}
        </ItemInfo>

        <DescriptionWrapper
          $hasTopMargin={activity.text.length > 0}
          $isResolved={activity.isResolved}
        >
          <ResultBlock
            noPadding={!isEditMode}
            text={activity.text}
            editTextProps={editDescriptionTextProps}
            isRedShowMoreButton={activity.timeStatus() === TaskTimeStatus.EXPIRED}
          />
        </DescriptionWrapper>

        <TaskItemBottom
          isActivityType
          reporterFullName={creator.fullName}
          createdAt={activity.createdAt}
          timeStatus={activity.timeStatus()}
        />

        <ResultBlockWrapper>
          {activity.result || isResultEditMode ? (
            <ResultBlock
              autoFocus
              text={activity.result || ''}
              editTextProps={editResultTextProps}
              isRedShowMoreButton={activity.timeStatus() === TaskTimeStatus.EXPIRED}
              bgColor={
                [TaskTimeStatus.ACTIVE_FUTURE, TaskTimeStatus.RESOLVED].includes(
                  activity.timeStatus()
                )
                  ? '#f3fded'
                  : 'var(--primary-statuses-white-0)'
              }
              handleClick={showResultEditMode}
            />
          ) : (
            <CreateButton customTitle={t('common.result')} onClick={showResultEditMode} />
          )}
        </ResultBlockWrapper>
      </FeedItem>
    </FeedItemWrapper>
  );
});

ActivityBlock.displayName = 'ActivityBlock';
export { ActivityBlock };
