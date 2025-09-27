import { SpanWithEllipsis, TaskTimeStatus, type UtcDate } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AccountTreeEmptyIcon, ClipIcon } from '../../../../../../../assets';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  margin-top: 16px;
`;

interface TagProps {
  $textColor: string;
  $bgColor?: string;
}

const Tag = styled.div<TagProps>`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: ${p => (p.$textColor ? p.$textColor : `var(--button-text-graphite-secondary-text)`)};

  padding: 4px 8px;
  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  ${p => p.$bgColor && `background-color: ${p.$bgColor};`};
`;

const Dot = styled.div<{ $color: string }>`
  width: 9px;
  height: 9px;

  // to align with text
  margin-top: 2px;
  border-radius: 50%;
  background-color: ${p => p.$color};
  transition: var(--transition-200);
`;

const AttachmentsBlock = styled.div<{ $isResolvedTask: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-primary-text);

  svg path {
    transition: var(--transition-200);

    ${p => p.$isResolvedTask && `fill: var(--button-text-graphite-secondary-text)`}
  }
`;

const RightContent = styled.div<{ $isResolvedTask: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  font-size: 12px;
  font-weight: 400;
  line-height: 17px;
  color: ${p =>
    p.$isResolvedTask
      ? `var(--button-text-graphite-secondary-text)`
      : `var(--button-text-graphite-primary-text)`};

  overflow: hidden;
  margin-left: auto;
  transition: var(--transition-200);
`;

interface Tag extends TagProps {
  title: string;
}

interface Props {
  reporterFullName: string;
  createdAt: UtcDate;
  timeStatus: TaskTimeStatus;
  subtaskCount?: number;
  attachmentCount?: number;
  isActivityType?: boolean;
}

const TaskItemBottom = observer((props: Props) => {
  const { reporterFullName, createdAt, timeStatus, subtaskCount, attachmentCount, isActivityType } =
    props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed.common',
  });

  const isResolvedTask = timeStatus === TaskTimeStatus.RESOLVED;

  const getTag = (): Tag => {
    switch (timeStatus) {
      case TaskTimeStatus.RESOLVED:
        return {
          $textColor: 'var(--button-text-graphite-secondary-text)',
          $bgColor: 'var(--graphite-graphite-20)',
          title: t(`item_tag.${isActivityType ? 'activities' : 'tasks'}.resolved`),
        };

      case TaskTimeStatus.EXPIRED:
        return {
          $textColor: 'var(--button-text-red-active)',
          title: t(`item_tag.${isActivityType ? 'activities' : 'tasks'}.expired`),
        };

      case TaskTimeStatus.ACTIVE_FUTURE:
        return {
          $textColor: 'var(--button-text-graphite-primary-text)',
          $bgColor: 'var(--graphite-graphite-20)',
          title: t(`item_tag.${isActivityType ? 'activities' : 'tasks'}.future`),
        };

      case TaskTimeStatus.ACTIVE_TODAY:
        return {
          $textColor: 'var(--button-text-green-active)',
          title: t(`item_tag.${isActivityType ? 'activities' : 'tasks'}.today`),
        };
    }
  };

  const tag = getTag();

  return (
    <Root>
      {tag && (
        <Tag $textColor={tag.$textColor} $bgColor={tag.$bgColor}>
          <Dot $color={tag.$textColor} />
          {tag.title}
        </Tag>
      )}

      {subtaskCount && (
        <AttachmentsBlock $isResolvedTask={isResolvedTask}>
          <AccountTreeEmptyIcon />
          {subtaskCount}
        </AttachmentsBlock>
      )}

      {attachmentCount && (
        <AttachmentsBlock $isResolvedTask={isResolvedTask}>
          <ClipIcon />
          {attachmentCount}
        </AttachmentsBlock>
      )}

      <RightContent $isResolvedTask={isResolvedTask}>
        <p>
          {t('reporter')}: <SpanWithEllipsis text={reporterFullName} showTitle />
        </p>

        {t('created_at', { day: createdAt.displayShort(), time: createdAt.displayTime() })}
      </RightContent>
    </Root>
  );
});

TaskItemBottom.displayName = 'TaskItemBottom';
export { TaskItemBottom };
