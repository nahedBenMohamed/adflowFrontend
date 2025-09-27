import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { GoogleLogoDisabledIcon, GoogleLogoIcon } from '../../../../assets';

/* 
  we are using specific Google colors and styles from their guideline, do not change them without 
  checking the guideline first: https://developers.google.com/identity/branding-guidelines
*/

const Root = styled.button`
  height: 40px;

  display: flex;
  align-items: center;
  gap: 10px;

  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  line-height: 16px;
  font-style: normal;
  font-family: 'Roboto';

  border-radius: 2px;
  background: #346ef1;
  padding: 1px 10px 1px 1px;
  box-shadow:
    0px 0px 1px rgba(0, 0, 0, 0.084),
    0px 1px 1px rgba(0, 0, 0, 0.168);

  &:hover {
    cursor: pointer;
  }

  &:active {
    background: #3367d6;
  }

  &:focus {
    outline: 2px solid rgba(66, 133, 244, 0.3);
  }

  &:disabled {
    pointer-events: none;

    color: rgba(0 0 0 / 40%);

    background-color: rgba(0 0 0 / 8%);
  }
`;

const LogoWrapper = styled.div<{ $disabled?: boolean }>`
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  border-radius: 1px;
  background-color: ${p => (p.$disabled ? 'transparent' : '#ffffff')};
`;

interface Props {
  disabled?: boolean;
  onClick: () => void;
}

const ConnectGoogleButton = (props: Props) => {
  const { disabled, onClick } = props;

  const { t } = useTranslation('common');

  return (
    <Root aria-disabled={disabled} disabled={disabled} onClick={onClick}>
      <LogoWrapper $disabled={disabled}>
        {disabled ? <GoogleLogoDisabledIcon /> : <GoogleLogoIcon />}
      </LogoWrapper>

      {t('connect_with_google')}
    </Root>
  );
};

export { ConnectGoogleButton };
