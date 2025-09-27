import { DeleteButton, MyInput, PlusIconButton } from '@/shared';
import autoAnimate from '@formkit/auto-animate';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { KeyValueListModel, MyInputVariant } from '../../../models';

const Root = styled.div<{ $empty?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${p => (p.$empty ? '0' : '16px')};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const KeyValueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 16px 0;
  border-bottom: 1px solid var(--graphite-graphite-80);

  &:first-child {
    padding: 0 0 16px;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  color: var(--button-text-graphite-primary-text);
`;

interface Props {
  model: KeyValueListModel;
  variant?: MyInputVariant;
}

const KeyValueInput = observer((props: Props) => {
  const { model, variant } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'form.key_value_input',
  });

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current && autoAnimate(ref.current);
  }, [ref]);

  return (
    <Root $empty={model.value.length === 0}>
      <Wrapper ref={ref}>
        {model.value.map((m, idx) => (
          <KeyValueWrapper>
            <InputWrapper>
              <LabelWrapper>
                <Label>{t('key')}</Label>

                <DeleteButton onClick={() => model.remove(idx)} />
              </LabelWrapper>

              <MyInput model={m.key} variant={variant} />
            </InputWrapper>

            <InputWrapper>
              <Label>{t('value')}</Label>

              <MyInput model={m.value} variant={variant} />
            </InputWrapper>
          </KeyValueWrapper>
        ))}
      </Wrapper>

      <PlusIconButton isGreen text={t('add')} onClick={model.addEmpty} />
    </Root>
  );
});

KeyValueInput.displayName = 'KeyValueInput';
export { KeyValueInput };
