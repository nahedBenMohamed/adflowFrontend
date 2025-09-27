import { FormItem, LabelSkeleton, PickerButtonSkeleton, SkeletonAnimationMixin } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  Delimiter,
  IconsBlock,
  LeftBlock,
  LeftBlockHeader,
  RightBlock,
  RightBlockContent,
  RightBlockHeader,
} from '../UpdateTaskModal/UpdateTaskModal.styles';

const TitleSkeleton = styled.div<{ $delay: number }>`
  height: 27px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

const TagSkeleton = styled.div<{ $delay: number }>`
  height: 22px;
  width: 120px;

  margin-top: 2px;
  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

const TextEditorSkeleton = styled.div<{ $delay: number }>`
  height: 160px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

const SubtasksSkeletonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  padding-left: 16px;
`;

const SubtaskWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CheckboxSkeleton = styled.div<{ $delay: number }>`
  height: 18px;
  width: 18px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

const CommentSkeletonWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const AvatarSkeleton = styled.div<{ $delay: number }>`
  height: 26px;
  width: 26px;

  border-radius: 50%;

  ${SkeletonAnimationMixin}
`;

const CommentInputSkeleton = styled.div<{ $delay: number }>`
  height: 48px;
  width: 100%;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

const CompleteButtonSkeleton = styled.div<{ $delay: number }>`
  height: 32px;
  width: 97px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

const ButtonSkeleton = styled.div<{ $delay: number }>`
  height: 20px;
  width: 20px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

const PlannedTimeSkeleton = styled.div<{ $delay: number }>`
  height: 36px;
  width: 140px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

const ReporterAnnotationSkeleton = styled.div<{ $delay: number }>`
  height: 20px;
  width: 70%;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

const GAP = '8px';

const UpdateTaskModalSkeleton = () => {
  const { t } = useTranslation();

  return (
    <>
      <LeftBlock title={t('loading_title')}>
        <LeftBlockHeader>
          <TitleSkeleton $delay={0} />
          <TagSkeleton $delay={300} />
        </LeftBlockHeader>

        <FormItem gap={GAP}>
          <LabelSkeleton />

          <TextEditorSkeleton $delay={0} />
        </FormItem>

        <FormItem gap={GAP}>
          <LabelSkeleton />

          <SubtasksSkeletonWrapper>
            <SubtaskWrapper>
              <CheckboxSkeleton $delay={0} />
              <LabelSkeleton />
            </SubtaskWrapper>

            <SubtaskWrapper>
              <CheckboxSkeleton $delay={300} />
              <LabelSkeleton />
            </SubtaskWrapper>

            <SubtaskWrapper>
              <CheckboxSkeleton $delay={600} />
              <LabelSkeleton />
            </SubtaskWrapper>

            <SubtaskWrapper>
              <CheckboxSkeleton $delay={900} />
              <LabelSkeleton $small />
            </SubtaskWrapper>
          </SubtasksSkeletonWrapper>
        </FormItem>

        <FormItem gap={GAP}>
          <LabelSkeleton />

          <CommentSkeletonWrapper>
            <AvatarSkeleton $delay={0} />
            <CommentInputSkeleton $delay={300} />
          </CommentSkeletonWrapper>
        </FormItem>
      </LeftBlock>

      <Delimiter />

      <RightBlock title={t('loading_title')}>
        <RightBlockHeader>
          <CompleteButtonSkeleton $delay={0} />

          <IconsBlock>
            <ButtonSkeleton $delay={0} />
            <ButtonSkeleton $delay={300} />
          </IconsBlock>
        </RightBlockHeader>

        <RightBlockContent>
          <FormItem gap={GAP}>
            <LabelSkeleton />

            <PlannedTimeSkeleton $delay={0} />
          </FormItem>

          <FormItem gap={GAP}>
            <LabelSkeleton />

            <PickerButtonSkeleton />
          </FormItem>

          <FormItem gap={GAP}>
            <LabelSkeleton />

            <PickerButtonSkeleton largeLabel />
          </FormItem>

          <FormItem gap={GAP}>
            <LabelSkeleton />

            <PickerButtonSkeleton largeLabel />
          </FormItem>

          <FormItem gap={GAP}>
            <LabelSkeleton />

            <PickerButtonSkeleton />
          </FormItem>

          <ReporterAnnotationSkeleton $delay={300} />

          <FormItem gap={GAP}>
            <LabelSkeleton />

            <PickerButtonSkeleton />
          </FormItem>
        </RightBlockContent>
      </RightBlock>
    </>
  );
};

export { UpdateTaskModalSkeleton };
