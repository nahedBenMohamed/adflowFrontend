import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { SkeletonAnimationMixinLegacy } from '../../mixins';
import type { Avatar } from '../../models';
import { AvatarUtil, UrlUtil } from '../../utils';

interface InitialWrapperProps {
  $active: boolean;
  $bgColor: string;
  $size: AvatarSize;
  $hoverable: boolean;
  $noTransition?: boolean;
}

const InitialsWrapper = styled.div<InitialWrapperProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  line-height: 1;
  font-weight: 400;
  color: var(--primary-statuses-white-0);
  transition: ${p => (p.$noTransition ? 'none' : 'var(--transition-200)')};

  border-radius: 50%;
  background: ${p => p.$bgColor};

  ${p => {
    switch (p.$size) {
      case 'x-small':
        return css`
          width: 16px;
          height: 16px;
          font-size: 8px;
          line-height: 12px;
        `;

      case 'small':
        return css`
          width: 24px;
          height: 24px;
          font-size: 10px;
          line-height: 16px;
        `;

      case 'medium':
        return css`
          width: 26px;
          height: 26px;
          font-size: 11px;
          line-height: 17px;
        `;

      case 'x-medium':
        return css`
          width: 30px;
          height: 30px;
          font-size: 12px;
          line-height: 19px;
        `;

      case 'large':
        return css`
          width: 32px;
          height: 32px;
          font-size: 14px;
          line-height: 20px;
        `;

      case 'x-large':
        return css`
          width: 36px;
          height: 36px;
          font-size: 16px;
          line-height: 22px;
        `;

      case 'xx-large':
        return css`
          width: 48px;
          height: 48px;
          font-size: 18px;
          line-height: 29px;
          font-weight: 500;
        `;

      case 'xxx-large':
        return css`
          width: 56px;
          height: 56px;
          font-size: 18px;
          line-height: 29px;
          font-weight: 500;
        `;
    }
  }}

  ${p =>
    p.$hoverable &&
    css`
      &:hover {
        cursor: pointer;
      }
    `}

  ${p =>
    p.$active &&
    css`
      box-shadow: 0 0 0 2px var(--graphite-graphite-200);
    `}
`;

const StyledImageWrapper = styled.div<{ $imageLoaded: boolean }>`
  width: fit-content;
  height: fit-content;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  border-radius: 50%;

  ${p =>
    !p.$imageLoaded &&
    css`
      ${SkeletonAnimationMixinLegacy}
    `}
`;

interface StyledImageProps {
  $size: number;
  $grayscale: boolean;
  $hoverable: boolean;
  $active: boolean;
  $loaded: boolean;
  $noTransition?: boolean;
}

const StyledImage = styled.img<StyledImageProps>`
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  object-fit: cover;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  border-radius: 50%;
  opacity: ${p => (p.$loaded ? 1 : 0)};
  transition: ${p => (p.$noTransition ? 'none' : 'var(--transition-200)')};

  ${p =>
    p.$grayscale &&
    css`
      filter: grayscale(1.2);
    `}

  ${p =>
    p.$hoverable &&
    css`
      &:hover {
        cursor: pointer;
      }
    `}

  ${p => p.$active && `box-shadow: 0 0 0 2px var(--graphite-graphite-200)`};
`;

export type AvatarSize =
  | 'x-small'
  | 'small'
  | 'medium'
  | 'x-medium'
  | 'large'
  | 'x-large'
  | 'xx-large'
  | 'xxx-large';

const sizes: Record<AvatarSize, number> = {
  'x-small': 16,
  small: 24,
  medium: 26,
  'x-medium': 30,
  large: 32,
  'x-large': 36,
  'xx-large': 48,
  'xxx-large': 56,
};

interface Props {
  avatar: Avatar;
  filterGrayscale?: boolean;
  hoverable?: boolean;
  active?: boolean;
  size?: AvatarSize;
  noTransition?: boolean;
}

const AvatarCircle = memo((props: Props) => {
  const {
    avatar,
    filterGrayscale = false,
    hoverable = false,
    active = false,
    size = 'medium',
    noTransition,
  } = props;

  const { t } = useTranslation();

  const [showSkeleton, setShowSkeleton] = useState(false);
  const [loadingError, setLoadingError] = useState(false);

  const loadedRef = useRef(false);

  // to prevent flickering when we revealing small images from cache
  useEffect(() => {
    setTimeout(() => {
      if (!loadedRef.current) setShowSkeleton(true);
    }, 100);
  }, []);

  const handleImageLoad = useCallback(() => {
    loadedRef.current = true;

    setShowSkeleton(false);
  }, []);

  const { avatarUrl, firstName, lastName, isExternal } = avatar;

  const imageSize = sizes[size];

  const fullName = AvatarUtil.generateAvatarTitle(firstName, lastName);
  const initials = AvatarUtil.extractInitials(firstName, lastName);
  const initialsWrapperBgColor = AvatarUtil.getInitialsBackground(initials);

  const Initials = (
    <InitialsWrapper
      $size={size}
      $active={active}
      title={fullName}
      $hoverable={hoverable}
      $bgColor={initialsWrapperBgColor}
      $noTransition={noTransition}
    >
      {initials}
    </InitialsWrapper>
  );

  if (loadingError) return Initials;

  return avatarUrl ? (
    <StyledImageWrapper $imageLoaded={!showSkeleton} onError={() => setLoadingError(true)}>
      <StyledImage
        $loaded={!showSkeleton}
        $size={imageSize}
        src={
          isExternal
            ? avatarUrl
            : UrlUtil.addOrReplaceQueryParams({
                url: avatarUrl,
                queryParams: {
                  width: String(imageSize * 4),
                  height: String(imageSize * 4),
                },
              })
        }
        alt={t('avatar_alt', { firstName })}
        title={fullName}
        $grayscale={filterGrayscale}
        $hoverable={hoverable}
        $noTransition={noTransition}
        $active={active}
        onLoad={handleImageLoad}
      />
    </StyledImageWrapper>
  ) : (
    Initials
  );
});

AvatarCircle.displayName = 'AvatarCircle';
export { AvatarCircle };
