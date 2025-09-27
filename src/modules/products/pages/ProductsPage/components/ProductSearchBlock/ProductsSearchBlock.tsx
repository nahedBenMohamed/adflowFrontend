import { ClearCrossIcon, MyInput, SearchIcon, type InputModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useRef, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

type SearchBlockVariant = 'default' | 'rounded';

interface RootProps {
  $width: CSSProperties['width'];
  $variant: SearchBlockVariant;
}

const Root = styled.div<RootProps>`
  position: relative;

  width: ${p => p.$width || '100%'};

  input {
    padding: ${p => (p.$variant === 'rounded' ? `4px 20px 4px 32px` : `0 24px`)};
    border-radius: ${p => p.$variant === 'rounded' && `14px`};
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 6px;
  top: 4px;

  width: 16px;
  height: 18px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 6px;
  top: 6px;

  width: 16px;
  height: 18px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg path {
    fill: var(--button-text-graphite-primary-text);
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-red-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-red-active);
    }
  }
`;

export interface ProductsSearchBlockProps {
  searchModel: InputModel;
  width?: CSSProperties['width'];
  variant?: SearchBlockVariant;
  onChange: (value: string) => void;
  onClear: () => void;
}

const ProductsSearchBlock = observer((props: ProductsSearchBlockProps) => {
  const { searchModel, width, variant = 'default', onChange, onClear } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.products_page.ui.product_search_block',
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onClear();

    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <Root $width={width} $variant={variant}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>

      <MyInput
        ref={inputRef}
        model={searchModel}
        height="28px"
        variant="outlined"
        placeholder={t('placeholders.search_products')}
        handleChange={onChange}
      />

      {searchModel.trimmedValue.length > 0 && (
        <ClearButton onClick={handleClear}>
          <ClearCrossIcon />
        </ClearButton>
      )}
    </Root>
  );
});

ProductsSearchBlock.displayName = 'ProductsSearchBlock';
export { ProductsSearchBlock };
