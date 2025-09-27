import { SkeletonAnimationMixin } from '@/shared';
import styled, { css } from 'styled-components';
import { UserSIPSettingsFormItemRoot } from '../UserSIPSettingsFormItem/UserSIPSettingsFormItem';

interface CommonSkeletonProps {
  $delay: number;
  $small?: boolean;
}

const CommonSkeletonStyles = css<CommonSkeletonProps>`
  height: 20px;

  border-radius: 4px;

  ${SkeletonAnimationMixin}
`;

const LabelSkeleton = styled.div<CommonSkeletonProps>`
  width: ${p => (p.$small ? 64 : 100)}px;

  ${CommonSkeletonStyles}
`;

const ValueSkeleton = styled.div<CommonSkeletonProps>`
  width: ${p => (p.$small ? 160 : 240)}px;

  ${CommonSkeletonStyles}
`;

const UserSIPSettingsModalSkeleton = () => {
  return Array.from({ length: 3 }).map((_, idx) => (
    <UserSIPSettingsFormItemRoot key={idx}>
      <LabelSkeleton $small={idx % 2 === 1} $delay={idx * 300} />

      <ValueSkeleton $small={idx % 2 === 0} $delay={idx * 300} />
    </UserSIPSettingsFormItemRoot>
  ));
};

export { UserSIPSettingsModalSkeleton };
