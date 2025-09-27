import { Hint, MyCheckboxWithBooleanModel, type BooleanModel } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Subtitle = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: var(--button-text-graphite-priory-text);
`;

const CheckboxesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CheckboxWrapper = styled.label`
  display: flex;
  gap: 16px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  fieldLabelEnabled: BooleanModel;
  fieldPlaceholderEnabled: BooleanModel;
}

const FieldAttributesBlock = (props: Props) => {
  const { fieldLabelEnabled, fieldPlaceholderEnabled } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix:
      'builder.pages.site_form_builder_page.site_form_builder_step2.sidebar.field_attributes',
  });

  return (
    <Root>
      <Subtitle>
        {t('title')} <Hint size="big" text={t('hint')} />
      </Subtitle>

      <CheckboxesWrapper>
        <CheckboxWrapper>
          <MyCheckboxWithBooleanModel model={fieldLabelEnabled} variant="bigger" />
          {t('label_name')}
        </CheckboxWrapper>

        <CheckboxWrapper>
          <MyCheckboxWithBooleanModel model={fieldPlaceholderEnabled} variant="bigger" />
          {t('placeholder_name')}
        </CheckboxWrapper>
      </CheckboxesWrapper>
    </Root>
  );
};

export { FieldAttributesBlock };
