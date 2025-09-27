import { SubheaderButton, SubheaderSettingsIcon } from '@/shared';
import type { Ref } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  ref?: Ref<HTMLButtonElement>;
  settingsDrawerOpened: boolean;
  toggleSettingsDrawer: () => void;
}

const ReportsSettingsButton = (props: Props) => {
  const { ref, settingsDrawerOpened, toggleSettingsDrawer } = props;

  const { t } = useTranslation();

  return (
    <SubheaderButton
      ref={ref}
      iconChangeState
      text={t('settings')}
      active={settingsDrawerOpened}
      Icon={<SubheaderSettingsIcon />}
      onClick={toggleSettingsDrawer}
    />
  );
};

export { ReportsSettingsButton };
