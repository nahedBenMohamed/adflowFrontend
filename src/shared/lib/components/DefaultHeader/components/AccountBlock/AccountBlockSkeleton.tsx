import { RoundButtonSkeleton } from '../../../skeletons/RoundButtonSkeleton/RoundButtonSkeleton';

const AccountBlockSkeleton = () => {
  return Array.from({ length: 4 }).map((_, idx) => (
    <RoundButtonSkeleton key={idx} delay={idx * 300} />
  ));
};

export { AccountBlockSkeleton };
