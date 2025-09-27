import { SkeletonAnimationMixinLegacy, type FileInfo } from '@/shared';
import { memo, useState } from 'react';
import styled, { css } from 'styled-components';

const ImageWrapper = styled.div<{ $imageLoaded: boolean }>`
  width: 200px;
  height: 200px;

  flex-shrink: 0;

  overflow: hidden;
  border-radius: var(--border-radius-element);
  box-shadow:
    0px 1px 2px 0px #d0daeb,
    0px 0px 2px 0px #eef4fe;

  ${p =>
    !p.$imageLoaded &&
    css`
      ${SkeletonAnimationMixinLegacy}
    `}
`;

const StyledImage = styled.img<{ $loaded: boolean }>`
  width: 100%;
  height: 100%;

  object-fit: cover;
  opacity: ${p => (p.$loaded ? 1 : 0)};
  transition: var(--transition-200);
`;

interface Props {
  photoFileLink: FileInfo;
}

const ProductImageItem = memo((props: Props) => {
  const { photoFileLink } = props;

  const [imageLoaded, setImageLoaded] = useState(false);

  const { previewUrl } = photoFileLink;

  return (
    previewUrl && (
      <ImageWrapper $imageLoaded={imageLoaded}>
        <StyledImage $loaded={imageLoaded} src={previewUrl} onLoad={() => setImageLoaded(true)} />
      </ImageWrapper>
    )
  );
});

ProductImageItem.displayName = 'ProductImageItem';
export { ProductImageItem };
