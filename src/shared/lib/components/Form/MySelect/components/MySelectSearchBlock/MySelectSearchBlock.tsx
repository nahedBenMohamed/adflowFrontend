import { observer } from 'mobx-react-lite';
import type { MouseEvent, Ref } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { SearchSmallIcon } from '../../../../../../assets';
import type { InputModel } from '../../../../../models';
import { MyInput } from '../../../Input/MyInput/MyInput';
import { ClearButton } from '../ClearButton/ClearButton';

const Root = styled.div`
  position: relative;
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;

  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  transform: translateY(-50%);
`;

const ClearButtonWrapper = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  transform: translateY(-50%);
`;

const SearchInputWrapper = styled.div<{ $active: boolean }>`
  width: 100%;

  border-bottom: ${p =>
    p.$active
      ? `2px solid var(--button-text-green-active)`
      : `2px solid var(--graphite-graphite-80)`};
  transition: var(--transition-200);

  input {
    padding: 12px 36px;

    &:focus,
    &:hover {
      border-color: transparent;
    }
  }
`;

interface Props {
  ref?: Ref<HTMLInputElement>;
  model: InputModel;
  handleClear: (e: MouseEvent<HTMLButtonElement>) => void;
}

const MySelectSearchBlock = observer((props: Props) => {
  const { ref, model, handleClear } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'form.my_select',
  });

  const hasValue = model.value.length > 0;

  return (
    <Root>
      <SearchIconWrapper>
        <SearchSmallIcon />
      </SearchIconWrapper>

      <SearchInputWrapper $active={hasValue}>
        <MyInput ref={ref} placeholder={t('search')} model={model} />
      </SearchInputWrapper>

      {hasValue && (
        <ClearButtonWrapper>
          <ClearButton onClick={handleClear} />
        </ClearButtonWrapper>
      )}
    </Root>
  );
});

MySelectSearchBlock.displayName = 'MySelectSearchBlock';
export { MySelectSearchBlock };
