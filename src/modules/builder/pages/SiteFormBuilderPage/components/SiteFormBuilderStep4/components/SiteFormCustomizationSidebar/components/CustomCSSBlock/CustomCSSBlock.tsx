import { MyTextArea } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { SiteFormDesignCustomCSSFormData } from '../../../../../../../../shared';
import { SwitchBlock } from '../../../../../../../../shared';
import { CustomizationBlockTemplate } from '../CustomizationBlockTemplate/CustomizationBlockTemplate';

const TextareaWrapper = styled.div`
  font-family: var(--font-family-mono);

  textarea {
    padding: 12px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

interface Props {
  formCustomCSSFormData: SiteFormDesignCustomCSSFormData;
}

const CustomCSSBlock = observer((props: Props) => {
  const {
    formCustomCSSFormData: { enabled, customCss },
  } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix:
      'builder.pages.site_form_builder_page.site_form_builder_step4.sidebar.custom_css_block',
  });

  return (
    <CustomizationBlockTemplate title={t('custom_css')}>
      <Wrapper>
        <SwitchBlock model={enabled} text={t('enable_custom_css')} />

        {enabled.value && (
          <TextareaWrapper>
            <MyTextArea
              minRows={16}
              maxRows={32}
              model={customCss}
              variant="outlined"
              placeholder={t('placeholders.custom_css')}
            />
          </TextareaWrapper>
        )}
      </Wrapper>
    </CustomizationBlockTemplate>
  );
});

CustomCSSBlock.displayName = 'CustomCSSBlock';
export { CustomCSSBlock };
