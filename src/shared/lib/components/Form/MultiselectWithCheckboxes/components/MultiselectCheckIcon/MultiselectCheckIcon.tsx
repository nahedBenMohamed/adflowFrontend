import styled from 'styled-components';
import { CheckDoneIcon } from '../../../../../../assets';

const Root = styled.div<{ $visible: boolean }>`
  display: flex;

  width: 16px;
  height: 16px;

  scale: ${p => (p.$visible ? 1 : 0)};
  opacity: ${p => (p.$visible ? 1 : 0)};
  transition: var(--transition-200);
`;

interface Props {
  visible: boolean;
}

const MultiselectCheckIcon = (props: Props) => {
  const { visible } = props;

  return (
    <Root $visible={visible}>
      <CheckDoneIcon />
    </Root>
  );
};

export { MultiselectCheckIcon };
