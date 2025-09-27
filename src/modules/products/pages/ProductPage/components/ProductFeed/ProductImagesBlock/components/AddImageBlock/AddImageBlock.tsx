import { MiniLoader, PlusSecondaryIcon } from '@/shared';
import { useRef, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useUploadProductImages } from '../../../../../../../api';

const Root = styled.div`
  width: 200px;
  height: 200px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid var(--graphite-graphite-80);
  border-radius: var(--border-radius-element);
`;

const AddButton = styled.div<{ $loading: boolean }>`
  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  border: 1px solid
    ${p => (p.$loading ? 'transparent' : 'var(--button-text-graphite-primary-text)')};
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }
`;

const AddButtonWrapper = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-secondary-text);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: var(--button-text-green-hover);

    svg path {
      fill: var(--button-text-green-hover);
    }

    ${AddButton} {
      border-color: var(--button-text-green-hover);
    }
  }

  &:active {
    color: var(--button-text-green-active);

    svg path {
      fill: var(--button-text-green-active);
    }

    ${AddButton} {
      border-color: var(--button-text-green-active);
    }
  }

  &:disabled {
    opacity: 0.5;

    pointer-events: none;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

interface Props {
  sectionId: number;
  productId: number;
}

const AddImageBlock = (props: Props) => {
  const { sectionId, productId } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.product_page.ui.product_feed',
  });

  const { mutateAsync: updateImages, isPending } = useUploadProductImages({ sectionId, productId });

  const inputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;

    if (files && files.length > 0) {
      await updateImages(files);

      target.value = '';
    }
  };

  return (
    <Root>
      <AddButtonWrapper disabled={isPending} onClick={() => inputRef.current?.click()}>
        <AddButton $loading={isPending}>
          {isPending ? (
            <MiniLoader color="var(--button-text-graphite-secondary-text)" />
          ) : (
            <PlusSecondaryIcon />
          )}
        </AddButton>

        {t('add_image')}
      </AddButtonWrapper>

      <HiddenInput
        ref={inputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.webp"
        onChange={onSelectFile}
      />
    </Root>
  );
};

export { AddImageBlock };
