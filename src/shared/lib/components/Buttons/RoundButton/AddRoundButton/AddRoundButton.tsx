import { PlusIcon } from '../../../../../assets';
import { RoundButton, type RoundButtonProps } from '../RoundButton';

type OmittedRoundButtonProps = Omit<RoundButtonProps, 'Icon'>;

const AddRoundButton = (props: OmittedRoundButtonProps) => {
  return <RoundButton {...props} Icon={<PlusIcon />} />;
};

export { AddRoundButton };
