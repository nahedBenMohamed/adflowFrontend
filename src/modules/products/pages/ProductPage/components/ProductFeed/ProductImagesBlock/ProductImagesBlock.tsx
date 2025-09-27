import { DeleteButton, FileUtil, MultiselectModel, MyCheckbox, type FileLink } from '@/shared';
import { Transition } from '@mantine/core';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { removeImagesFromProductCache } from '../../../../../api';
import { ProductImageItem } from '../../ProductImageItem/ProductImageItem';
import { AddImageBlock } from './components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 16px;
`;

const ImagesList = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const ProductImageItemWrapper = styled.div<{ $disabled: boolean }>`
  position: relative;

  &:hover {
    cursor: pointer;
  }

  ${p => p.$disabled && `pointer-events: none`};
`;

const CheckboxWrapper = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

interface Props {
  disabled: boolean;
  sectionId: number;
  productId: number;
  photoFileLinks: FileLink[];
}

const ProductImagesBlock = observer((props: Props) => {
  const { disabled, sectionId, productId, photoFileLinks } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.product_page.ui.product_feed',
  });

  const selectedImages = useLocalObservable(() => MultiselectModel.create<number>([]));

  const [deleting, setDeleting] = useState(false);

  const handleSelect = (id: number) => {
    if (disabled) return;

    if (selectedImages.values.includes(id)) {
      selectedImages.setValue(selectedImages.values.filter(v => v !== id));
    } else {
      selectedImages.setValue([...selectedImages.values, id]);
    }
  };

  const hasSelectedImages = selectedImages.values.length > 0;

  const handleDeleteImages = async (): Promise<void> => {
    if (disabled) return;

    if (selectedImages.values.length > 0) {
      try {
        setDeleting(true);

        await FileUtil.deleteFileLinks(selectedImages.values);
        removeImagesFromProductCache({ sectionId, productId, fileLinkIds: selectedImages.values });
      } finally {
        setDeleting(false);

        selectedImages.setValue([]);
      }
    }
  };

  return (
    <Root>
      <ImagesList>
        {!disabled && <AddImageBlock sectionId={sectionId} productId={productId} />}

        {photoFileLinks.map(f => (
          <ProductImageItemWrapper
            key={f.id}
            $disabled={disabled}
            onClick={() => handleSelect(f.id)}
          >
            {!disabled && (
              <CheckboxWrapper>
                <MyCheckbox checked={selectedImages.values.includes(f.id)} />
              </CheckboxWrapper>
            )}

            <ProductImageItem photoFileLink={f.fileInfo} />
          </ProductImageItemWrapper>
        ))}
      </ImagesList>

      {!disabled && (
        <Controls>
          <Transition mounted={hasSelectedImages} transition="pop">
            {styles => (
              <div style={{ ...styles }}>
                <DeleteButton
                  text={selectedImages.values.length > 1 ? t('delete_images') : t('delete_image')}
                  deleting={deleting}
                  onClick={handleDeleteImages}
                />
              </div>
            )}
          </Transition>
        </Controls>
      )}
    </Root>
  );
});

ProductImagesBlock.displayName = 'ProductImagesBlock';
export { ProductImagesBlock };
