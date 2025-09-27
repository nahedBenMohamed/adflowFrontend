import { RoundButtonSkeleton } from '@/shared';

const SectionHeaderControlsSkeleton = () => {
  return Array.from({ length: 3 }).map((_, idx) => (
    <RoundButtonSkeleton key={idx} delay={idx * 300} />
  ));
};

export { SectionHeaderControlsSkeleton };
