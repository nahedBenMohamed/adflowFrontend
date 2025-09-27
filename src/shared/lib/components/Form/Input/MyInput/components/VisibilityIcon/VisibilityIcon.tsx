import { memo } from 'react';
import { VisibilityOffIcon, VisibilityOnIcon } from '../../../../../../../assets';
import type { MyInputVariant } from '../../../../../../models';
import { IconWrapper } from '../IconWrapper/IconWrapper';

interface Props {
  isPasswordShown: boolean;
  variant?: MyInputVariant;
  onClick?: () => void;
}

const VisibilityIcon = memo((props: Props) => {
  const { isPasswordShown, variant, onClick } = props;

  return (
    <IconWrapper
      type="button"
      $top={variant === 'outlined' ? '6px' : '4px'}
      $right={variant === 'outlined' ? '6px' : '0'}
      onClick={onClick}
    >
      {isPasswordShown ? <VisibilityOnIcon /> : <VisibilityOffIcon />}
    </IconWrapper>
  );
});

VisibilityIcon.displayName = 'VisibilityIcon';
export { VisibilityIcon };
