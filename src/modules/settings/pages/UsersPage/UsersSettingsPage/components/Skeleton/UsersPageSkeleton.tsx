import { SkeletonAnimationMixin } from '@/shared';
import styled from 'styled-components';
import { UserSettingsPageTitle } from '../UserSettingsPageTitle/UserSettingsPageTitle';

const CheckboxSkeleton = styled.div<{ $delay: number }>`
  width: 18px;
  height: 18px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

const TitleSkeleton = styled.div<{ $delay: number }>`
  height: 24px;
  width: 80px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListItemSkeleton = styled.div<{ $delay: number }>`
  height: 44px;

  margin-bottom: 8px;
  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

const UsersPageSkeleton = () => {
  return (
    <>
      <UserSettingsPageTitle>
        <CheckboxSkeleton $delay={0} />
        <TitleSkeleton $delay={300} />
      </UserSettingsPageTitle>

      <List>
        {new Array(5).fill(0).map((_, idx) => (
          <ListItemSkeleton key={idx} $delay={idx * 300} />
        ))}
      </List>
    </>
  );
};

export { UsersPageSkeleton };
