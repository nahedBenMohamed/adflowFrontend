import { envUtil, type ModalControl } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { IntegrationInfoLink } from '../../../../IntegrationInfoLink/IntegrationInfoLink';
import { IntegrationInfoText } from '../../../../IntegrationInfoText/IntegrationInfoText';
import { IntegrationInfoTitle } from '../../../../IntegrationInfoTitle/IntegrationInfoTitle';
import { TwilioWhatsAppModalTemplate } from '../TwilioWhatsAppModalTemplate/TwilioWhatsAppModalTemplate';

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const List = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ListItem = styled.li`
  margin-left: 16px;

  &::marker {
    color: var(--button-text-graphite-priory-text);
  }
`;

const NestedUnorderedList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;

  margin-top: 8px;
`;

const NestedUnorderedListItem = styled.li`
  display: flex;
  gap: 8px;

  padding-left: 4px;

  &::before {
    content: '';

    width: 4px;
    height: 4px;
    flex-shrink: 0;

    margin-top: 8px;
    border-radius: 50%;
    background-color: var(--button-text-graphite-priory-text);
  }
`;

interface Props {
  control: ModalControl;
  onApprove: () => void;
  onCancel: () => void;
}

const TwilioWhatsAppThirdInfoModal = (props: Props) => {
  const { control, onApprove, onCancel } = props;

  const { t: t1 } = useTranslation('common', { keyPrefix: 'buttons' });
  const { t: t2 } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.whatsapp.whatsapp_third_info_modal',
  });

  return (
    <TwilioWhatsAppModalTemplate
      opened={control.opened}
      cancelTitle={t1('back')}
      hide={control.close}
      onApprove={onApprove}
      onCancel={onCancel}
    >
      <TitleWrapper>
        <IntegrationInfoTitle>{t2('title')}</IntegrationInfoTitle>
        <IntegrationInfoText $gray>
          {t2('subtitle', { company: envUtil.appName })}
        </IntegrationInfoText>
      </TitleWrapper>

      <List>
        <ListItem>
          <IntegrationInfoText>
            {t2('step1')}{' '}
            <IntegrationInfoLink
              label="Twilio"
              type="secondary"
              to="https://www.twilio.com/try-twilio"
            />
            .
          </IntegrationInfoText>
        </ListItem>

        <ListItem>
          <IntegrationInfoText>{t2('step2')}</IntegrationInfoText>

          <NestedUnorderedList>
            <NestedUnorderedListItem>
              <IntegrationInfoText>
                {t2('step2_1_1')}{' '}
                <IntegrationInfoLink
                  type="secondary"
                  label={t2('step2_1_2')}
                  to="https://www.twilio.com/whatsapp/request-access"
                />{' '}
                {t2('step2_1_3')}
              </IntegrationInfoText>
            </NestedUnorderedListItem>

            <NestedUnorderedListItem>
              <IntegrationInfoText>
                {t2('step2_2_1')}{' '}
                <IntegrationInfoLink
                  type="secondary"
                  label={t2('step2_2_2')}
                  to="https://www.twilio.com/docs/whatsapp/tutorial/connect-number-business-profile#step-1-request-access-to-enable-your-twilio-numbers-for-whatsapp"
                />{' '}
                {t2('step2_2_3')}
              </IntegrationInfoText>
            </NestedUnorderedListItem>
          </NestedUnorderedList>
        </ListItem>

        <ListItem>
          <IntegrationInfoText>{t2('step3')}</IntegrationInfoText>
        </ListItem>

        <ListItem>
          <IntegrationInfoText>
            {t2('step4_1')}{' '}
            <IntegrationInfoLink
              type="secondary"
              label={t2('step4_2')}
              to="https://www.twilio.com/docs/whatsapp/tutorial/connect-number-business-profile#step-3-approve-twilio-to-send-messages-on-your-behalf"
            />{' '}
            {t2('step4_3')}
          </IntegrationInfoText>
        </ListItem>

        <ListItem>
          <IntegrationInfoText>{t2('step5')}</IntegrationInfoText>
        </ListItem>
      </List>
    </TwilioWhatsAppModalTemplate>
  );
};

export { TwilioWhatsAppThirdInfoModal };
