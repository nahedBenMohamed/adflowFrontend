import styled from 'styled-components';
import { OutlinedInputErrorIcon } from '../../../../../../../assets';
import { MyTooltip } from '../../../../../MyTooltip/MyTooltip/MyTooltip';

const Root = styled.div`
  position: absolute;
  top: 50%;
  right: 6px;

  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  transform: translateY(-50%);

  &:hover {
    cursor: pointer;
  }
`;

interface Props {
  errorMessage: string;
}

const ErrorIcon = (props: Props) => {
  const { errorMessage } = props;

  return (
    <MyTooltip withinPortal label={errorMessage}>
      <Root>
        <OutlinedInputErrorIcon />
      </Root>
    </MyTooltip>
  );
};

export { ErrorIcon };
