import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AddToCallLargeIcon, AddToCallSmallIcon } from '../../../../assets';
import type { TelephonyFunctionalButtonProps } from '../../../models';
import { TelephonyFunctionalButton } from '../TelephonyFunctionalButton/TelephonyFunctionalButton';

const ButtonWrapper = styled.div`
  width: fit-content;
  height: fit-content;
`;

const AddToCallButton = (props: Omit<TelephonyFunctionalButtonProps, 'icons' | 'CustomButton'>) => {
  const { ...rest } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.components.telephony_modal',
  });

  return (
    <ButtonWrapper title={t('coming_soon')}>
      <TelephonyFunctionalButton
        {...rest}
        icons={{
          large: <AddToCallLargeIcon />,
          small: <AddToCallSmallIcon />,
        }}
      />
    </ButtonWrapper>
  );
};

export { AddToCallButton };
