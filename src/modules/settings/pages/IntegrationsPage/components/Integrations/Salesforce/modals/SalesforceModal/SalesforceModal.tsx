import {
  DialogModalSecondary,
  InputModel,
  MyInput,
  PrimaryButton,
  envUtil,
  validateForm,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { SalesforceLogo } from '../../../../../../../shared';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  padding: 24px 32px;
`;

const SalesforceLogoWrapper = styled.div`
  width: 100%;

  display: flex;
`;

const ConnectButton = styled.button`
  width: 200px;
  height: 34px;

  flex-shrink: 0;

  color: var(--button-text-green-default);

  background: var(--graphite-graphite-40);
  border-radius: var(--border-radius-block);

  &:disabled {
    color: var(--button-text-graphite-secondary-text);
  }
`;

const Subtitle = styled.h2`
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const Controls = styled.div`
  margin-left: auto;
`;

const Caption = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  opened: boolean;
  connected: boolean;
  onClose: () => void;
  disconnect: () => void;
  connect: ({ domain, key, secret }: { domain: string; key: string; secret: string }) => void;
}

interface InitialForm {
  key: InputModel;
  domain: InputModel;
  secret: InputModel;
}

const SalesforceModal = observer((props: Props) => {
  const { opened, connected, connect, disconnect, onClose } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.salesforce.salesforce_modal',
  });

  const form = useLocalObservable<InitialForm>(() => ({
    key: InputModel.create().required(),
    domain: InputModel.create().required(),
    secret: InputModel.create().required(),
  }));

  const validateAndConnect = () => {
    if (!validateForm(form)) return;

    connect({
      key: form.key.trimmedValue,
      domain: form.domain.trimmedValue,
      secret: form.secret.trimmedValue,
    });
  };

  return (
    <DialogModalSecondary
      width="440px"
      height="524px"
      isOpened={opened}
      Header={t('title')}
      approveTitle={t('connect')}
      onClose={onClose}
      onApprove={validateAndConnect}
    >
      <Root>
        <SalesforceLogoWrapper>
          <SalesforceLogo />
        </SalesforceLogoWrapper>

        <ConnectButton disabled={!connected}>
          {connected ? 'Connected' : 'Not connected'}
        </ConnectButton>

        {connected ? (
          <Controls>
            <PrimaryButton onClick={disconnect}>{t('disconnect')}</PrimaryButton>
          </Controls>
        ) : (
          <>
            <Subtitle>{t('add_integration')}</Subtitle>

            <Caption>{t('caption', { company: envUtil.appName })}</Caption>

            <Form>
              <FormItemWrapper>
                <Label>{t('my_domain_name')}</Label>
                <MyInput variant="outlined" model={form.domain} hasBorderBottom />
              </FormItemWrapper>

              <FormItemWrapper>
                <Label>{t('app_key')}</Label>
                <MyInput variant="outlined" model={form.key} hasBorderBottom />
              </FormItemWrapper>

              <FormItemWrapper>
                <Label>{t('app_secret')}</Label>
                <MyInput variant="outlined" model={form.secret} hasBorderBottom />
              </FormItemWrapper>
            </Form>
          </>
        )}
      </Root>
    </DialogModalSecondary>
  );
});

SalesforceModal.displayName = 'SalesforceModal';
export { SalesforceModal };
