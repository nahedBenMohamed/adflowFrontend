import { Hint } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  GiantOutlinedInput,
  GiantOutlinedTextarea,
  type SiteFormConsentFormData,
} from '../../../../../../../../shared';
import { ShowInFormControl } from '../../../ShowInFormControl/ShowInFormControl';

const Root = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TextControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LabelWithHintWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TextControlsLabel = styled.p`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

interface Props {
  siteFormConsentFormData: SiteFormConsentFormData;
}

const SiteFormConsentControls = observer((props: Props) => {
  const {
    siteFormConsentFormData: { text, linkUrl, linkText, isEnabled, defaultValue },
  } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix:
      'builder.pages.site_form_builder_page.site_form_builder_step3.consent_block.controls',
  });

  return (
    <Root>
      <Content>
        <ShowInFormControl title={t('show_consent_title')} model={isEnabled} />

        <LabelWithHintWrapper>
          <TextControlsLabel>{t('text_title')}</TextControlsLabel>

          <Hint text={t('text_hint')} size="big" />
        </LabelWithHintWrapper>

        <GiantOutlinedTextarea
          model={text}
          maxRows={5}
          placeholder={t('placeholders.text')}
          disabled={!isEnabled.value}
        />

        <TextControlsWrapper>
          <LabelWithHintWrapper>
            <TextControlsLabel>{t('link_text_title')}</TextControlsLabel>

            <Hint text={t('link_text_hint')} size="big" />
          </LabelWithHintWrapper>

          <GiantOutlinedInput
            smaller
            model={linkText}
            padding="16px 24px"
            disabled={!isEnabled.value}
            placeholder={t('placeholders.link_text')}
          />
        </TextControlsWrapper>

        <TextControlsWrapper>
          <LabelWithHintWrapper>
            <TextControlsLabel>{t('link_title')}</TextControlsLabel>

            <Hint text={t('link_hint')} size="big" />
          </LabelWithHintWrapper>

          <GiantOutlinedInput
            smaller
            padding="16px 24px"
            model={linkUrl}
            disabled={!isEnabled.value}
            placeholder={t('placeholders.link')}
          />
        </TextControlsWrapper>
      </Content>

      <ShowInFormControl
        title={t('consent_by_default_title')}
        model={defaultValue}
        disabled={!isEnabled.value}
      />
    </Root>
  );
});

export { SiteFormConsentControls };
