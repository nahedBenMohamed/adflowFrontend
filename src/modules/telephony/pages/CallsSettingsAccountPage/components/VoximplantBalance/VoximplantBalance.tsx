import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { AccountInfoBlock } from '../AccountInfoBlock/AccountInfoBlock';

const StyledLink = styled(Link)<{ $disabled: boolean }>`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--primary-blue);
  transition: var(--transition-200);

  &:hover {
    color: var(--button-text-blue-hover);
  }

  &:active {
    color: var(--button-text-blue-active);
  }

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;

      opacity: 0.6;
    `}
`;

interface Props {
  rechargeLink?: string;
}

const VoximplantBalance = (props: Props) => {
  const { rechargeLink } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.pages.calls_settings_account_page',
  });

  return (
    <AccountInfoBlock
      amount={0}
      label={<Trans t={t} i18nKey="voximplant_balance" components={{ i: <i /> }} />}
      Controls={
        <StyledLink
          target="_blank"
          to={rechargeLink ?? '/'}
          $disabled={!rechargeLink}
          rel="noopener noreferrer"
        >
          {t('recharge')}
        </StyledLink>
      }
    />
  );
};

export { VoximplantBalance };
