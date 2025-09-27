import { userStore } from '@/app';
import { SpanWithEllipsis, TruncateMixin, formatSeconds, type Nullable } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AfterIcon, OverdueIcon } from '../../../../../assets';
import { NotificationType } from '../../../../models';

interface FromUserProps {
  $seen: boolean;
  $overdue?: boolean;
}

export const FromUser = styled.div<FromUserProps>`
  display: flex;
  align-items: center;
  gap: 2px;

  color: var(--button-text-graphite-primary-text);
  transition: var(--transition-200);

  svg path {
    fill: ${p => p.$seen && 'var(--button-text-graphite-secondary-text)'};
  }

  ${p => p.$overdue && `color: var(--button-text-red-default)`};

  ${p => p.$seen && `color: var(--button-text-graphite-secondary-text)`};

  ${TruncateMixin}
`;

const TagAnnotationIconWrapper = styled.div`
  width: 20px;
  height: 20px;

  svg path {
    transition: var(--transition-200);
  }
`;

interface Props {
  seen: boolean;
  type: NotificationType;
  fromUser: Nullable<number>;
  startsIn: Nullable<number>;
}

const BlockHeaderAnnotation = (props: Props) => {
  const { seen, type, fromUser, startsIn } = props;

  const { t } = useTranslation('module.notifications', {
    keyPrefix: 'notifications.components.notifications_panel.ui.block_header_annotation',
  });

  if (!fromUser) return null;

  const fromUserName = userStore.getById(fromUser).fullName;
  const afterTime = startsIn ? formatSeconds(startsIn) : '';

  switch (type) {
    case NotificationType.TASK_OVERDUE:
    case NotificationType.ACTIVITY_OVERDUE:
      return (
        <FromUser $seen={seen} $overdue>
          <TagAnnotationIconWrapper>
            <OverdueIcon />
          </TagAnnotationIconWrapper>

          <SpanWithEllipsis text={t('overdue')} />
        </FromUser>
      );

    case NotificationType.TASK_OVERDUE_EMPLOYEE:
    case NotificationType.ACTIVITY_OVERDUE_EMPLOYEE:
      return (
        <FromUser $seen={seen} $overdue>
          <TagAnnotationIconWrapper>
            <OverdueIcon />
          </TagAnnotationIconWrapper>

          <SpanWithEllipsis text={t('overdue_employee', { employee: fromUserName })} />
        </FromUser>
      );

    case NotificationType.TASK_BEFORE_START:
    case NotificationType.ACTIVITY_BEFORE_START:
      return (
        <FromUser $seen={seen}>
          <TagAnnotationIconWrapper>
            <AfterIcon />
          </TagAnnotationIconWrapper>

          <SpanWithEllipsis text={t('after_time', { time: afterTime })} />
        </FromUser>
      );

    case NotificationType.ENTITY_IMPORT_COMPLETED:
      return (
        <FromUser $seen={seen}>
          <SpanWithEllipsis text={t('system_notice')} />
        </FromUser>
      );

    default:
      return (
        <FromUser $seen={seen}>
          <SpanWithEllipsis text={t('from_employee', { employee: fromUserName })} />
        </FromUser>
      );
  }
};

export { BlockHeaderAnnotation };
