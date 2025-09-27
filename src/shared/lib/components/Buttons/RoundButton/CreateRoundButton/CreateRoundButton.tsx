import { CreateIcon } from '../../../../../assets';
import { RoundButton, type RoundButtonProps } from '../RoundButton';

type OmittedRoundButtonProps = Omit<RoundButtonProps, 'Icon'>;

const CreateRoundButton = (props: OmittedRoundButtonProps) => {
  return <RoundButton {...props} Icon={<CreateIcon />} />;
};

export { CreateRoundButton };
