import { generalSettingsStore } from '@/app';
import { envUtil, Language, PrimaryButton, RequestBpmnFormModal } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  width: 100%;
  height: calc(100dvh - var(--header-with-subheader-height));

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;

  padding: 32px 0;
  background: #f4f8f2;
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const Heading = styled.h1`
  font-size: 45px;
  font-weight: 600;
  line-height: 56px;
  text-align: center;
  font-family: 'Geologica';
`;

const Subheading = styled.span`
  font-size: 32px;
  font-weight: 500;
  line-height: 40px;
  text-align: center;
`;

const Image = styled.img`
  width: 100%;
  height: auto;

  padding: 0 48px;
`;

const BPMNRequestSplashscreen = () => {
  const { t } = useTranslation('module.bpmn', {
    keyPrefix: 'bpmn.pages.bpmn_automations_page.bpmn_splashscreen',
  });

  const [
    isRequestBpmnFormModalOpened,
    { close: hideRequestBpmnFormModal, open: showRequestBpmnFormModal },
  ] = useDisclosure(false);

  const locale = generalSettingsStore.accountSettings?.language ?? Language.ENGLISH;

  return (
    <Root>
      <TextContent>
        <Heading>
          {t('heading')}
          <br />
          <Subheading>{envUtil.appRUSegment ? t('price_ru') : t('price_us')}</Subheading>
        </Heading>

        <PrimaryButton onClick={showRequestBpmnFormModal}>{t('form_button')}</PrimaryButton>
      </TextContent>

      <Image src={`/images/bpmn/${locale}/bpmn.svg`} />

      {isRequestBpmnFormModalOpened && (
        <RequestBpmnFormModal
          header={t('form_header')}
          isOpened={isRequestBpmnFormModalOpened}
          onClose={hideRequestBpmnFormModal}
        />
      )}
    </Root>
  );
};

export { BPMNRequestSplashscreen };
