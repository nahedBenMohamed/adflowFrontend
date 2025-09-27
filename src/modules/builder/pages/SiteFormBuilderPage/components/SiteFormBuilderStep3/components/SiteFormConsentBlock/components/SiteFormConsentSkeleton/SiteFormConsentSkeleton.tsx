import { MyCheckbox } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  ConsentSkeletonBottomIcon,
  ConsentSkeletonTopIcon,
  type SiteFormConsentFormData,
} from '../../../../../../../../shared';

const Root = styled.div`
  width: 568px;

  display: flex;
  flex-direction: column;

  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 157px 44px 0px rgba(146, 151, 176, 0),
    0px 101px 40px 0px rgba(146, 151, 176, 0.01),
    0px 57px 34px 0px rgba(146, 151, 176, 0.05),
    0px 25px 25px 0px rgba(146, 151, 176, 0.09),
    0px 6px 14px 0px rgba(146, 151, 176, 0.1),
    0px 0px 0px 0px rgba(146, 151, 176, 0.1);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;

  padding: 16px;
  border-bottom: 1px solid var(--graphite-graphite-80);
`;

const TitleSkeleton = styled.div`
  width: 430px;
  height: 16px;

  display: flex;

  border-radius: 10px;
  background: var(--neutral-green-120);
`;

const ConsentSkeletonWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const ConsentSkeletonTextWrapper = styled.div`
  max-width: 100%;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ConsentText = styled.p`
  max-width: 100%;

  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;

  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  text-overflow: ellipsis;
  overflow-wrap: break-word;
  color: var(--button-text-graphite-primary-text);

  overflow: hidden;
`;

const ConsentLink = styled(Link)`
  max-width: 100%;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  font-size: 12px;
  font-weight: 400;
  line-height: 17px;
  text-overflow: ellipsis;
  overflow-wrap: break-word;
  text-decoration-line: underline;
  color: var(--primary-statuses-green-520);

  overflow: hidden;

  &:hover {
    color: var(--button-text-green-hover);
    text-decoration-line: underline;
  }

  &:active {
    color: var(--button-text-green-active);
  }
`;

const ButtonSkeletonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 24px 32px;
`;

const ButtonSkeleton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  color: var(--primary-statuses-white-0);

  padding: 12px 32px;
  border-radius: var(--border-radius-element);
  background: var(--button-text-green-active);
`;

interface Props {
  siteFormConsentFormData: SiteFormConsentFormData;
}

const SiteFormConsentSkeleton = observer((props: Props) => {
  const {
    siteFormConsentFormData: { text, linkUrl, linkText, defaultValue },
  } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix:
      'builder.pages.site_form_builder_page.site_form_builder_step3.consent_block.skeleton',
  });

  return (
    <Root>
      <Content>
        <TitleSkeleton />
      </Content>

      <Content>
        <ConsentSkeletonTopIcon />
        <ConsentSkeletonBottomIcon />

        <ConsentSkeletonWrapper>
          <MyCheckbox checked={defaultValue.value} readOnly hiddenlyDisabled />

          <ConsentSkeletonTextWrapper>
            <ConsentText>{text.value}</ConsentText>

            <ConsentLink to={linkUrl.value} target="_blank" rel="noopener noreferrer">
              {linkText.value}
            </ConsentLink>
          </ConsentSkeletonTextWrapper>
        </ConsentSkeletonWrapper>
      </Content>

      <ButtonSkeletonWrapper>
        <ButtonSkeleton>{t('button_text')}</ButtonSkeleton>
      </ButtonSkeletonWrapper>
    </Root>
  );
});

SiteFormConsentSkeleton.displayName = 'SiteFormConsentSkeleton';
export { SiteFormConsentSkeleton };
