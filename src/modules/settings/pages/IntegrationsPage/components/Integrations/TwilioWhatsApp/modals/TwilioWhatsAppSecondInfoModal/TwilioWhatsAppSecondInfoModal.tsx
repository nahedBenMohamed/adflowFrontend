import type { ModalControl } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { IntegrationInfoLink } from '../../../../IntegrationInfoLink/IntegrationInfoLink';
import { IntegrationInfoText } from '../../../../IntegrationInfoText/IntegrationInfoText';
import { IntegrationInfoTitle } from '../../../../IntegrationInfoTitle/IntegrationInfoTitle';
import { TwilioWhatsAppModalTemplate } from '../TwilioWhatsAppModalTemplate/TwilioWhatsAppModalTemplate';

const ListItem = styled.li`
  margin: 0 0 8px 16px;

  &::marker {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: var(--button-text-graphite-priory-text);
  }

  &:not(:first-child) {
    margin-top: 24px;
  }
`;

interface Props {
  control: ModalControl;
  onApprove: () => void;
  onCancel: () => void;
}

const TwilioWhatsAppSecondInfoModal = (props: Props) => {
  const { control, onApprove, onCancel } = props;

  const { t: t1 } = useTranslation('common', { keyPrefix: 'buttons' });
  const { t: t2 } = useTranslation(['page.settings', 'common'], {
    keyPrefix: 'settings_page.integrations_page.ui.whatsapp.whatsapp_second_info_modal',
  });

  return (
    <TwilioWhatsAppModalTemplate
      opened={control.opened}
      cancelTitle={t1('back')}
      onCancel={onCancel}
      hide={control.close}
      onApprove={onApprove}
    >
      <IntegrationInfoTitle>{t2('title')}</IntegrationInfoTitle>

      <ol>
        <ListItem>
          <IntegrationInfoText>{t2('step1')}</IntegrationInfoText>
        </ListItem>

        <IntegrationInfoLink
          label={t2('link1')}
          to="https://support.twilio.com/hc/en-us/articles/360044000194-Can-I-move-my-approved-WhatsApp-Number-to-Twilio-"
        />

        <ListItem>
          <IntegrationInfoText>{t2('step2')}</IntegrationInfoText>
        </ListItem>

        <IntegrationInfoLink label={t2('link2')} to="https://www.twilio.com/whatsapp/pricing" />
      </ol>
    </TwilioWhatsAppModalTemplate>
  );
};

export { TwilioWhatsAppSecondInfoModal };
