import { SkeletonAnimationMixin } from '@/shared';
import styled from 'styled-components';

const InputSkeleton = styled.div<{ $delay: number }>`
  height: 24px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

const EditorSkeleton = styled.div<{ $delay: number }>`
  height: 180px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

const MailboxSignatureEditorSkeleton = () => {
  return (
    <>
      <InputSkeleton $delay={0} />
      <EditorSkeleton $delay={300} />
    </>
  );
};

export { MailboxSignatureEditorSkeleton };
