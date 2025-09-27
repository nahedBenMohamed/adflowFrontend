import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useGetVoximplantAvailablePhoneNumbers } from '../../../../api';
import { AccountInfoBlock } from '../AccountInfoBlock/AccountInfoBlock';

const NumbersInfo = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const VoximplantSubscriptionFee = () => {
  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.pages.calls_settings_account_page',
  });

  const { data: availableNumbers } = useGetVoximplantAvailablePhoneNumbers();

  return (
    <AccountInfoBlock
      amount={0}
      Controls={
        <NumbersInfo>
          {t('available_numbers', { amount: availableNumbers?.length ?? 0 })}
        </NumbersInfo>
      }
      label={<Trans t={t} i18nKey="subscription_fee" components={{ i: <i /> }} />}
    />
  );
};

export { VoximplantSubscriptionFee };
