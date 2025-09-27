import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  GiantOutlinedInput,
  GiantUnderlinedInput,
  GratitudeSkeletonIcon,
  type SiteFormGratitudeFormData,
} from '../../../../../../shared';
import { BlockTemplate } from '../BlockTemplate/BlockTemplate';
import { ShowInFormControl } from '../ShowInFormControl/ShowInFormControl';

const Root = styled.div`
  width: 100%;

  display: flex;
  gap: 48px;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SkeletonIconWrapper = styled.div`
  width: 568px;

  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 157px 44px 0px rgba(146, 151, 176, 0),
    0px 101px 40px 0px rgba(146, 151, 176, 0.01),
    0px 57px 34px 0px rgba(146, 151, 176, 0.05),
    0px 25px 25px 0px rgba(146, 151, 176, 0.09),
    0px 6px 14px 0px rgba(146, 151, 176, 0.1),
    0px 0px 0px 0px rgba(146, 151, 176, 0.1);

  svg {
    width: 100%;
    height: auto;
  }
`;

const TextControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TextControlsLabel = styled.p`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

interface Props {
  siteFormGratitudeFormData: SiteFormGratitudeFormData;
}

const SiteFormGratitudeBlock = observer((props: Props) => {
  const {
    siteFormGratitudeFormData: {
      text: gratitudeText,
      header: gratitudeHeader,
      isEnabled: isGratitudeEnabled,
    },
  } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.site_form_builder_page.site_form_builder_step3.gratitude_block',
  });

  return (
    <BlockTemplate title={t('title')}>
      <Root>
        <Content>
          <ShowInFormControl title={t('show_gratitude_title')} model={isGratitudeEnabled} />

          <TextControlsWrapper>
            <TextControlsLabel>{t('gratitude_text')}</TextControlsLabel>

            <GiantUnderlinedInput
              padding="16px 24px"
              model={gratitudeHeader}
              placeholder={t('placeholders.header')}
              disabled={!isGratitudeEnabled.value}
            />

            <GiantOutlinedInput
              smaller
              padding="24px"
              model={gratitudeText}
              placeholder={t('placeholders.text')}
              disabled={!isGratitudeEnabled.value}
            />
          </TextControlsWrapper>
        </Content>

        <SkeletonIconWrapper>
          <GratitudeSkeletonIcon />
        </SkeletonIconWrapper>
      </Root>
    </BlockTemplate>
  );
});

SiteFormGratitudeBlock.displayName = 'SiteFormGratitudeBlock';
export { SiteFormGratitudeBlock };
