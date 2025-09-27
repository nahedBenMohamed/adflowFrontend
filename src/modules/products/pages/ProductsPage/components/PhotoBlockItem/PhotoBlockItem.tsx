import { DeleteButton, SkeletonAnimationMixinLegacy, type FileInfo } from '@/shared';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

const Root = styled.div<{ $imageLoaded: boolean }>`
  position: relative;

  width: 28px;
  height: 28px;

  overflow: hidden;
  border-radius: 2px;
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;
  transition: var(--transition-200);

  .workspace__DeleteButton--Root {
    position: absolute;
    top: 4px;
    left: 4px;

    scale: 0;
    opacity: 0;

    svg path {
      fill: var(--primary-statuses-white-0);
    }
  }

  &:hover {
    cursor: pointer;

    img {
      filter: brightness(0.6);
    }

    .workspace__DeleteButton--Root {
      scale: 1;
      opacity: 1;
    }
  }

  ${p =>
    !p.$imageLoaded &&
    css`
      box-shadow: none;

      ${SkeletonAnimationMixinLegacy}
    `}
`;

const StyledImage = styled.img<{ $loaded: boolean }>`
  width: 100%;
  height: 100%;

  object-position: 50% 50%;

  opacity: ${p => (p.$loaded ? 1 : 0)};
  transition: var(--transition-200);
`;

interface Props {
  file: FileInfo;
  onDelete: () => void;
}

const PhotoBlockItem = (props: Props) => {
  const { file, onDelete } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.products_page.ui.photo_block_item',
  });

  const [loaded, setLoaded] = useState(false);

  return (
    <Root $imageLoaded={loaded}>
      {file.previewUrl && (
        <StyledImage
          $loaded={loaded}
          src={file.previewUrl}
          onLoad={() => setLoaded(true)}
          alt={t('alt', { name: file.fileName })}
        />
      )}

      <DeleteButton onClick={onDelete} />
    </Root>
  );
};

export { PhotoBlockItem };
