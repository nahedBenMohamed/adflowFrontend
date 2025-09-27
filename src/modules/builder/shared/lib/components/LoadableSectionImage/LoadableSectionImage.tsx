import { SkeletonAnimationMixinLegacy } from '@/shared';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

const StyledImageWrapper = styled.div<{ $imageLoaded: boolean }>`
  width: fit-content;
  height: fit-content;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  overflow: hidden;
  border-radius: var(--border-radius-block);
  transition: var(--transition-200);

  ${p =>
    !p.$imageLoaded &&
    css`
      ${SkeletonAnimationMixinLegacy}
    `}
`;

const StyledImage = styled.img<{ $loaded: boolean }>`
  width: 100%;
  min-width: 421px;
  height: auto;
  min-height: 241px;

  border: 1px solid var(--graphite-graphite-80);
  border-radius: var(--border-radius-block);
  opacity: ${p => (p.$loaded ? 1 : 0)};
  box-shadow:
    0px 1px 1px 0px #d0daeb,
    0px 0px 1px 0px #eef4fe;
  transition: var(--transition-200);
`;

interface Props {
  src: string;
  alt: string;
}

const LoadableSectionImage = (props: Props) => {
  const { src, alt } = props;

  const { t } = useTranslation();

  const loadedRef = useRef<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const [showSkeleton, setShowSkeleton] = useState(true);

  // to prevent flickering
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (loadedRef.current) setShowSkeleton(false);
    }, 1000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleImageLoad = useCallback(() => {
    loadedRef.current = true;
  }, []);

  return (
    <StyledImageWrapper
      $imageLoaded={!showSkeleton}
      title={showSkeleton ? t('loading_title') : undefined}
    >
      <StyledImage $loaded={!showSkeleton} alt={alt} src={src} onLoad={handleImageLoad} />
    </StyledImageWrapper>
  );
};

export { LoadableSectionImage };
