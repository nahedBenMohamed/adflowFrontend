import { MediaBreakpoints } from '@/shared';
import type { CSSProperties, Ref } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { SkeletonAnimationMixin } from '../../../../mixins';

const Root = styled.div<{ $width: CSSProperties['width'] }>`
  ${p =>
    p.$width &&
    css`
      width: ${p.$width};

      flex-shrink: 0;
    `}

  display: flex;
  align-items: center;
  gap: 8px;

  @media ${MediaBreakpoints.SM} {
    width: 100%;
  }
`;

const PlayerBodySkeleton = styled.div<{ $delay: number }>`
  width: 100%;
  height: 32px;

  border-radius: 16px;
  background: var(--graphite-graphite-280);

  ${SkeletonAnimationMixin};
`;

const PlaybackSpeedSelectorSkeleton = styled.div<{ $delay: number }>`
  width: 26px;
  height: 20px;

  border-radius: var(--border-radius-element);
  background: var(--graphite-graphite-280);

  ${SkeletonAnimationMixin};
`;

interface Props {
  ref?: Ref<HTMLDivElement>;
  width?: CSSProperties['width'];
}

const PlayerSkeleton = (props: Props) => {
  const { ref, width = '100%' } = props;

  const { t } = useTranslation();

  return (
    <Root ref={ref} $width={width} title={t('loading_title')}>
      <PlayerBodySkeleton $delay={0} />
      <PlaybackSpeedSelectorSkeleton $delay={200} />
    </Root>
  );
};

export { PlayerSkeleton };
