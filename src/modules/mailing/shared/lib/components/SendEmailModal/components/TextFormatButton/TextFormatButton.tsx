import { PickerButton } from '@/shared';
import { memo } from 'react';
import styled from 'styled-components';
import { TextFormatIcon } from '../../../../../assets';

const TextFormatIconWrapper = styled.div`
  width: 16px;
  height: 16px;
`;

interface Props {
  active: boolean;
  toggleActive: () => void;
}

const TextFormatButton = memo((props: Props) => {
  const { active, toggleActive } = props;

  return (
    <PickerButton
      value={null}
      active={active}
      showValue={false}
      Icon={
        <TextFormatIconWrapper>
          <TextFormatIcon />
        </TextFormatIconWrapper>
      }
      onClick={toggleActive}
    />
  );
});

TextFormatButton.displayName = 'TextFormatButton';
export { TextFormatButton };
