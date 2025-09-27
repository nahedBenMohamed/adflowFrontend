import { iconStore } from '@/app';
import { IconName, MyTooltip } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useTelephonyContext } from '../../../../../context';
import { voximplantConnectorStore } from '../../../../../store';

const Root = styled.button`
  outline: none;

  height: var(--header-height);
  width: var(--sidebar-width);

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  background-color: var(--graphite-graphite-840);
  border-right: 1px solid var(--graphite-graphite-80);

  &:hover {
    cursor: pointer;
  }
`;

const WrapperWithBorder = styled.div`
  width: 40px;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  border-top: 1px solid var(--graphite-graphite-680);
`;

const IconWrapper = styled.div<{ $active: boolean }>`
  width: 32px;
  height: 32px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  border-radius: var(--border-radius-block);
  background-color: ${p =>
    p.$active ? iconStore.systemModuleColor : `var(--button-text-graphite-secondary-text)`};
`;

const TelephonyModuleButton = observer(() => {
  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.components.telephony_button',
  });

  const { show } = useTelephonyContext();

  const { connectedToVoximplant, loggedIn } = voximplantConnectorStore;

  const isTelephonyActive = connectedToVoximplant && loggedIn;

  return (
    <Root onClick={isTelephonyActive ? show : undefined}>
      <WrapperWithBorder>
        <MyTooltip
          offset={6}
          withinPortal
          position="right"
          label={isTelephonyActive ? t('telephony') : t('not_connected')}
        >
          <IconWrapper $active={isTelephonyActive}>
            {iconStore.getByName(IconName.CALL).icon}
          </IconWrapper>
        </MyTooltip>
      </WrapperWithBorder>
    </Root>
  );
});

TelephonyModuleButton.displayName = 'TelephonyModuleButton';
export { TelephonyModuleButton };
