import { envUtil, PrimaryButton, type PrimaryButtonVariant } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { TelephonySmallIcon } from '../../../../../shared';
import { IntegrationInfoLink } from '../../IntegrationInfoLink/IntegrationInfoLink';
import { IntegrationInfoModalTemplate } from '../../IntegrationInfoModalTemplate/IntegrationInfoModalTemplate';
import { IntegrationInfoText } from '../../IntegrationInfoText/IntegrationInfoText';
import { IntegrationInfoTitle } from '../../IntegrationInfoTitle/IntegrationInfoTitle';
import {
  IntegrationOrderedList,
  IntegrationOrderedListItem,
} from '../../IntegrationOrderedList/IntegrationOrderedList.styles';

interface Props {
  buttonVariant: PrimaryButtonVariant;
}

const TelephonyIntegrationGuideInternational = (props: Props) => {
  const { buttonVariant } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.telephony_integration_guide_international',
  });

  const [opened, { close, open }] = useDisclosure(false);

  return (
    <>
      <PrimaryButton variant={buttonVariant} onClick={open}>
        {t('title')}
      </PrimaryButton>

      {opened && (
        <IntegrationInfoModalTemplate
          hideCancel
          isOpened={opened}
          maxHeight="700px"
          approveTitle={t('continue')}
          Icon={<TelephonySmallIcon />}
          headerTitle={t('modal_title')}
          onClose={close}
        >
          <IntegrationInfoTitle>{t('title')}</IntegrationInfoTitle>

          <IntegrationInfoTitle>{t('step1.title')}</IntegrationInfoTitle>

          <IntegrationOrderedList>
            <IntegrationOrderedListItem>{t('step1.item1')}</IntegrationOrderedListItem>
            <IntegrationOrderedListItem>{t('step1.item2')}</IntegrationOrderedListItem>
          </IntegrationOrderedList>

          <IntegrationInfoTitle>{t('step2.title')}</IntegrationInfoTitle>

          <IntegrationInfoText>{t('step2.annotation')}</IntegrationInfoText>

          <IntegrationInfoLink
            to="https://voximplant.com/pricing"
            label={t('step2.operator_site_and_billing')}
          />

          <IntegrationInfoTitle>{t('step3.title')}</IntegrationInfoTitle>

          <IntegrationInfoText>
            {t('step3.annotation1', { companyName: envUtil.appName, mail: envUtil.appDemoEmail })}
          </IntegrationInfoText>

          <IntegrationInfoLink label={envUtil.appDemoEmail} to={`mailto:${envUtil.appDemoEmail}`} />

          <IntegrationOrderedList>
            <IntegrationOrderedListItem>{t('step3.item1')}</IntegrationOrderedListItem>
            <IntegrationOrderedListItem>{t('step3.item2')}</IntegrationOrderedListItem>
            <IntegrationOrderedListItem>{t('step3.item3')}</IntegrationOrderedListItem>
            <IntegrationOrderedListItem>{t('step3.item4')}</IntegrationOrderedListItem>
            <IntegrationOrderedListItem>{t('step3.item5')}</IntegrationOrderedListItem>
            <IntegrationOrderedListItem>{t('step3.item6')}</IntegrationOrderedListItem>
          </IntegrationOrderedList>

          <IntegrationInfoText>{t('step3.annotation2')}</IntegrationInfoText>

          <IntegrationInfoTitle>
            {t('step4.title', { companyName: envUtil.appName })}
          </IntegrationInfoTitle>

          <IntegrationInfoText>{t('step4.annotation1')}</IntegrationInfoText>

          <IntegrationInfoText>{t('step4.annotation2')}</IntegrationInfoText>

          <IntegrationInfoTitle>{t('step5.title')}</IntegrationInfoTitle>

          <IntegrationInfoText>{t('step5.annotation1')}</IntegrationInfoText>

          <IntegrationInfoText>{t('step5.annotation2')}</IntegrationInfoText>

          <IntegrationInfoText>{t('step5.annotation3')}</IntegrationInfoText>

          <IntegrationInfoLink
            label={t('step5.grant_chrome_access')}
            to="https://support.google.com/chrome/answer/2693767"
          />
          <IntegrationInfoLink
            label={t('step5.grant_mozilla_access')}
            to="https://support.mozilla.org/en-US/kb/how-manage-your-camera-and-microphone-permissions"
          />
          <IntegrationInfoLink
            label={t('step5.grant_safari_access')}
            to="https://support.apple.com/guide/mac-help/mchla1b1e1fe/mac"
          />

          <IntegrationInfoText>{t('step5.annotation4')}</IntegrationInfoText>
        </IntegrationInfoModalTemplate>
      )}
    </>
  );
};

export { TelephonyIntegrationGuideInternational };
