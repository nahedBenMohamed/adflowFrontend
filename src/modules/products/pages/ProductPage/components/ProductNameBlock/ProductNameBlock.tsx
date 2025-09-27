import { MyInput, TruncateMixin, type InputModel } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

const Root = styled.div<{ $disabled: boolean }>`
  width: 100%;

  // to align with back link icon
  margin-bottom: 2px;

  ${TruncateMixin}

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;
    `}
`;

const Wrapper = styled.div`
  width: 100%;

  input {
    font-weight: 600;
    color: var(--graphite-graphite-840);
    padding: 0;
  }
`;

const Name = styled.span`
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: right;
  color: var(--graphite-graphite-840);

  &:hover {
    cursor: pointer;
  }
`;

interface Props {
  model: InputModel;
  disabled: boolean;
  onChange: (value: string) => void;
}

const ProductNameBlock = observer((props: Props) => {
  const { model, disabled, onChange } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.product_page.ui.product_name_block',
  });

  const [editMode, { close: hideEditMode, open: showEditMode }] = useDisclosure(false);

  const handleBlur = () => {
    if (model.validate()) hideEditMode();
  };

  return (
    <Root $disabled={disabled}>
      {editMode ? (
        <Wrapper>
          <MyInput
            autoFocus
            model={model}
            placeholder={t('placeholders.product_name')}
            onBlur={handleBlur}
            handleChange={onChange}
          />
        </Wrapper>
      ) : (
        <Name title={model.value} onClick={showEditMode}>
          {model.value}
        </Name>
      )}
    </Root>
  );
});

ProductNameBlock.displayName = 'ProductNameBlock';
export { ProductNameBlock };
