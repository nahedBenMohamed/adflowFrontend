import styled from 'styled-components';
import { SkeletonAnimationMixinLegacy } from '../../../../mixins';
import { FormItem } from '../../../Form/components';
import { LabelSkeleton } from '../../../skeletons/LabelSkeleton/LabelSkeleton';
import { PickerButtonSkeleton } from '../../../skeletons/PickerButtonSkeleton/PickerButtonSkeleton';
import { AvatarBlock } from '../AvatarBlock/AvatarBlock';
import { FormWrapper } from '../FormWrapper/FormWrapper';
import { MainInfoBlock } from '../MainInfoBlock/MainInfoBlock';
import { MainInfoWrapper } from '../MainInfoWrapper/MainInfoWrapper';
import { SecondaryInfoBlock } from '../SecondaryInfoBlock/SecondaryInfoBlock';

const AvatarBlockSkeleton = styled.div`
  width: 220px;
  height: 220px;

  border-radius: var(--border-radius-block);

  ${SkeletonAnimationMixinLegacy}
`;

const InputSkeleton = styled.div`
  height: 22px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixinLegacy}
`;

const AnnotationSkeleton = styled.div`
  height: 28px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixinLegacy}
`;

const ChangePasswordButtonSkeleton = styled.div`
  height: 50px;
  width: 224px;

  flex-shrink: 0;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixinLegacy}
`;

const ProfileModalSkeleton = () => {
  return (
    <>
      <MainInfoBlock>
        <AvatarBlock>
          <AvatarBlockSkeleton />
          <AnnotationSkeleton />
        </AvatarBlock>

        <MainInfoWrapper>
          <FormItem gap="8px">
            <LabelSkeleton />
            <InputSkeleton />
          </FormItem>

          <FormItem gap="8px">
            <LabelSkeleton $small />
            <InputSkeleton />
          </FormItem>
        </MainInfoWrapper>
      </MainInfoBlock>

      <SecondaryInfoBlock>
        <FormWrapper>
          <FormItem gap="8px">
            <LabelSkeleton />
            <PickerButtonSkeleton />
          </FormItem>

          <FormItem gap="8px">
            <LabelSkeleton $small />
            <InputSkeleton />
          </FormItem>

          <FormItem gap="8px">
            <LabelSkeleton />
            <PickerButtonSkeleton largeLabel />
          </FormItem>

          <FormItem gap="8px">
            <LabelSkeleton />
            <InputSkeleton />
          </FormItem>
        </FormWrapper>

        <ChangePasswordButtonSkeleton />
      </SecondaryInfoBlock>
    </>
  );
};

export { ProfileModalSkeleton };
