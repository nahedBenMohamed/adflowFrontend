import { MuteLargeIcon, MuteSmallIcon } from '../../../../assets';
import type { TelephonyFunctionalButtonProps } from '../../../models';
import { TelephonyFunctionalButton } from '../TelephonyFunctionalButton/TelephonyFunctionalButton';

const MuteButton = (props: Omit<TelephonyFunctionalButtonProps, 'icons' | 'CustomButton'>) => {
  const { ...rest } = props;

  return (
    <TelephonyFunctionalButton
      {...rest}
      icons={{
        large: <MuteLargeIcon />,
        small: <MuteSmallIcon />,
      }}
    />
  );
};

export { MuteButton };
