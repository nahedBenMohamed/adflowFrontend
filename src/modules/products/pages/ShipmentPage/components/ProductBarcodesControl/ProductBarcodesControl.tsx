import { ClearCrossIcon, InputModel, MiniLoader, MyTooltip, useModalControl } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { useOnClickOutside } from 'usehooks-ts';
import {
  ScanBarcodeIcon,
  type CheckBarcodeResult,
  type ProductsSectionType,
} from '../../../../shared';
import { ProductDoesNotExistWarningModal } from '../ProductDoesNotExistWarningModal/ProductDoesNotExistWarningModal';
import { ProductIsNotInOrderWarningModal } from '../ProductIsNotInOrderWarningModal/ProductIsNotInOrderWarningModal';

const Root = styled.div`
  position: relative;
`;

const ScanBarcodeIconWrapper = styled.button<{ $active: boolean }>`
  position: absolute;
  left: 12px;
  top: 6px;

  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-blue-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-blue-active);
    }
  }

  ${p =>
    !p.$active &&
    css`
      top: 0;
      left: 0;

      width: 40px;
      height: 28px;

      border-radius: 16px;
    `}
`;

const ClearCrossIconWrapper = styled.button<{ $visible: boolean }>`
  position: absolute;
  right: 12px;
  top: 6px;

  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  opacity: ${p => (p.$visible ? 1 : 0)};
  scale: ${p => (p.$visible ? 1 : 0)};
  transition: var(--transition-200);

  svg path {
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

const StyledInput = styled.input<{ $active: boolean }>`
  outline: none;

  height: 28px;
  width: ${p => (p.$active ? 220 : 40)}px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  pointer-events: ${p => (p.$active ? 'auto' : 'none')};

  border-radius: 14px;
  padding: ${p => (p.$active ? '3px 36px 4px' : '3px 12px 4px')};
  border: 1px solid var(--button-text-graphite-secondary-text);
  transition: var(--transition-200);

  &:hover {
    cursor: ${p => (p.$active ? 'text' : 'pointer')};
  }

  &::placeholder {
    color: var(--button-text-graphite-secondary-text);
  }
`;

interface Props {
  entityId: number;
  entityTypeId: number;
  sectionId: number;
  sectionType: ProductsSectionType;
  orderId: number;
  checkBarcode: (barcode: string) => Promise<CheckBarcodeResult>;
}

const ProductBarcodesControl = observer((props: Props) => {
  const { entityId, entityTypeId, sectionId, sectionType, orderId, checkBarcode } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.shipment_page.ui.product_barcodes_control',
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const barcodeModel = useLocalObservable(() => InputModel.create().required());

  const [checking, setChecking] = useState(false);
  const [active, { toggle }] = useDisclosure(false);

  const productDoesNotExistWarningControl = useModalControl(false);
  const productIsNotInOrderWarningControl = useModalControl(false);

  const handleToggle = useCallback(() => {
    if (active) {
      barcodeModel.value = '';

      inputRef.current?.blur();
    } else {
      inputRef.current?.focus();
    }

    toggle();
  }, [active, barcodeModel, toggle]);

  useOnClickOutside(wrapperRef as RefObject<HTMLDivElement>, e => {
    const target = e.target as HTMLElement;

    // to prevent click outside event when warning modal is opened
    if (
      target.closest('.workspace__OverlayingModal--Overlay') ||
      target.closest('.workspace__OverlayingModal--Content')
    )
      return;

    if (active) handleToggle();
  });

  const [value, setValue] = useState(() => barcodeModel.value);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setValue(barcodeModel.value);
  }, [barcodeModel.value]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setValue(newValue);
    barcodeModel.setValue(newValue);
  };

  const onClear = () => {
    barcodeModel.value = '';

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const onEnter = async (e: KeyboardEvent<HTMLInputElement>): Promise<void> => {
    if (e.key !== 'Enter' || !barcodeModel.validate()) {
      return;
    }

    try {
      setChecking(true);

      const { productDoesNotExist: productDoesNotExists, productIsNotInOrder } = await checkBarcode(
        barcodeModel.value
      );

      if (productIsNotInOrder) {
        productIsNotInOrderWarningControl.open();

        return;
      }

      if (productDoesNotExists) {
        productDoesNotExistWarningControl.open();

        return;
      }

      onClear();
    } finally {
      setChecking(false);
    }
  };

  return (
    <>
      <MyTooltip disabled={active} position="bottom" label={t('barcode')}>
        <Root ref={wrapperRef}>
          <ScanBarcodeIconWrapper $active={active} onClick={handleToggle}>
            {checking ? (
              <MiniLoader color="var(--button-text-graphite-primary-text)" size="small" />
            ) : (
              <ScanBarcodeIcon />
            )}
          </ScanBarcodeIconWrapper>

          <StyledInput
            ref={inputRef}
            value={value}
            $active={active}
            placeholder={active ? t('barcode') : undefined}
            onChange={onChange}
            onKeyDown={onEnter}
          />

          {active && (
            <ClearCrossIconWrapper
              $visible={barcodeModel.trimmedValue.length > 0}
              onClick={onClear}
            >
              <ClearCrossIcon />
            </ClearCrossIconWrapper>
          )}
        </Root>
      </MyTooltip>

      {productIsNotInOrderWarningControl.opened && (
        <ProductIsNotInOrderWarningModal
          orderId={orderId}
          entityId={entityId}
          sectionId={sectionId}
          sectionType={sectionType}
          entityTypeId={entityTypeId}
          barcode={barcodeModel.value}
          control={productIsNotInOrderWarningControl}
          onClear={onClear}
        />
      )}

      {productDoesNotExistWarningControl.opened && (
        <ProductDoesNotExistWarningModal
          sectionId={sectionId}
          sectionType={sectionType}
          barcode={barcodeModel.value}
          control={productDoesNotExistWarningControl}
          onClear={onClear}
        />
      )}
    </>
  );
});

ProductBarcodesControl.displayName = 'ProductBarcodesControl';
export { ProductBarcodesControl };
