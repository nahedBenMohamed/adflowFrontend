import { SkeletonAnimationMixinLegacy } from '@/shared/lib/mixins/SkeletonAnimationLegacy.mixin';
import styled from 'styled-components';
import {
  NotificationModalDelimiter,
  NotificationTypeBlock,
} from '../NotificationSettingsModal/components';

const NotificationBlockTitleSkeleton = styled.div<{ $large?: boolean }>`
  height: 20px;
  width: ${p => (p.$large ? '45%' : '35%')};

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixinLegacy}
`;

const SmallSwitchSkeleton = styled.div`
  height: 16px;
  width: 28px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixinLegacy}
`;

const SelectSkeleton = styled.div<{ $small?: boolean }>`
  height: 28px;
  width: ${p => (p.$small ? '40%' : '45%')};

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixinLegacy}
`;

const NotificationsSettingsModalSkeleton = () => {
  return (
    <>
      <NotificationTypeBlock>
        <NotificationBlockTitleSkeleton />
        <SmallSwitchSkeleton />
      </NotificationTypeBlock>

      <NotificationModalDelimiter />

      <NotificationTypeBlock>
        <NotificationBlockTitleSkeleton />
        <SmallSwitchSkeleton />
      </NotificationTypeBlock>
      <NotificationTypeBlock>
        <NotificationBlockTitleSkeleton $large />
        <SmallSwitchSkeleton />
      </NotificationTypeBlock>
      <NotificationTypeBlock>
        <NotificationBlockTitleSkeleton />
        <SelectSkeleton $small />
      </NotificationTypeBlock>
      <NotificationTypeBlock>
        <NotificationBlockTitleSkeleton />
        <SelectSkeleton />
      </NotificationTypeBlock>

      <NotificationModalDelimiter />

      <NotificationTypeBlock>
        <NotificationBlockTitleSkeleton $large />
        <SmallSwitchSkeleton />
      </NotificationTypeBlock>
      <NotificationTypeBlock>
        <NotificationBlockTitleSkeleton />
        <SmallSwitchSkeleton />
      </NotificationTypeBlock>
      <NotificationTypeBlock>
        <NotificationBlockTitleSkeleton />
        <SelectSkeleton $small />
      </NotificationTypeBlock>
      <NotificationTypeBlock>
        <NotificationBlockTitleSkeleton />
        <SelectSkeleton />
      </NotificationTypeBlock>
    </>
  );
};

export { NotificationsSettingsModalSkeleton };
