import { routes, userStore } from '@/app';
import {
  AvatarCircle,
  MyCheckbox,
  SpanWithEllipsis,
  TaskTimeStatus,
  TruncateMixin,
  type Avatar,
} from '@/shared';
import { convert } from 'html-to-text';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, type MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { activityTypeStore, type TasksGroupStore } from '../../../../../store';
import {
  ActivityTypeTag,
  Body,
  Date,
  Footer,
  Header,
  ItemTemplate,
  Text,
} from '../../../../../templates';
import { TaskPalette, type Activity, type TaskColorStyle } from '../../../models';

export const TopRowWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DateWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

interface LinkWrapperProps {
  $resolved: boolean;
  $disabled: boolean;
}

const LinkWrapper = styled.div<LinkWrapperProps>`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--primary-blue);
  transition: var(--transition-200);

  a {
    color: ${p =>
      p.$resolved || p.$disabled
        ? 'var(--button-text-graphite-secondary-text)'
        : 'var(--primary-blue)'};

    &:hover {
      color: ${p =>
        p.$resolved ? 'var(--button-text-graphite-primary-text)' : 'var(--button-text-blue-hover)'};
    }

    &:active {
      color: ${p =>
        p.$resolved
          ? 'var(--button-text-graphite-secondary-text)'
          : 'var(--button-text-blue-active)'};
    }

    ${p => p.$disabled && `pointer-events: none`};
  }

  ${TruncateMixin}
`;

interface Props {
  idx: number;
  activity: Activity;
  taskGroupStore: TasksGroupStore;
  currentPageEncodedUrl?: string;
  handleMouseUp?: MouseEventHandler<HTMLDivElement>;
  handleMouseDown?: MouseEventHandler<HTMLDivElement>;
}

const ActivityItem = observer((props: Props) => {
  const {
    idx,
    activity,
    taskGroupStore: { toggleResolved },
    currentPageEncodedUrl,
    handleMouseUp,
    handleMouseDown,
  } = props;

  const {
    text,
    endDate,
    startDate,
    entityInfo,
    isResolved,
    activityTypeId,
    responsibleUserId,
    userRights: { canEdit },
  } = activity;

  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.activity_item',
  });

  const timeStatus = useMemo<TaskTimeStatus>(() => activity.timeStatus(), [activity]);
  const colorStyle = useMemo<TaskColorStyle>(() => TaskPalette[timeStatus], [timeStatus]);

  const responsibleUser = userStore.getById(responsibleUserId);
  const responsibleUserAvatar = useMemo<Avatar>(
    () => responsibleUser.getAvatar(),
    [responsibleUser]
  );

  const activityTypeName = activityTypeStore.getById(activityTypeId).name;

  const convertedText = useMemo<string>(() => convert(text), [text]);

  const handleToggleResolved = useCallback(
    () => toggleResolved(activity),
    [activity, toggleResolved]
  );

  return (
    <ItemTemplate
      idx={idx}
      canEdit={canEdit}
      baseTask={activity}
      dragDisabledTitle={t('drag_disabled')}
      handleMouseUp={handleMouseUp}
      handleMouseDown={handleMouseDown}
    >
      <Header>
        <TopRowWrapper>
          <MyCheckbox
            gray={isResolved}
            disabled={!canEdit}
            checked={isResolved}
            onChange={handleToggleResolved}
          />

          <ActivityTypeTag
            $resolved={isResolved}
            $bgColor={colorStyle.bgColor}
            $textColor={colorStyle.textColor}
            $hasBorder={timeStatus === TaskTimeStatus.ACTIVE_FUTURE}
          >
            <SpanWithEllipsis text={activityTypeName} showTitle={false} />
          </ActivityTypeTag>
        </TopRowWrapper>
      </Header>

      <Body>
        <DateWrapper>
          {startDate && (
            <Date $titleColor={colorStyle.titleColor} $resolved={activity.isResolved}>
              {startDate.format('MMM D')}
            </Date>
          )}

          {startDate && endDate && (
            <Date
              $resolved={isResolved}
              $titleColor={colorStyle.titleColor}
            >{`${startDate.displayTime()} – ${endDate.displayTime()}`}</Date>
          )}
        </DateWrapper>

        {convertedText.length > 0 && <Text $resolved={isResolved}>{convertedText}</Text>}
      </Body>

      <Footer>
        {entityInfo ? (
          <LinkWrapper
            $resolved={isResolved}
            $disabled={!entityInfo.hasAccess}
            title={entityInfo.hasAccess ? undefined : t('no_card_access')}
          >
            <Link
              to={routes.card({
                entityId: entityInfo.id,
                from: currentPageEncodedUrl,
                entityTypeId: entityInfo.entityTypeId,
              })}
            >
              <SpanWithEllipsis text={entityInfo.name} />
            </Link>
          </LinkWrapper>
        ) : (
          <div />
        )}

        <AvatarCircle avatar={responsibleUserAvatar} size="small" />
      </Footer>
    </ItemTemplate>
  );
});

ActivityItem.displayName = 'ActivityItem';
export { ActivityItem };
