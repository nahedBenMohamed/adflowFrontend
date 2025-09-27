import styled from 'styled-components';
import { CheckDoneIcon } from '../../../../../../assets';

export const Root = styled.div<{ $active: boolean }>`
  position: absolute;

  left: 8px;

  width: 16px;
  height: 16px;

  opacity: ${p => (p.$active ? 1 : 0)};
  transform: scale(${p => (p.$active ? 1 : 0)});
  transition: var(--transition-200);
`;

interface Props {
  active: boolean;
}

const CheckIcon = (props: Props) => {
  const { active } = props;

  return (
    <Root $active={active}>
      <CheckDoneIcon />
    </Root>
  );
};

export { CheckIcon };
